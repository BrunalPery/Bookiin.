import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Download,
  FolderOpen,
  LayoutGrid,
  Columns2,
  FileText,
  Scroll,
  ArrowLeftRight,
  Sun,
  Moon,
  Info,
  Sliders,
  Check,
  Sparkles
} from 'lucide-react';
import { Book, ComicPage } from '../types';
import { parseComicFile, ExtractedComicPage, revokeComicPages } from '../lib/comicParser';
import { downloadCbz } from '../lib/bookDownloader';

export interface ComicReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBook?: Book | null;
  onOpenStoreBook?: (book: Book) => void;
}

type ViewMode = 'single' | 'double' | 'webtoon';
type ReadingDirection = 'ltr' | 'rtl'; // ltr = Western BD/Comics, rtl = Japanese Manga
type FitMode = 'height' | 'width' | 'original';
type AmbientBg = 'black' | 'dark' | 'sepia';

export const ComicReaderModal: React.FC<ComicReaderModalProps> = ({
  isOpen,
  onClose,
  initialBook,
}) => {
  // Comic state
  const [comicTitle, setComicTitle] = useState('Lecteur BD • Manga (.CBZ / .CBR)');
  const [comicAuthor, setComicAuthor] = useState('');
  const [pages, setPages] = useState<ExtractedComicPage[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // View Preferences
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [readingDirection, setReadingDirection] = useState<ReadingDirection>('ltr');
  const [fitMode, setFitMode] = useState<FitMode>('height');
  const [ambientBg, setAmbientBg] = useState<AmbientBg>('black');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Initialize or load pages from initialBook or demo
  useEffect(() => {
    if (!isOpen) return;

    if (initialBook && initialBook.comicPages && initialBook.comicPages.length > 0) {
      setComicTitle(initialBook.title);
      setComicAuthor(initialBook.author);
      const mappedPages: ExtractedComicPage[] = initialBook.comicPages.map((cp) => ({
        pageNumber: cp.pageNumber,
        name: `Page ${cp.pageNumber}`,
        blobUrl: cp.imageUrl,
      }));
      setPages(mappedPages);
      if (initialBook.comicType === 'manga') {
        setReadingDirection('rtl');
      } else {
        setReadingDirection('ltr');
      }
      
      // Load saved progress
      const savedPage = localStorage.getItem(`bookiin_comic_progress_${initialBook.id}`);
      if (savedPage) {
        const p = parseInt(savedPage, 10);
        if (p >= 1 && p <= mappedPages.length) setCurrentPage(p);
        else setCurrentPage(1);
      } else {
        setCurrentPage(1);
      }
    } else if (pages.length === 0) {
      // Load default demo comic pages if no book provided
      loadDemoComicPages();
    }
  }, [isOpen, initialBook]);

  // Save reading progress
  useEffect(() => {
    if (initialBook && currentPage >= 1) {
      localStorage.setItem(`bookiin_comic_progress_${initialBook.id}`, String(currentPage));
    }
  }, [initialBook, currentPage]);

  const loadDemoComicPages = () => {
    setComicTitle('Neo-Tokyo 2099 : L’Éveil Cyber (Extrait .CBZ)');
    setComicAuthor('Kaelen Vance & Studio M');
    setReadingDirection('rtl'); // Manga style
    const demoPages: ExtractedComicPage[] = [
      {
        pageNumber: 1,
        name: '001_Couverture.jpg',
        blobUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85',
      },
      {
        pageNumber: 2,
        name: '002_Nuit_Sur_Le_Secteur_4.jpg',
        blobUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85',
      },
      {
        pageNumber: 3,
        name: '003_Connexion_Reseau.jpg',
        blobUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85',
      },
      {
        pageNumber: 4,
        name: '004_Poursuite_Sur_Les_Toits.jpg',
        blobUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85',
      },
      {
        pageNumber: 5,
        name: '005_La_Matrice_Doree.jpg',
        blobUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
      },
      {
        pageNumber: 6,
        name: '006_Fin_Du_Prologue.jpg',
        blobUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=85',
      },
    ];
    setPages(demoPages);
    setCurrentPage(1);
  };

  // Handle local CBZ / CBR / ZIP / RAR file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processUploadedFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStatus(`Décompression de ${file.name}...`);

    try {
      // Free old blob URLs if any
      revokeComicPages(pages);

      const result = await parseComicFile(file);
      setPages(result.pages);
      setComicTitle(result.title);
      if (result.author) setComicAuthor(result.author);
      if (result.isManga) setReadingDirection('rtl');
      setCurrentPage(1);
      setLoadingStatus(`Terminé ! ${result.totalPages} planches chargées.`);
    } catch (err: unknown) {
      console.error('[ComicReader] Parse error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || 'Impossible de lire cette archive. Vérifiez le format .cbz ou .cbr.');
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processUploadedFile(file);
    }
  };

  // Navigation handlers
  const totalPages = pages.length;

  const goToNextPage = useCallback(() => {
    if (viewMode === 'double') {
      setCurrentPage((prev) => Math.min(totalPages, prev + 2));
    } else {
      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    }
  }, [totalPages, viewMode]);

  const goToPrevPage = useCallback(() => {
    if (viewMode === 'double') {
      setCurrentPage((prev) => Math.max(1, prev - 2));
    } else {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  }, [viewMode]);

  // Click on left/right side of page
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) return; // Allow pan when zoomed
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftSide = clickX < rect.width / 2;

    if (readingDirection === 'rtl') {
      // Manga mode: Left is NEXT, Right is PREV
      if (isLeftSide) goToNextPage();
      else goToPrevPage();
    } else {
      // LTR mode: Left is PREV, Right is NEXT
      if (isLeftSide) goToPrevPage();
      else goToNextPage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (readingDirection === 'rtl') goToPrevPage();
        else goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (readingDirection === 'rtl') goToNextPage();
        else goToPrevPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        setReadingDirection((d) => (d === 'ltr' ? 'rtl' : 'ltr'));
      } else if (e.key === 'd' || e.key === 'D') {
        setViewMode((m) => (m === 'single' ? 'double' : 'single'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, readingDirection, goToNextPage, goToPrevPage, onClose]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || zoomLevel > 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Swiped Left
        if (readingDirection === 'rtl') goToPrevPage();
        else goToNextPage();
      } else {
        // Swiped Right
        if (readingDirection === 'rtl') goToNextPage();
        else goToPrevPage();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Download comic as genuine .cbz
  const handleDownloadCbz = async () => {
    setIsDownloading(true);
    try {
      const mockBook: Book = initialBook || {
        id: 'comic-cbz',
        title: comicTitle,
        author: comicAuthor || 'Bookiin BD',
        category: 'BD_MANGA',
        price: 0,
        rating: 5,
        reviewsCount: 1,
        coverUrl: pages[0]?.blobUrl || '',
        description: 'Bande dessinée en format .CBZ',
        pages: pages.length,
        publishedYear: 2026,
        fileSize: '15 Mo',
        r2FileKey: '',
        formats: ['CBZ'],
        excerpt: [],
        comicType: readingDirection === 'rtl' ? 'manga' : 'bd',
      };

      const customPages: ComicPage[] = pages.map((p) => ({
        pageNumber: p.pageNumber,
        imageUrl: p.blobUrl,
        caption: p.name,
      }));

      await downloadCbz(mockBook, customPages);
    } catch (err) {
      console.error('[ComicReader] Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  // Background styling
  const bgClasses = {
    black: 'bg-black text-zinc-100',
    dark: 'bg-[#121316] text-zinc-200',
    sepia: 'bg-[#1C1814] text-[#E8DFC8]',
  }[ambientBg];

  // Currently displayed page(s)
  const currentFirstPage = pages[currentPage - 1];
  const currentSecondPage =
    viewMode === 'double' && currentPage < totalPages ? pages[currentPage] : null;

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`fixed inset-0 z-70 flex flex-col select-none overflow-hidden transition-colors duration-200 ${bgClasses}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Lecteur de bande dessinée : ${comicTitle}`}
    >
      {/* Hidden file input for opening local CBZ / CBR files */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".cbz,.cbr,.zip,.rar,application/x-cbz,application/x-cbr,application/zip"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ===================== TOP CONTROLS HEADER ===================== */}
      <header className="px-3 sm:px-5 py-2.5 bg-black/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-2 z-30 shrink-0">
        
        {/* Left: Title & Page info */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xs sm:text-sm truncate text-white max-w-[140px] xs:max-w-xs sm:max-w-md">
                {comicTitle}
              </h2>
              <span className="hidden md:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-amber-300 uppercase">
                {readingDirection === 'rtl' ? 'Manga (RTL)' : 'BD (LTR)'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
              {totalPages > 0 ? (
                <>
                  Planche <span className="text-white font-semibold">{currentPage}</span>
                  {viewMode === 'double' && currentSecondPage ? `-${currentPage + 1}` : ''} sur{' '}
                  <span className="text-white font-semibold">{totalPages}</span>
                </>
              ) : (
                'Aucune page'
              )}
            </p>
          </div>
        </div>

        {/* Center/Right: Action Toolset */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Open local file button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10"
            title="Ouvrir un fichier .CBZ ou .CBR de votre appareil"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ouvrir .CBZ / .CBR</span>
          </button>

          {/* View Mode Switcher (Single / Double / Webtoon) */}
          <div className="flex items-center p-0.5 rounded-full bg-white/10 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full transition-colors cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-amber-400 text-black font-bold shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Page simple"
              aria-label="Mode page simple"
            >
              <FileText className="w-3.5 h-3.5 inline sm:mr-1" />
              <span className="hidden sm:inline text-[11px]">Simple</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('double')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full transition-colors cursor-pointer ${
                viewMode === 'double'
                  ? 'bg-amber-400 text-black font-bold shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Double page / Planche"
              aria-label="Mode double page"
            >
              <Columns2 className="w-3.5 h-3.5 inline sm:mr-1" />
              <span className="hidden sm:inline text-[11px]">Double</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('webtoon')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full transition-colors cursor-pointer ${
                viewMode === 'webtoon'
                  ? 'bg-amber-400 text-black font-bold shadow-xs'
                  : 'text-zinc-300 hover:text-white'
              }`}
              title="Défilement vertical continu (Webtoon)"
              aria-label="Mode webtoon défilement vertical"
            >
              <Scroll className="w-3.5 h-3.5 inline sm:mr-1" />
              <span className="hidden sm:inline text-[11px]">Webtoon</span>
            </button>
          </div>

          {/* Reading Direction Toggle (LTR vs RTL) */}
          <button
            type="button"
            onClick={() => setReadingDirection((d) => (d === 'ltr' ? 'rtl' : 'ltr'))}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              readingDirection === 'rtl'
                ? 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
            title={`Sens de lecture : ${readingDirection === 'rtl' ? 'Manga (Droite à Gauche)' : 'Bande Dessinée (Gauche à Droite)'}`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="text-[11px]">{readingDirection === 'rtl' ? 'Manga (RTL)' : 'BD (LTR)'}</span>
          </button>

          {/* Zoom controls (if single or double mode) */}
          {viewMode !== 'webtoon' && (
            <div className="hidden md:flex items-center gap-1 p-0.5 rounded-full bg-white/10 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                disabled={zoomLevel <= 0.75}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                title="Dézoomer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 min-w-[34px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                disabled={zoomLevel >= 3}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                title="Zoomer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 text-amber-300 cursor-pointer"
                  title="Réinitialiser zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Toggle Thumbnails drawer */}
          <button
            type="button"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border cursor-pointer ${
              showThumbnails
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-white/10 text-zinc-300 border-white/10 hover:bg-white/20'
            }`}
            title="Miniatures des planches"
            aria-label="Afficher les miniatures"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Download CBZ button */}
          <button
            type="button"
            disabled={isDownloading || pages.length === 0}
            onClick={handleDownloadCbz}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-amber-300 border border-white/10 transition-colors cursor-pointer disabled:opacity-40"
            title="Télécharger cette BD en fichier .CBZ sur mon téléphone"
            aria-label="Télécharger en CBZ"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border cursor-pointer ${
              showSettings
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-white/10 text-zinc-300 border-white/10 hover:bg-white/20'
            }`}
            title="Options d'affichage"
            aria-label="Options"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center bg-white/10 hover:bg-white/20 text-zinc-300 border border-white/10 transition-colors cursor-pointer"
            title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
            aria-label={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors cursor-pointer ml-1"
            title="Fermer le lecteur BD (Échap)"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ===================== EXPANDABLE SETTINGS PANEL ===================== */}
      {showSettings && (
        <div className="bg-black/90 backdrop-blur-md border-b border-white/15 px-4 sm:px-6 py-3.5 z-30 animate-in fade-in slide-in-from-top-2 text-xs">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-5 justify-between items-center">
            
            {/* Ambient Lighting */}
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                Ambiance d'arrière-plan
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAmbientBg('black')}
                  className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer flex items-center gap-1.5 ${
                    ambientBg === 'black'
                      ? 'bg-zinc-800 text-amber-300 border-amber-400/50 font-bold'
                      : 'bg-black/40 text-zinc-400 border-white/10'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Noir Profond (OLED)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAmbientBg('dark')}
                  className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer flex items-center gap-1.5 ${
                    ambientBg === 'dark'
                      ? 'bg-zinc-800 text-amber-300 border-amber-400/50 font-bold'
                      : 'bg-black/40 text-zinc-400 border-white/10'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Anthracite Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAmbientBg('sepia')}
                  className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer flex items-center gap-1.5 ${
                    ambientBg === 'sepia'
                      ? 'bg-[#3A3026] text-amber-200 border-amber-400/50 font-bold'
                      : 'bg-black/40 text-zinc-400 border-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sépia Chaleureux</span>
                </button>
              </div>
            </div>

            {/* Fit mode */}
            {viewMode !== 'webtoon' && (
              <div>
                <span className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                  Ajustement de l'image
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFitMode('height');
                      setZoomLevel(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                      fitMode === 'height'
                        ? 'bg-zinc-800 text-amber-300 border-amber-400/50 font-bold'
                        : 'bg-black/40 text-zinc-400 border-white/10'
                    }`}
                  >
                    Adapter à la hauteur
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFitMode('width');
                      setZoomLevel(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                      fitMode === 'width'
                        ? 'bg-zinc-800 text-amber-300 border-amber-400/50 font-bold'
                        : 'bg-black/40 text-zinc-400 border-white/10'
                    }`}
                  >
                    Adapter à la largeur
                  </button>
                </div>
              </div>
            )}

            {/* Mobile / Open file button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Importer un .CBZ / .CBR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== NOTICES & MESSAGES ===================== */}
      {errorMessage && (
        <div className="bg-rose-950/80 text-rose-200 border-b border-rose-800/40 px-4 py-2 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white underline cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {isLoading && (
        <div className="bg-amber-950/70 text-amber-200 border-b border-amber-800/40 px-4 py-2 text-xs flex items-center justify-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>{loadingStatus}</span>
        </div>
      )}

      {/* ===================== MAIN COMIC VIEW CANVAS ===================== */}
      <main
        className="flex-1 relative overflow-auto flex items-center justify-center p-0 sm:p-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {pages.length === 0 ? (
          <div className="text-center p-8 max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-amber-300">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-lg text-white">
              Aucune bande dessinée chargée
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Glissez-déposez n'importe quel fichier <strong>.CBZ</strong> ou <strong>.CBR</strong> ici,
              ou ouvrez un fichier directement depuis votre téléphone ou ordinateur.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-full bg-amber-400 text-black font-semibold text-xs cursor-pointer hover:bg-amber-300"
              >
                Parcourir mes fichiers...
              </button>
              <button
                type="button"
                onClick={loadDemoComicPages}
                className="px-4 py-2.5 rounded-full bg-white/10 text-white font-semibold text-xs cursor-pointer hover:bg-white/20 border border-white/20"
              >
                Charger l'extrait démo Manga
              </button>
            </div>
          </div>
        ) : viewMode === 'webtoon' ? (
          /* ===================== WEBTOON VERTICAL CONTINUOUS SCROLL ===================== */
          <div className="w-full max-w-2xl mx-auto py-6 space-y-1">
            {pages.map((p) => (
              <div key={p.pageNumber} className="relative w-full shadow-2xl">
                <img
                  src={p.blobUrl}
                  alt={`Planche ${p.pageNumber}`}
                  loading="lazy"
                  className="w-full h-auto block select-none"
                />
                <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">
                  {p.pageNumber}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* ===================== PAGINATED (SINGLE OR DOUBLE PAGE) ===================== */
          <div
            onClick={handlePageClick}
            className="relative flex items-center justify-center max-w-full max-h-full cursor-pointer"
            style={{
              transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
              transformOrigin: 'center center',
              transition: zoomLevel === 1 ? 'transform 0.2s ease-out' : undefined,
            }}
          >
            {/* Click zones hint indicators (hover effect) */}
            <div
              className={`flex items-center justify-center gap-1 sm:gap-2 max-w-full ${
                viewMode === 'double' ? 'flex-row' : ''
              }`}
            >
              {/* Double page logic with reading direction ordering */}
              {viewMode === 'double' && currentSecondPage ? (
                readingDirection === 'rtl' ? (
                  // Manga mode: Right page is first (currentPage), Left page is second (currentPage + 1)
                  <>
                    <img
                      src={currentSecondPage.blobUrl}
                      alt={`Planche ${currentSecondPage.pageNumber}`}
                      className={`block select-none shadow-2xl rounded-r-none rounded-l-md ${
                        fitMode === 'height'
                          ? 'max-h-[82vh] w-auto'
                          : fitMode === 'width'
                          ? 'w-[48vw] h-auto'
                          : ''
                      }`}
                    />
                    <img
                      src={currentFirstPage.blobUrl}
                      alt={`Planche ${currentFirstPage.pageNumber}`}
                      className={`block select-none shadow-2xl rounded-l-none rounded-r-md ${
                        fitMode === 'height'
                          ? 'max-h-[82vh] w-auto'
                          : fitMode === 'width'
                          ? 'w-[48vw] h-auto'
                          : ''
                      }`}
                    />
                  </>
                ) : (
                  // LTR Western mode: Left page is first (currentPage), Right page is second (currentPage + 1)
                  <>
                    <img
                      src={currentFirstPage.blobUrl}
                      alt={`Planche ${currentFirstPage.pageNumber}`}
                      className={`block select-none shadow-2xl rounded-r-none rounded-l-md ${
                        fitMode === 'height'
                          ? 'max-h-[82vh] w-auto'
                          : fitMode === 'width'
                          ? 'w-[48vw] h-auto'
                          : ''
                      }`}
                    />
                    <img
                      src={currentSecondPage.blobUrl}
                      alt={`Planche ${currentSecondPage.pageNumber}`}
                      className={`block select-none shadow-2xl rounded-l-none rounded-r-md ${
                        fitMode === 'height'
                          ? 'max-h-[82vh] w-auto'
                          : fitMode === 'width'
                          ? 'w-[48vw] h-auto'
                          : ''
                      }`}
                    />
                  </>
                )
              ) : (
                /* Single Page mode */
                currentFirstPage && (
                  <img
                    src={currentFirstPage.blobUrl}
                    alt={`Planche ${currentFirstPage.pageNumber}`}
                    className={`block select-none shadow-2xl rounded-md ${
                      fitMode === 'height'
                        ? 'max-h-[82vh] w-auto'
                        : fitMode === 'width'
                        ? 'w-full max-w-4xl h-auto'
                        : ''
                    }`}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Side Floating Page Navigation Arrows (when not in webtoon mode) */}
        {viewMode !== 'webtoon' && pages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (readingDirection === 'rtl') goToNextPage();
                else goToPrevPage();
              }}
              disabled={
                readingDirection === 'rtl' ? currentPage >= totalPages : currentPage <= 1
              }
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white flex items-center justify-center border border-white/15 backdrop-blur-md cursor-pointer transition-all disabled:opacity-0 disabled:pointer-events-none shadow-lg"
              title="Page précédente"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (readingDirection === 'rtl') goToPrevPage();
                else goToNextPage();
              }}
              disabled={
                readingDirection === 'rtl' ? currentPage <= 1 : currentPage >= totalPages
              }
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white flex items-center justify-center border border-white/15 backdrop-blur-md cursor-pointer transition-all disabled:opacity-0 disabled:pointer-events-none shadow-lg"
              title="Page suivante"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </main>

      {/* ===================== BOTTOM SCRUBBER & FILMSTRIP ===================== */}
      {pages.length > 0 && (
        <footer className="bg-black/75 backdrop-blur-md border-t border-white/10 z-30 shrink-0">
          
          {/* Thumbnails Filmstrip Drawer */}
          {showThumbnails && (
            <div className="p-3 border-b border-white/10 overflow-x-auto flex gap-2.5 max-h-36 no-scrollbar snap-x">
              {pages.map((p) => {
                const isActive = p.pageNumber === currentPage;
                return (
                  <button
                    key={p.pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(p.pageNumber)}
                    className={`relative shrink-0 snap-center rounded-lg overflow-hidden border-2 transition-all cursor-pointer h-24 aspect-[2/3] ${
                      isActive
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                        : 'border-white/20 hover:border-white/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={p.blobUrl}
                      alt={`Miniature ${p.pageNumber}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono px-1 py-0.2 rounded text-white font-bold">
                      {p.pageNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Slider Bar & Navigation Footer */}
          <div className="px-4 py-2 flex items-center justify-between gap-3 text-xs">
            
            {/* Previous */}
            <button
              type="button"
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="text-zinc-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1 shrink-0 px-2 py-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Précédent</span>
            </button>

            {/* Slider bar */}
            <div className="flex-1 max-w-xl mx-auto flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-400 shrink-0">1</span>
              <input
                type="range"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-[11px] font-mono text-zinc-400 shrink-0">{totalPages}</span>
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className="text-zinc-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1 shrink-0 px-2 py-1"
            >
              <span className="hidden xs:inline">Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};
