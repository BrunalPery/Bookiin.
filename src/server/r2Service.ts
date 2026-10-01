import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface R2ConfigStatus {
  configured: boolean;
  connected: boolean;
  accountIdMasked: string | null;
  bucketName: string;
  endpoint: string | null;
  publicUrl: string | null;
  message: string;
  error?: string;
  objectCount?: number;
}

export interface R2StoredFile {
  key: string;
  size: number;
  lastModified?: string;
  format: 'EPUB' | 'PDF' | 'CBZ' | 'CBR' | 'AUTRE';
  url?: string;
}

// In-memory demo fallback storage when R2 credentials are not set
const MOCK_R2_FILES: R2StoredFile[] = [
  {
    key: 'ebooks/le-petit-prince.epub',
    size: 1258291,
    lastModified: new Date(Date.now() - 86400000 * 3).toISOString(),
    format: 'EPUB',
  },
  {
    key: 'ebooks/vingt-mille-lieues-sous-les-mers.epub',
    size: 3565158,
    lastModified: new Date(Date.now() - 86400000 * 5).toISOString(),
    format: 'EPUB',
  },
  {
    key: 'ebooks/l-art-de-la-guerre-sun-tzu.epub',
    size: 1468006,
    lastModified: new Date(Date.now() - 86400000 * 2).toISOString(),
    format: 'EPUB',
  },
  {
    key: 'comics/alice-au-pays-des-merveilles.cbz',
    size: 23068672,
    lastModified: new Date(Date.now() - 86400000).toISOString(),
    format: 'CBZ',
  },
  {
    key: 'comics/roi-singe-wukong.cbz',
    size: 27682406,
    lastModified: new Date(Date.now() - 86400000 * 4).toISOString(),
    format: 'CBZ',
  },
];

export class CloudflareR2Service {
  private static client: S3Client | null = null;

  public static getAccountConfig() {
    const accountId = process.env.R2_ACCOUNT_ID?.trim();
    const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
    const bucketName = process.env.R2_BUCKET_NAME?.trim() || 'bookiin-ebooks';
    const publicUrl = process.env.R2_PUBLIC_URL?.trim() || null;

    const isConfigured = Boolean(
      accountId &&
      accessKeyId &&
      secretAccessKey &&
      !accountId.includes('your_cloudflare') &&
      !accessKeyId.includes('your_r2')
    );

    return {
      accountId: accountId || null,
      accessKeyId: accessKeyId || null,
      secretAccessKey: secretAccessKey || null,
      bucketName,
      publicUrl,
      isConfigured,
    };
  }

  public static getClient(): S3Client | null {
    const config = this.getAccountConfig();
    if (!config.isConfigured || !config.accountId || !config.accessKeyId || !config.secretAccessKey) {
      return null;
    }

    if (!this.client) {
      this.client = new S3Client({
        region: 'auto',
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      });
    }

    return this.client;
  }

  /**
   * Check connection status to Cloudflare R2
   */
  public static async checkStatus(): Promise<R2ConfigStatus> {
    const config = this.getAccountConfig();

    if (!config.isConfigured) {
      return {
        configured: false,
        connected: false,
        accountIdMasked: config.accountId
          ? `${config.accountId.substring(0, 4)}••••••••`
          : null,
        bucketName: config.bucketName,
        endpoint: null,
        publicUrl: config.publicUrl,
        message: 'Identifiants Cloudflare R2 non renseignés ou en mode démo.',
        objectCount: MOCK_R2_FILES.length,
      };
    }

    const client = this.getClient();
    if (!client) {
      return {
        configured: false,
        connected: false,
        accountIdMasked: null,
        bucketName: config.bucketName,
        endpoint: null,
        publicUrl: config.publicUrl,
        message: 'Impossible d’initialiser le client R2.',
      };
    }

    try {
      // Test connectivity by pinging bucket
      await client.send(new HeadBucketCommand({ Bucket: config.bucketName }));

      // Fetch current object count (first 1000)
      const listRes = await client.send(
        new ListObjectsV2Command({
          Bucket: config.bucketName,
          MaxKeys: 100,
        })
      );

      const objectCount = listRes.KeyCount ?? 0;

      return {
        configured: true,
        connected: true,
        accountIdMasked: `${config.accountId!.substring(0, 5)}••••••••${config.accountId!.slice(-4)}`,
        bucketName: config.bucketName,
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        publicUrl: config.publicUrl,
        message: `Connecté avec succès au bucket R2 « ${config.bucketName} ».`,
        objectCount,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        configured: true,
        connected: false,
        accountIdMasked: `${config.accountId!.substring(0, 4)}••••••••`,
        bucketName: config.bucketName,
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        publicUrl: config.publicUrl,
        message: `Erreur lors de la connexion au bucket R2 : ${errorMsg}`,
        error: errorMsg,
      };
    }
  }

  /**
   * List files in the R2 bucket (or return mock list if demo mode)
   */
  public static async listFiles(prefix?: string): Promise<R2StoredFile[]> {
    const client = this.getClient();
    const config = this.getAccountConfig();

    if (!client) {
      // Return mock storage files
      if (prefix) {
        return MOCK_R2_FILES.filter((f) => f.key.startsWith(prefix));
      }
      return MOCK_R2_FILES;
    }

    try {
      const command = new ListObjectsV2Command({
        Bucket: config.bucketName,
        Prefix: prefix || undefined,
        MaxKeys: 100,
      });

      const response = await client.send(command);
      if (!response.Contents) return [];

      return response.Contents.map((item) => {
        const key = item.Key || '';
        let format: R2StoredFile['format'] = 'AUTRE';
        if (key.endsWith('.epub')) format = 'EPUB';
        else if (key.endsWith('.pdf')) format = 'PDF';
        else if (key.endsWith('.cbz')) format = 'CBZ';
        else if (key.endsWith('.cbr')) format = 'CBR';

        const url = config.publicUrl ? `${config.publicUrl.replace(/\/$/, '')}/${key}` : undefined;

        return {
          key,
          size: item.Size || 0,
          lastModified: item.LastModified?.toISOString(),
          format,
          url,
        };
      });
    } catch (error) {
      console.warn('R2 listFiles error, returning mock files:', error);
      return MOCK_R2_FILES;
    }
  }

  /**
   * Generate a secure presigned download URL from Cloudflare R2
   */
  public static async getDownloadUrl(fileKey: string, expiresInSeconds = 3600): Promise<{ url: string; isRealR2: boolean }> {
    const client = this.getClient();
    const config = this.getAccountConfig();

    if (!client) {
      return {
        url: `/api/r2/stream/${encodeURIComponent(fileKey)}`,
        isRealR2: false,
      };
    }

    try {
      const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: fileKey,
        ResponseContentDisposition: `attachment; filename="${fileKey.split('/').pop() || 'book.epub'}"`,
      });

      const url = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
      return { url, isRealR2: true };
    } catch (error) {
      console.error('Error generating R2 signed URL:', error);
      return {
        url: `/api/r2/stream/${encodeURIComponent(fileKey)}`,
        isRealR2: false,
      };
    }
  }

  /**
   * Upload an ebook buffer directly to Cloudflare R2
   */
  public static async uploadFile(
    fileKey: string,
    fileBuffer: Buffer,
    contentType?: string
  ): Promise<{ success: boolean; key: string; size: number; publicUrl?: string; isRealR2: boolean }> {
    const client = this.getClient();
    const config = this.getAccountConfig();

    // Determine contentType
    let mime = contentType;
    if (!mime) {
      if (fileKey.endsWith('.epub')) mime = 'application/epub+zip';
      else if (fileKey.endsWith('.pdf')) mime = 'application/pdf';
      else if (fileKey.endsWith('.cbz')) mime = 'application/vnd.comicbook+zip';
      else if (fileKey.endsWith('.cbr')) mime = 'application/x-cbr';
      else mime = 'application/octet-stream';
    }

    if (!client) {
      // Store in memory demo array
      const existing = MOCK_R2_FILES.find((f) => f.key === fileKey);
      let format: R2StoredFile['format'] = 'AUTRE';
      if (fileKey.endsWith('.epub')) format = 'EPUB';
      else if (fileKey.endsWith('.pdf')) format = 'PDF';
      else if (fileKey.endsWith('.cbz')) format = 'CBZ';

      if (existing) {
        existing.size = fileBuffer.length;
        existing.lastModified = new Date().toISOString();
      } else {
        MOCK_R2_FILES.unshift({
          key: fileKey,
          size: fileBuffer.length,
          lastModified: new Date().toISOString(),
          format,
        });
      }

      return {
        success: true,
        key: fileKey,
        size: fileBuffer.length,
        publicUrl: `/api/r2/stream/${encodeURIComponent(fileKey)}`,
        isRealR2: false,
      };
    }

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: mime,
    });

    await client.send(command);

    const publicUrl = config.publicUrl
      ? `${config.publicUrl.replace(/\/$/, '')}/${fileKey}`
      : undefined;

    return {
      success: true,
      key: fileKey,
      size: fileBuffer.length,
      publicUrl,
      isRealR2: true,
    };
  }

  /**
   * Fetch object stream from R2
   */
  public static async getObjectStream(fileKey: string) {
    const client = this.getClient();
    const config = this.getAccountConfig();

    if (!client) {
      return null;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: fileKey,
      });

      return await client.send(command);
    } catch (err) {
      console.error('Error fetching stream from R2:', err);
      return null;
    }
  }
}
