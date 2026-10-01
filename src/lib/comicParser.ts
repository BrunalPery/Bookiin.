import JSZip from 'jszip';
import { createExtractorFromData } from 'node-unrar-js';

export interface ExtractedComicPage {
  pageNumber: number;
  name: string;
  blobUrl: string;
  width?: number;
  height?: number;
}

export interface ComicArchiveResult {
  title: string;
  series?: string;
  author?: string;
  isManga?: boolean;
  pages: ExtractedComicPage[];
  totalPages: number;
  archiveType: 'cbz' | 'cbr';
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp'];

function isImageFile(filename: string): boolean {
  if (filename.includes('__MACOSX') || filename.startsWith('.')) return false;
  const lower = filename.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * Natural sort for comic pages (e.g., page1, page2, page10 instead of page1, page10, page2)
 */
function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Extract pages from a CBZ (ZIP) archive
 */
async function parseCbzBuffer(buffer: ArrayBuffer, fileName: string): Promise<ComicArchiveResult> {
  const zip = await JSZip.loadAsync(buffer);
  const imageEntries: { name: string; entry: JSZip.JSZipObject }[] = [];
  let comicInfoXml: string | null = null;

  zip.forEach((relativePath, entry) => {
    if (entry.dir) return;
    if (isImageFile(relativePath)) {
      imageEntries.push({ name: relativePath, entry });
    } else if (relativePath.toLowerCase().endsWith('comicinfo.xml')) {
      // Found ComicRack metadata
      entry.async('text').then((txt) => {
        comicInfoXml = txt;
      });
    }
  });

  if (imageEntries.length === 0) {
    throw new Error("Aucune image valide trouvée dans l'archive .CBZ. Formats supportés : JPG, PNG, WebP.");
  }

  // Sort images naturally by filename
  imageEntries.sort((a, b) => naturalSort(a.name, b.name));

  // Extract all images concurrently
  const pages: ExtractedComicPage[] = await Promise.all(
    imageEntries.map(async (item, idx) => {
      const blob = await item.entry.async('blob');
      const blobUrl = URL.createObjectURL(blob);
      return {
        pageNumber: idx + 1,
        name: item.name.split('/').pop() || item.name,
        blobUrl,
      };
    })
  );

  // Parse ComicInfo.xml if available
  let title = fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  let series = '';
  let author = '';
  let isManga = false;

  if (comicInfoXml) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(comicInfoXml, 'text/xml');
      const xmlTitle = xmlDoc.querySelector('Title')?.textContent;
      const xmlSeries = xmlDoc.querySelector('Series')?.textContent;
      const xmlWriter = xmlDoc.querySelector('Writer')?.textContent;
      const xmlManga = xmlDoc.querySelector('Manga')?.textContent;

      if (xmlTitle) title = xmlTitle;
      if (xmlSeries) series = xmlSeries;
      if (xmlWriter) author = xmlWriter;
      if (xmlManga && xmlManga.toLowerCase().includes('yes')) isManga = true;
    } catch {
      // Ignore XML parse errors
    }
  }

  return {
    title,
    series,
    author,
    isManga,
    pages,
    totalPages: pages.length,
    archiveType: 'cbz',
  };
}

/**
 * Extract pages from a CBR (RAR) archive
 */
async function parseCbrBuffer(buffer: ArrayBuffer, fileName: string): Promise<ComicArchiveResult> {
  try {
    const extractor = await createExtractorFromData({ data: buffer });
    const extracted = extractor.extract();
    const files = [...extracted.files];

    const imageFiles: { name: string; data: Uint8Array }[] = [];
    let comicInfoXml: string | null = null;

    for (const file of files) {
      const name = file.fileHeader.name;
      if (file.fileHeader.flags.directory) continue;

      if (isImageFile(name)) {
        if (file.extraction) {
          imageFiles.push({ name, data: file.extraction });
        }
      } else if (name.toLowerCase().endsWith('comicinfo.xml') && file.extraction) {
        comicInfoXml = new TextDecoder().decode(file.extraction);
      }
    }

    if (imageFiles.length === 0) {
      throw new Error("Aucune image valide trouvée dans l'archive .CBR.");
    }

    imageFiles.sort((a, b) => naturalSort(a.name, b.name));

    const pages: ExtractedComicPage[] = imageFiles.map((item, idx) => {
      const ext = item.name.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext === 'png') mimeType = 'image/png';
      else if (ext === 'webp') mimeType = 'image/webp';
      else if (ext === 'gif') mimeType = 'image/gif';

      const blob = new Blob([item.data as BlobPart], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      return {
        pageNumber: idx + 1,
        name: item.name.split(/[/\\]/).pop() || item.name,
        blobUrl,
      };
    });

    let title = fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    let series = '';
    let author = '';
    let isManga = false;

    if (comicInfoXml) {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(comicInfoXml, 'text/xml');
        const xmlTitle = xmlDoc.querySelector('Title')?.textContent;
        const xmlSeries = xmlDoc.querySelector('Series')?.textContent;
        const xmlWriter = xmlDoc.querySelector('Writer')?.textContent;
        const xmlManga = xmlDoc.querySelector('Manga')?.textContent;

        if (xmlTitle) title = xmlTitle;
        if (xmlSeries) series = xmlSeries;
        if (xmlWriter) author = xmlWriter;
        if (xmlManga && xmlManga.toLowerCase().includes('yes')) isManga = true;
      } catch {
        // Ignore XML parse errors
      }
    }

    return {
      title,
      series,
      author,
      isManga,
      pages,
      totalPages: pages.length,
      archiveType: 'cbr',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // If RAR extraction failed because the file is actually a zip renamed as .cbr (very frequent)
    if (message.includes('not a RAR') || message.includes('bad') || message.includes('header')) {
      return parseCbzBuffer(buffer, fileName);
    }
    throw new Error(`Erreur lors de la décompression du fichier .CBR : ${message}`);
  }
}

/**
 * Universal Parser: accepts a File or ArrayBuffer and handles both .CBZ and .CBR
 */
export async function parseComicFile(file: File | ArrayBuffer, originalFileName = 'Comic.cbz'): Promise<ComicArchiveResult> {
  const fileName = file instanceof File ? file.name : originalFileName;
  const buffer = file instanceof File ? await file.arrayBuffer() : file;

  // Check magic bytes
  const bytes = new Uint8Array(buffer.slice(0, 7));
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4B; // 'PK'
  const isRar = bytes[0] === 0x52 && bytes[1] === 0x61 && bytes[2] === 0x72 && bytes[3] === 0x21; // 'Rar!'

  const lowerName = fileName.toLowerCase();

  if (isZip || lowerName.endsWith('.cbz') || lowerName.endsWith('.zip')) {
    return parseCbzBuffer(buffer, fileName);
  } else if (isRar || lowerName.endsWith('.cbr') || lowerName.endsWith('.rar')) {
    return parseCbrBuffer(buffer, fileName);
  }

  // Fallback: try ZIP first then RAR
  try {
    return await parseCbzBuffer(buffer, fileName);
  } catch {
    return await parseCbrBuffer(buffer, fileName);
  }
}

/**
 * Revoke object URLs to prevent browser memory leaks
 */
export function revokeComicPages(pages: ExtractedComicPage[]) {
  for (const page of pages) {
    if (page.blobUrl && page.blobUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(page.blobUrl);
      } catch {
        // Ignore
      }
    }
  }
}
