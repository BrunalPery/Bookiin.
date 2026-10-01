import React, { useState, useEffect, useCallback, useId } from 'react';
import { 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Settings2, 
  Maximize2, 
  Minimize2,
  Check
} from 'lucide-react';
import { Book } from '../types';

export type ReaderTheme = 'clair' | 'sepia' | 'sombre';
export type ReaderFontFamily = 'serif' | 'sans';
export type ReaderLineHeight = 'normal' | 'relaxed' | 'spacious';

interface EbookReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

interface ThemeConfig {
  id: ReaderTheme;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  containerBg: string;
  headerFooterBg: string;
  bodyText: string;
  mutedText: string;
  borderColor: string;
  accentColor: string;
  badgeBg: string;
  selectionColor: string;
  swatchBg: string;
  swatchBorder: string;
  contrastText: string;
}

const THEMES: Record<ReaderTheme, ThemeConfig> = {
  clair: {
    id: 'clair',
    label: 'Clair',
    tagline: 'Lumière du jour',
    icon: Sun,
    containerBg: 'bg-[#FAF9F6]',
    headerFooterBg: 'bg-[#FAF9F6]/95 border-[#E7E5E0]',
    bodyText: 'text-[#1C1917]',
    mutedText: 'text-[#78716C]',
    borderColor: 'border-[#E7E5E0]',
    accentColor: 'text-[#B45309]',
    badgeBg: 'bg-[#B45309]/10 text-[#B45309]',
    selectionColor: 'selection:bg-[#B45309]/20',
    swatchBg: 'bg-[#FFFFFF]',
    swatchBorder: 'border-[#D6D3D1]',
    contrastText: 'text-stone-900',
  },
  sepia: {
    id: 'sepia',
    label: 'Sépia',
    tagline: 'Papier chaud & reposant',
    icon: BookOpen,
    containerBg: 'bg-[#F5ECD7]',
    headerFooterBg: 'bg-[#F5ECD7]/95 border-[#E4D3B4]',
    bodyText: 'text-[#3E2E1D]',
    mutedText: 'text-[#7C664A]',
    borderColor: 'border-[#E4D3B4]',
    accentColor: 'text-[#92400E]',
    badgeBg: 'bg-[#92400E]/10 text-[#92400E]',
    selectionColor: 'selection:bg-[#92400E]/25',
    swatchBg: 'bg-[#F5ECD7]',
    swatchBorder: 'border-[#CCA87B]',
    contrastText: 'text-[#3E2E1D]',
  },
  sombre: {
    id: 'sombre',
    label: 'Sombre',
    tagline: 'Confort nocturne & anti-reflets',
    icon: Moon,
    containerBg: 'bg-[#121316]',
    headerFooterBg: 'bg-[#121316]/95 border-[#26272B]',
    bodyText: 'text-[#D4D4D8]',
    mutedText: 'text-[#A1A1AA]',
    borderColor: 'border-[#26272B]',
    accentColor: 'text-[#F59E0B]',
    badgeBg: 'bg-[#F59E0B]/15 text-[#F59E0B]',
    selectionColor: 'selection:bg-[#F59E0B]/30',
    swatchBg: 'bg-[#1E2024]',
    swatchBorder: 'border-[#3F3F46]',
    contrastText: 'text-amber-300',
  },
};

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({ book, onClose }) => {
  // Theme state with localStorage persistence (supporting backward compatibility for 'cream' and 'dark')
  const [theme, setTheme] = useState<ReaderTheme>(() => {
    try {
      const saved = localStorage.getItem('bookiin_reader_theme');
      if (saved === 'clair' || saved === 'sepia' || saved === 'sombre') return saved;
      if (saved === 'cream') return 'clair';
      if (saved === 'dark') return 'sombre';
    } catch {
      // fallback
    }
    return 'clair';
  });

  // Font size with localStorage persistence
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bookiin_reader_fontsize');
      if (saved) {
        const val = parseInt(saved, 10);
        if (val >= 14 && val <= 26) return val;
      }
    } catch {
      // fallback
    }
    return 17;
  });

  // Font family (Serif vs Sans)
  const [fontFamily, setFontFamily] = useState<ReaderFontFamily>(() => {
    try {
      const saved = localStorage.getItem('bookiin_reader_fontfamily');
      if (saved === 'sans' || saved === 'serif') return saved;
    } catch {
      // fallback
    }
    return 'serif';
  });

  // Line height
  const [lineHeight, setLineHeight] = useState<ReaderLineHeight>(() => {
    try {
      const saved = localStorage.getItem('bookiin_reader_lineheight');
      if (saved === 'normal' || saved === 'relaxed' || saved === 'spacious') return saved;
    } catch {
      // fallback
    }
    return 'relaxed';
  });

  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const chaptersList = book && book.chapters && book.chapters.length > 0
    ? book.chapters
    : [
        {
          id: 'chap-1',
          title: book ? book.title : 'Chapitre Premier',
          paragraphs: book && book.excerpt && book.excerpt.length > 0
            ? book.excerpt
            : [book ? book.description : 'Texte en cours de chargement...']
        }
      ];

  const totalChapters = chaptersList.length;
  const activeChapter = chaptersList[Math.min(currentChapter - 1, totalChapters - 1)] || chaptersList[0];
  const currentThemeConfig = THEMES[theme];

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('bookiin_reader_theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_reader_fontsize', fontSize.toString());
    } catch {}
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_reader_fontfamily', fontFamily);
    } catch {}
  }, [fontFamily]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_reader_lineheight', lineHeight);
    } catch {}
  }, [lineHeight]);

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentChapter((c) => Math.min(totalChapters, c + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentChapter((c) => Math.max(1, c - 1));
      } else if (e.key === 't' || e.key === 'T') {
        // Cycle themes
        setTheme((current) => {
          if (current === 'clair') return 'sepia';
          if (current === 'sepia') return 'sombre';
          return 'clair';
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showSettings]);

  if (!book) return null;

  const getLineHeightClass = () => {
    switch (lineHeight) {
      case 'normal': return 'leading-relaxed';
      case 'spacious': return 'leading-loose';
      case 'relaxed':
      default: return 'leading-[1.85]';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-60 overflow-hidden flex flex-col bg-black/85 backdrop-blur-md p-0 sm:p-3 md:p-5 transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`Liseuse de livre : ${book.title}`}
    >
      <div 
        className={`flex-1 flex flex-col max-w-4xl w-full mx-auto my-auto h-full max-h-full sm:max-h-[96vh] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${currentThemeConfig.containerBg} ${currentThemeConfig.bodyText} ${currentThemeConfig.borderColor} ${currentThemeConfig.selectionColor}`}
      >
        
        {/* ===================== READER TOP HEADER ===================== */}
        <header 
          className={`px-3 sm:px-6 py-2.5 sm:py-3.5 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md transition-colors duration-300 ${currentThemeConfig.headerFooterBg}`}
        >
          {/* Book Title & Chapter indicator */}
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className={`p-1.5 rounded-lg shrink-0 ${currentThemeConfig.badgeBg}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-xs sm:text-sm md:text-base truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-md">
                {book.title}
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                <span className={currentThemeConfig.mutedText}>
                  Chapitre {currentChapter} sur {totalChapters}
                </span>
                {theme === 'sombre' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    <Moon className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Mode nuit</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* READER CONTROLS TOOLBAR */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* ===================== THEME SELECTOR ===================== */}
            <div 
              className={`flex items-center p-0.5 sm:p-1 rounded-full border shadow-xs transition-colors duration-300 ${
                theme === 'sombre' ? 'bg-[#1A1C20] border-[#2D3036]' : 'bg-black/5 border-black/10'
              }`}
              role="radiogroup"
              aria-label="Thème de lecture"
            >
              {(Object.keys(THEMES) as ReaderTheme[]).map((themeKey) => {
                const t = THEMES[themeKey];
                const IconComponent = t.icon;
                const isSelected = theme === themeKey;

                return (
                  <button
                    key={themeKey}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setTheme(themeKey)}
                    className={`relative flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none ${
                      isSelected
                        ? `${
                            themeKey === 'sombre'
                              ? 'bg-[#2B2D33] text-amber-300 shadow-sm ring-1 ring-amber-400/30 font-semibold'
                              : themeKey === 'sepia'
                              ? 'bg-[#EADDC0] text-[#3E2E1D] shadow-sm ring-1 ring-[#CCA87B] font-semibold'
                              : 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300 font-semibold'
                          }`
                        : `${currentThemeConfig.mutedText} hover:opacity-100 hover:bg-black/5`
                    }`}
                    title={`${t.label} : ${t.tagline}`}
                  >
                    <span 
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 border ${t.swatchBg} ${t.swatchBorder}`}
                    >
                      <IconComponent className="w-2.5 h-2.5 opacity-90" />
                    </span>
                    <span className="hidden md:inline text-[11px] sm:text-xs">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Font Size Buttons */}
            <div 
              className={`hidden xs:flex items-center gap-0.5 p-0.5 rounded-full border transition-colors ${
                theme === 'sombre' ? 'bg-[#1A1C20] border-[#2D3036]' : 'bg-black/5 border-black/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setFontSize((f) => Math.max(14, f - 1))}
                disabled={fontSize <= 14}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-30 ${
                  theme === 'sombre' ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}
                title="Réduire la taille du texte"
                aria-label="Réduire la taille du texte"
              >
                A-
              </button>
              <span className={`text-[10px] font-mono px-1 min-w-[28px] text-center ${currentThemeConfig.mutedText}`}>
                {fontSize}
              </span>
              <button
                type="button"
                onClick={() => setFontSize((f) => Math.min(26, f + 1))}
                disabled={fontSize >= 26}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-30 ${
                  theme === 'sombre' ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}
                title="Agrandir la taille du texte"
                aria-label="Agrandir la taille du texte"
              >
                A+
              </button>
            </div>

            {/* Reading Options Popover Toggle */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                showSettings 
                  ? `${currentThemeConfig.badgeBg} ring-2 ring-current`
                  : theme === 'sombre' 
                    ? 'bg-[#1A1C20] border-[#2D3036] hover:bg-[#252830] text-zinc-300' 
                    : 'bg-black/5 border-black/10 hover:bg-black/10 text-stone-700'
              }`}
              title="Préférences d'affichage (police, interligne, thème)"
              aria-label="Préférences de lecture"
              aria-expanded={showSettings}
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`hidden sm:flex w-8 h-8 rounded-full items-center justify-center transition-colors cursor-pointer border ${
                theme === 'sombre' 
                  ? 'bg-[#1A1C20] border-[#2D3036] hover:bg-[#252830] text-zinc-300' 
                  : 'bg-black/5 border-black/10 hover:bg-black/10 text-stone-700'
              }`}
              title={isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}
              aria-label={isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                theme === 'sombre' 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                  : 'bg-black/5 border-black/10 hover:bg-black/10 text-stone-700'
              }`}
              title="Fermer la liseuse (Échap)"
              aria-label="Fermer la liseuse"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ===================== EXPANDABLE SETTINGS PANEL ===================== */}
        {showSettings && (
          <div 
            className={`px-4 sm:px-6 py-4 border-b transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
              theme === 'sombre' ? 'bg-[#16171B] border-[#27282D]' : 'bg-[#F2ECE1]/90 border-stone-300'
            }`}
          >
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 justify-between items-stretch md:items-center text-xs">
              
              {/* Detailed Theme Switcher */}
              <div className="flex-1">
                <span className={`block font-semibold mb-2 uppercase tracking-wider text-[10px] ${currentThemeConfig.mutedText}`}>
                  Ambiance de lecture
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(THEMES) as ReaderTheme[]).map((themeKey) => {
                    const t = THEMES[themeKey];
                    const IconComponent = t.icon;
                    const isSelected = theme === themeKey;

                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => setTheme(themeKey)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? `${themeKey === 'sombre' ? 'bg-[#22242A] border-amber-400/50 ring-1 ring-amber-400/30 text-amber-200' : 'bg-white border-amber-600/40 ring-1 ring-amber-600/30 font-semibold'} shadow-xs`
                            : `${theme === 'sombre' ? 'bg-[#1A1C20] border-[#282B32] hover:bg-[#202227]' : 'bg-white/60 border-stone-200 hover:bg-white'}`
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${t.swatchBg} ${t.swatchBorder}`}>
                          <IconComponent className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold leading-tight truncate">{t.label}</p>
                          <p className={`text-[9px] truncate ${currentThemeConfig.mutedText}`}>
                            {themeKey === 'sombre' ? 'Nuit' : themeKey === 'sepia' ? 'Doux' : 'Jour'}
                          </p>
                        </div>
                        {isSelected && <Check className="w-3 h-3 ml-auto text-amber-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography controls */}
              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                {/* Font Family */}
                <div>
                  <span className={`block font-semibold mb-2 uppercase tracking-wider text-[10px] ${currentThemeConfig.mutedText}`}>
                    Police
                  </span>
                  <div className={`inline-flex rounded-lg border p-0.5 ${theme === 'sombre' ? 'bg-[#1A1C20] border-[#2D3036]' : 'bg-white border-stone-200'}`}>
                    <button
                      type="button"
                      onClick={() => setFontFamily('serif')}
                      className={`px-2.5 py-1 rounded-md font-serif text-xs cursor-pointer transition-colors ${
                        fontFamily === 'serif'
                          ? theme === 'sombre' ? 'bg-[#2C2E35] text-amber-300 font-bold' : 'bg-stone-200 text-stone-900 font-bold'
                          : currentThemeConfig.mutedText
                      }`}
                    >
                      Roman (Serif)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontFamily('sans')}
                      className={`px-2.5 py-1 rounded-md font-sans text-xs cursor-pointer transition-colors ${
                        fontFamily === 'sans'
                          ? theme === 'sombre' ? 'bg-[#2C2E35] text-amber-300 font-bold' : 'bg-stone-200 text-stone-900 font-bold'
                          : currentThemeConfig.mutedText
                      }`}
                    >
                      Moderne (Sans)
                    </button>
                  </div>
                </div>

                {/* Line Spacing */}
                <div>
                  <span className={`block font-semibold mb-2 uppercase tracking-wider text-[10px] ${currentThemeConfig.mutedText}`}>
                    Interligne
                  </span>
                  <div className={`inline-flex rounded-lg border p-0.5 ${theme === 'sombre' ? 'bg-[#1A1C20] border-[#2D3036]' : 'bg-white border-stone-200'}`}>
                    <button
                      type="button"
                      onClick={() => setLineHeight('normal')}
                      className={`px-2 py-1 rounded-md text-[11px] cursor-pointer transition-colors ${
                        lineHeight === 'normal'
                          ? theme === 'sombre' ? 'bg-[#2C2E35] text-amber-300 font-bold' : 'bg-stone-200 text-stone-900 font-bold'
                          : currentThemeConfig.mutedText
                      }`}
                      title="Interligne compact"
                    >
                      Compact
                    </button>
                    <button
                      type="button"
                      onClick={() => setLineHeight('relaxed')}
                      className={`px-2 py-1 rounded-md text-[11px] cursor-pointer transition-colors ${
                        lineHeight === 'relaxed'
                          ? theme === 'sombre' ? 'bg-[#2C2E35] text-amber-300 font-bold' : 'bg-stone-200 text-stone-900 font-bold'
                          : currentThemeConfig.mutedText
                      }`}
                      title="Interligne aéré standard"
                    >
                      Aéré
                    </button>
                    <button
                      type="button"
                      onClick={() => setLineHeight('spacious')}
                      className={`px-2 py-1 rounded-md text-[11px] cursor-pointer transition-colors ${
                        lineHeight === 'spacious'
                          ? theme === 'sombre' ? 'bg-[#2C2E35] text-amber-300 font-bold' : 'bg-stone-200 text-stone-900 font-bold'
                          : currentThemeConfig.mutedText
                      }`}
                      title="Interligne spacieux (confort nocturne maximal)"
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================== PROSE READING CONTENT ===================== */}
        <div 
          className="flex-1 overflow-y-auto px-4 sm:px-10 md:px-16 lg:px-24 py-6 sm:py-10 scroll-smooth"
          tabIndex={0}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Chapter Header */}
            <div className={`text-center pb-5 sm:pb-8 border-b ${currentThemeConfig.borderColor}`}>
              <span className={`text-[11px] sm:text-xs uppercase tracking-widest font-bold ${currentThemeConfig.accentColor}`}>
                Chapitre {currentChapter} sur {totalChapters}
              </span>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold mt-2 ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
                {activeChapter.title}
              </h1>
              <p className={`text-xs sm:text-sm mt-1.5 italic ${currentThemeConfig.mutedText}`}>
                {book.title} — Par {book.author}
              </p>
            </div>

            {/* Reading Body */}
            <article 
              style={{ fontSize: `${fontSize}px` }}
              className={`space-y-5 text-justify ${getLineHeightClass()} ${
                fontFamily === 'serif' ? 'font-serif' : 'font-sans'
              }`}
            >
              {activeChapter.paragraphs.map((p, idx) => (
                <p 
                  key={idx} 
                  className="first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-bold first-letter:mr-1.5 first-letter:float-left first-letter:font-serif first-letter:leading-none"
                >
                  <span className={currentThemeConfig.accentColor}>{p.charAt(0)}</span>
                  {p.slice(1)}
                </p>
              ))}
            </article>

            {/* Chapter End Marker */}
            <div className="pt-8 pb-4 text-center">
              <div className={`inline-flex items-center justify-center gap-2 text-xs font-serif italic ${currentThemeConfig.mutedText}`}>
                <span>✦</span>
                <span>Fin du Chapitre {currentChapter} sur {totalChapters}</span>
                <span>✦</span>
              </div>
            </div>

          </div>
        </div>

        {/* ===================== FOOTER WITH CHAPTER PROGRESS ===================== */}
        <footer 
          className={`px-4 sm:px-6 py-2.5 sm:py-3 border-t flex flex-col gap-2 backdrop-blur-md transition-colors duration-300 ${currentThemeConfig.headerFooterBg}`}
        >
          {/* Progress bar line */}
          <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                theme === 'sombre' ? 'bg-amber-400' : 'bg-[#B8860B]'
              }`}
              style={{ width: `${(currentChapter / totalChapters) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            {/* Previous chapter button */}
            <button
              type="button"
              disabled={currentChapter <= 1}
              onClick={() => setCurrentChapter((c) => Math.max(1, c - 1))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors cursor-pointer text-xs disabled:opacity-30 disabled:cursor-not-allowed ${
                theme === 'sombre'
                  ? 'border-[#2D3036] hover:bg-white/10'
                  : 'border-black/10 hover:bg-black/5'
              }`}
              title="Chapitre précédent (Flèche Gauche)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Précédent</span>
            </button>

            {/* Progress indicator */}
            <div className={`font-mono text-[11px] sm:text-xs flex items-center gap-2 ${currentThemeConfig.mutedText}`}>
              <span>Page {currentChapter * 24}</span>
              <span>•</span>
              <span className="font-semibold">
                {Math.round((currentChapter / totalChapters) * 100)}% lu
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-[10px]">
                Touche « T » : Thème
              </span>
            </div>

            {/* Next chapter button */}
            <button
              type="button"
              disabled={currentChapter >= totalChapters}
              onClick={() => setCurrentChapter((c) => Math.min(totalChapters, c + 1))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors cursor-pointer text-xs disabled:opacity-30 disabled:cursor-not-allowed ${
                theme === 'sombre'
                  ? 'border-[#2D3036] hover:bg-white/10'
                  : 'border-black/10 hover:bg-black/5'
              }`}
              title="Chapitre suivant (Flèche Droite)"
            >
              <span className="hidden xs:inline">Suivant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
