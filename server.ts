import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { CloudflareR2Service } from './src/server/r2Service.js';
import type { Readable } from 'stream';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer in-memory storage for handling file uploads before sending to R2
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit for rich manga/EPUBs
    },
  });

  // ==========================================
  // CLOUDFLARE R2 REST API ROUTES
  // ==========================================

  /**
   * Status and connection test
   */
  app.get('/api/r2/status', async (req, res) => {
    try {
      const status = await CloudflareR2Service.checkStatus();
      res.json(status);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        configured: false,
        connected: false,
        message: 'Erreur lors du test de connexion Cloudflare R2',
        error: errorMsg,
      });
    }
  });

  /**
   * List files stored in R2 bucket
   */
  app.get('/api/r2/list', async (req, res) => {
    try {
      const prefix = typeof req.query.prefix === 'string' ? req.query.prefix : undefined;
      const files = await CloudflareR2Service.listFiles(prefix);
      res.json({ files });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: errorMsg });
    }
  });

  /**
   * Get secure pre-signed download URL
   */
  app.get('/api/r2/download-url', async (req, res) => {
    try {
      const fileKey = typeof req.query.key === 'string' ? req.query.key : '';
      if (!fileKey) {
        return res.status(400).json({ error: 'fileKey requis (?key=...)' });
      }

      const result = await CloudflareR2Service.getDownloadUrl(fileKey);
      res.json(result);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: errorMsg });
    }
  });

  /**
   * Stream file directly from R2 or demo storage
   */
  app.get('/api/r2/stream/:key(*)', async (req, res) => {
    try {
      const fileKey = req.params.key;
      if (!fileKey) {
        return res.status(400).send('Clé de fichier requise');
      }

      const fileName = fileKey.split('/').pop() || 'ebook.epub';
      let contentType = 'application/octet-stream';
      if (fileName.endsWith('.epub')) contentType = 'application/epub+zip';
      else if (fileName.endsWith('.pdf')) contentType = 'application/pdf';
      else if (fileName.endsWith('.cbz')) contentType = 'application/vnd.comicbook+zip';
      else if (fileName.endsWith('.cbr')) contentType = 'application/x-cbr';

      const s3Response = await CloudflareR2Service.getObjectStream(fileKey);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

      if (s3Response && s3Response.Body) {
        if (s3Response.ContentLength) {
          res.setHeader('Content-Length', s3Response.ContentLength);
        }
        (s3Response.Body as Readable).pipe(res);
      } else {
        // Fallback for demo when R2 credentials aren't active yet: return an informative text or dummy stream
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(
          `Fichier R2 [${fileKey}].\nPour activer le téléchargement direct haute vitesse depuis Cloudflare R2, configurez vos clés R2 dans les variables d’environnement.`
        );
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      res.status(500).send(`Erreur lors du streaming R2 : ${errorMsg}`);
    }
  });

  /**
   * Upload ebook or comic file to Cloudflare R2
   */
  app.post('/api/r2/upload', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Aucun fichier transmis dans la requête.' });
      }

      // Generate key or use custom prefix
      const category = (req.body.category || 'ebooks').toLowerCase();
      const customKey = req.body.fileKey || `${category}/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const uploadResult = await CloudflareR2Service.uploadFile(
        customKey,
        file.buffer,
        file.mimetype
      );

      res.json({
        success: true,
        message: uploadResult.isRealR2
          ? 'Fichier téléversé avec succès sur votre bucket Cloudflare R2.'
          : 'Fichier enregistré en mode démo local (R2 non connecté).',
        file: uploadResult,
      });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: `Échec du téléversement vers R2 : ${errorMsg}` });
    }
  });

  // ==========================================
  // VITE OR STATIC FRONTEND SERVING
  // ==========================================
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bookiin Server] Serveur actif sur http://0.0.0.0:${PORT}`);
    console.log(`[Cloudflare R2] API endpoints montés sur /api/r2/*`);
  });
}

startServer().catch((err) => {
  console.error('Erreur au démarrage du serveur Express :', err);
});
