import React, { useState } from 'react';
import { X, Star, ShoppingBag, BookOpen, Check, ShieldCheck, Download, Layers, FileText } from 'lucide-react';
import { Book } from '../types';
import { Currency, formatPrice } from '../lib/formatPrice';
import { downloadEpub, downloadPdf, downloadCbz } from '../lib/bookDownloader';

interface BookDetailModalProps {
  book: Book | null;
  isInCart: boolean;
  currency?: Currency;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  onOpenReader: (book: Book) => void;
  onOpenComicReader?: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isInCart,
  currency = 'EUR',
  onClose,
  onAddToCart,
  onOpenReader,
  onOpenComicReader,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!book) return null;

  const isComic = book.category === 'BD_MANGA' || book.isComic || book.formats.includes('CBZ');

  const handleDownloadPreview = async (format: 'EPUB' | 'PDF' | 'CBZ') => {
    setIsDownloading(true);
    try {
      let fileName = '';
      if (format === 'EPUB') fileName = await downloadEpub(book);
      else if (format === 'PDF') fileName = await downloadPdf(book);
      else if (format === 'CBZ') fileName = await downloadCbz(book);

      setDownloadNotice(`Fichier "${fileName}" téléchargé pour lecture hors-ligne !`);
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FDFBF7] rounded-3xl max-w-2xl w-full p-4 sm:p-7 shadow-2xl border border-[#EAE3D4] relative max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-[#EFE7D8] flex items-center justify-center text-[#736C5E] hover:text-[#1A1A1A] cursor-pointer z-10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Notice Toast */}
        {downloadNotice && (
          <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{downloadNotice}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Left Cover & Quick Specs */}
            <div className="sm:col-span-5 space-y-3">
              <div className="aspect-[3/4] max-w-[200px] sm:max-w-none mx-auto w-full rounded-2xl overflow-hidden shadow-md border border-[#E0D8C8] bg-[#F4EFE6]">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Formats & Technical Specs */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#ECE5D8] space-y-2 text-xs shadow-2xs">
                <div className="flex justify-between items-center text-[#736C5E]">
                  <span>Formats inclus :</span>
                  <div className="flex gap-1">
                    {book.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${
                          fmt === 'CBZ' || fmt === 'CBR'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 text-[#1A1A1A]'
                        }`}
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-[#736C5E]">
                  <span>Pages / Planches :</span>
                  <span className="font-semibold text-[#1A1A1A]">{book.pages}</span>
                </div>
                <div className="flex justify-between text-[#736C5E]">
                  <span>Protection :</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    0 DRM (Libre à vie)
                  </span>
                </div>
              </div>

              {/* Offline Download Preview Button */}
              <div className="pt-1">
                <div className="flex gap-1.5 justify-center">
                  {book.formats.includes('EPUB') && (
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => handleDownloadPreview('EPUB')}
                      className="flex-1 py-1.5 px-2 bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#3A352D] rounded-xl text-[11px] font-medium border border-[#DED7C7] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Télécharger l'ebook en EPUB sur votre téléphone"
                    >
                      <Download className="w-3 h-3 text-[#B8860B]" />
                      <span>Télécharger EPUB</span>
                    </button>
                  )}
                  {book.formats.includes('CBZ') && (
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => handleDownloadPreview('CBZ')}
                      className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-[#7A5A09] rounded-xl text-[11px] font-semibold border border-amber-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Télécharger la BD en format .CBZ"
                    >
                      <Layers className="w-3 h-3 text-[#B8860B]" />
                      <span>Télécharger .CBZ</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Information & Sample Excerpt */}
            <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold text-[#8C6608] bg-[#FAF3E1] px-2 py-0.5 rounded uppercase tracking-wider">
                    {book.category === 'BD_MANGA' ? 'BD & MANGA' : book.category}
                  </span>
                  <div className="flex items-center text-xs text-[#B8860B] font-bold gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{book.rating.toFixed(1)}</span>
                    <span className="text-stone-400 font-normal">({book.reviewsCount})</span>
                  </div>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-snug mb-1">
                  {book.title}
                </h2>

                <p className="text-xs sm:text-sm font-medium text-[#736C5E] mb-3">
                  Par {book.author}
                </p>

                {/* Synopsis */}
                <div className="space-y-1 mb-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#4A453E]">Résumé</h4>
                  <p className="text-xs sm:text-sm text-[#554E42] leading-relaxed line-clamp-4 sm:line-clamp-none">
                    {book.description}
                  </p>
                </div>

                {/* Sample Excerpt or Comic preview */}
                <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#EAE3D4] space-y-1.5 mb-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-serif italic font-bold text-xs text-[#8C6608] flex items-center gap-1.5">
                      {isComic ? <Layers className="w-3.5 h-3.5 text-[#B8860B]" /> : <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />}
                      <span>{isComic ? 'Aperçu des planches' : 'Extrait'}</span>
                    </h5>
                    
                    {isComic && onOpenComicReader ? (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenComicReader(book);
                        }}
                        className="text-[11px] text-[#B8860B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ouvrir dans le Lecteur BD →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenReader(book);
                        }}
                        className="text-[11px] text-[#1A1A1A] hover:text-[#B8860B] underline font-medium cursor-pointer"
                      >
                        Liseuse →
                      </button>
                    )}
                  </div>
                  <p className="font-serif text-xs text-[#4A453E] italic leading-relaxed line-clamp-2">
                    « {book.excerpt[0] || book.description.substring(0, 100)} »
                  </p>
                </div>
              </div>

              {/* Price & Cart Actions */}
              <div className="pt-3 border-t border-[#ECE5D8] flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                      {formatPrice(book.price, currency)}
                    </span>
                    {book.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {formatPrice(book.originalPrice, currency)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500">Sans abonnement • Téléchargement immédiat</span>
                </div>

                <div className="flex items-center gap-2">
                  {isComic && onOpenComicReader ? (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenComicReader(book);
                      }}
                      className="px-3 sm:px-4 py-2 rounded-full text-xs font-semibold bg-amber-400 text-black hover:bg-amber-300 cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Lecteur BD</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReader(book);
                      }}
                      className="hidden xs:inline-flex px-3 sm:px-4 py-2 rounded-full text-xs font-semibold border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FAF7F0] cursor-pointer"
                    >
                      Extrait
                    </button>
                  )}

                  <button
                    onClick={() => onAddToCart(book)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 ${
                      isInCart
                        ? 'bg-[#EAE4D7] text-[#554E42] border border-[#D9D1C1]'
                        : 'bg-[#1A1A1A] text-white hover:bg-[#332F28] hover:scale-105 active:scale-95'
                    }`}
                    aria-label={isInCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
                    title={isInCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
                  >
                    {isInCart ? (
                      <Check className="w-4 h-4 text-[#B8860B]" />
                    ) : (
                      <ShoppingBag className="w-4 h-4 text-[#E6C665]" />
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

