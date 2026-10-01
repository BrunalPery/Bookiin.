export interface R2StatusResponse {
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

export interface R2FileInfo {
  key: string;
  size: number;
  lastModified?: string;
  format: 'EPUB' | 'PDF' | 'CBZ' | 'CBR' | 'AUTRE';
  url?: string;
}

export interface R2UploadResponse {
  success: boolean;
  message: string;
  file: {
    key: string;
    size: number;
    publicUrl?: string;
    isRealR2: boolean;
  };
}

/**
 * Check Cloudflare R2 backend connectivity
 */
export async function checkR2Status(): Promise<R2StatusResponse> {
  try {
    const res = await fetch('/api/r2/status');
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      configured: false,
      connected: false,
      accountIdMasked: null,
      bucketName: 'bookiin-ebooks',
      endpoint: null,
      publicUrl: null,
      message: `Impossible de contacter le serveur backend (/api/r2/status) : ${errorMsg}`,
      error: errorMsg,
    };
  }
}

/**
 * List files stored in the Cloudflare R2 bucket
 */
export async function listR2Files(prefix?: string): Promise<R2FileInfo[]> {
  try {
    const url = prefix ? `/api/r2/list?prefix=${encodeURIComponent(prefix)}` : '/api/r2/list';
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('Erreur listR2Files:', err);
    return [];
  }
}

/**
 * Get presigned download URL from Cloudflare R2
 */
export async function getR2DownloadUrl(fileKey: string): Promise<{ url: string; isRealR2: boolean }> {
  try {
    const res = await fetch(`/api/r2/download-url?key=${encodeURIComponent(fileKey)}`);
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`);
    }
    return await res.json();
  } catch {
    return {
      url: `/api/r2/stream/${encodeURIComponent(fileKey)}`,
      isRealR2: false,
    };
  }
}

/**
 * Upload an ebook / comic file to Cloudflare R2
 */
export async function uploadToR2(
  file: File,
  fileKey?: string,
  category?: string
): Promise<R2UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (fileKey) formData.append('fileKey', fileKey);
  if (category) formData.append('category', category);

  const res = await fetch('/api/r2/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: `Erreur HTTP ${res.status}` }));
    throw new Error(errData.error || `Erreur serveur (${res.status})`);
  }

  return await res.json();
}
