import React, { useState, useEffect, useCallback } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Upload,
  FileText,
  Download,
  Copy,
  Check,
  ExternalLink,
  Shield,
  HardDrive,
  Info,
  Server
} from 'lucide-react';
import { checkR2Status, listR2Files, uploadToR2, getR2DownloadUrl, R2StatusResponse, R2FileInfo } from '../lib/r2Client';

export const R2StorageDashboard: React.FC = () => {
  const [status, setStatus] = useState<R2StatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<R2FileInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetCategory, setTargetCategory] = useState<'ebooks' | 'comics'>('ebooks');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await checkR2Status();
      setStatus(res);
      if (!res.connected) {
        setShowGuide(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      const list = await listR2Files();
      setFiles(list);
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchFiles();
  }, [fetchStatus, fetchFiles]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadMessage(null);
    try {
      const sanitizedName = selectedFile.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
      const fileKey = `${targetCategory}/${sanitizedName}`;
      const res = await uploadToR2(selectedFile, fileKey, targetCategory);
      setUploadMessage({
        type: 'success',
        text: `Fichier téléversé avec succès (${res.file.key}). ${res.file.isRealR2 ? 'Stocké sur Cloudflare R2' : 'Stocké en mémoire locale (mode démo)'}`
      });
      setSelectedFile(null);
      // Refresh files list
      await fetchFiles();
      await fetchStatus();
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : String(err);
      setUploadMessage({
        type: 'error',
        text: `Erreur téléversement : ${errText}`
      });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = async (fileKey: string) => {
    try {
      const res = await getR2DownloadUrl(fileKey);
      if (res.url) {
        window.open(res.url, '_blank');
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 o';
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
  };

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER & STATUS BANNER ================= */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  Stockage Cloudflare R2
                </h3>
                {loading ? (
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Vérification...
                  </span>
                ) : status?.connected ? (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connecté (Production)
                  </span>
                ) : (
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> Mode Émulation / Démo
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Stockage S3 serverless haute vitesse sans frais de bande passante (0€ Egress) pour vos fichiers EPUB, PDF et CBZ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                fetchStatus();
                fetchFiles();
              }}
              disabled={loading || loadingFiles}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading || loadingFiles ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              {showGuide ? 'Masquer le guide' : 'Guide de connexion'}
            </button>
          </div>
        </div>

        {/* METRICS & CONFIG DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Bucket R2
            </span>
            <div className="font-mono text-sm font-bold text-stone-900 mt-1 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{status?.bucketName || 'bookiin-ebooks'}</span>
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Compte Cloudflare
            </span>
            <div className="font-mono text-sm font-semibold text-stone-900 mt-1 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{status?.accountIdMasked || 'Non renseigné'}</span>
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Objets en stock
            </span>
            <div className="font-mono text-sm font-bold text-stone-900 mt-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{status?.objectCount ?? files.length} fichiers</span>
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Sécurité Téléchargement
            </span>
            <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pre-signed URLs (1h)</span>
            </div>
          </div>
        </div>

        {/* Message banner */}
        {status?.message && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
            status.connected 
              ? 'bg-emerald-50/80 text-emerald-800 border border-emerald-200' 
              : 'bg-amber-50/80 text-amber-800 border border-amber-200'
          }`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{status.message}</p>
          </div>
        )}
      </div>

      {/* ================= STEP-BY-STEP SETUP GUIDE ================= */}
      {showGuide && (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-md border border-stone-800 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-base font-serif text-white">
                Configuration Cloudflare R2 en 3 étapes simples
              </h4>
            </div>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 underline"
            >
              Ouvrir Cloudflare Dashboard <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 text-xs text-stone-300">
            <div className="space-y-2 bg-stone-800/60 p-4 rounded-xl border border-stone-700/50">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center text-xs">
                1
              </span>
              <p className="font-bold text-white text-sm">Créer le Bucket R2</p>
              <p className="leading-relaxed text-stone-400">
                Dans votre tableau de bord Cloudflare, cliquez sur <strong>R2 Storage</strong> &gt; <strong>Create bucket</strong>. 
                Nommez-le <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded">bookiin-ebooks</code> et choisissez l'emplacement automatique.
              </p>
            </div>

            <div className="space-y-2 bg-stone-800/60 p-4 rounded-xl border border-stone-700/50">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center text-xs">
                2
              </span>
              <p className="font-bold text-white text-sm">Générer un jeton API R2</p>
              <p className="leading-relaxed text-stone-400">
                Dans R2, cliquez sur <strong>Manage R2 API Tokens</strong> &gt; <strong>Create API token</strong>. 
                Donnez les permissions <em>Object Read & Write</em> et notez votre <strong>Account ID</strong>, <strong>Access Key ID</strong> et <strong>Secret Access Key</strong>.
              </p>
            </div>

            <div className="space-y-2 bg-stone-800/60 p-4 rounded-xl border border-stone-700/50">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center text-xs">
                3
              </span>
              <p className="font-bold text-white text-sm">Injecter les Variables</p>
              <p className="leading-relaxed text-stone-400">
                Ajoutez les 4 variables dans votre environnement ou fichier <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded">.env</code> :
              </p>
              <div className="font-mono text-[10px] bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-stone-300 space-y-1 overflow-x-auto">
                <div>R2_ACCOUNT_ID="votrecodexxx"</div>
                <div>R2_ACCESS_KEY_ID="votrecleid"</div>
                <div>R2_SECRET_ACCESS_KEY="votresecret"</div>
                <div>R2_BUCKET_NAME="bookiin-ebooks"</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPLOAD ZONE ================= */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h4 className="font-bold text-stone-900 text-base font-serif mb-1 flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-600" />
          Téléverser un nouveau livre ou manga vers R2
        </h4>
        <p className="text-xs text-stone-500 mb-5">
          Envoyez directement vos fichiers numériques (.EPUB, .PDF, .CBZ, .CBR) sur le bucket Cloudflare R2 pour les lier à vos fiches produits.
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Sélectionner le fichier numérique
              </label>
              <input
                type="file"
                accept=".epub,.pdf,.cbz,.cbr,application/epub+zip,application/pdf,application/vnd.comicbook+zip"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-stone-900 hover:file:bg-amber-400 cursor-pointer border border-stone-200 rounded-xl p-1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Dossier de destination
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value as 'ebooks' | 'comics')}
                className="w-full text-xs font-medium border border-stone-200 rounded-xl p-2.5 bg-stone-50 text-stone-800"
              >
                <option value="ebooks">ebooks/ (Romans, Essais, Manuels)</option>
                <option value="comics">comics/ (Bandes dessinées, Mangas)</option>
              </select>
            </div>
          </div>

          {uploadMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              uploadMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {uploadMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{uploadMessage.text}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Téléversement vers Cloudflare R2...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Envoyer sur Cloudflare R2
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ================= CLOUDFLARE R2 OBJECT EXPLORER ================= */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-stone-900 text-base font-serif flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-600" />
              Explorateur d'Objets Cloudflare R2 ({files.length})
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Fichiers présents dans le bucket. Copiez la clé R2 pour l'associer à n'importe quel livre du catalogue.
            </p>
          </div>
        </div>

        {loadingFiles ? (
          <div className="py-12 text-center text-xs text-stone-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-amber-600 mb-2" />
            Chargement des fichiers du bucket Cloudflare R2...
          </div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs bg-stone-50 rounded-xl border border-stone-100">
            Aucun fichier trouvé dans ce bucket pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Clé d'accès R2 (r2FileKey)</th>
                  <th className="py-3 px-3">Taille</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {files.map((file) => (
                  <tr key={file.key} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        file.format === 'EPUB'
                          ? 'bg-amber-100 text-amber-800'
                          : file.format === 'CBZ' || file.format === 'CBR'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {file.format}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-stone-800">
                        <span className="truncate max-w-xs sm:max-w-md">{file.key}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(file.key)}
                          title="Copier la clé R2"
                          className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                        >
                          {copiedKey === file.key ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(file.key)}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Télécharger depuis Cloudflare R2 (URL signée)"
                      >
                        <Download className="w-3 h-3 text-amber-600" />
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
