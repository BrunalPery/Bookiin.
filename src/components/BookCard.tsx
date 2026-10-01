import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Eye, Check, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { Currency, formatPrice } from '../lib/formatPrice';

interface BookCardProps {
  book: Book;
  isInCart: boolean;
  currency?: Currency;
  onAddToCart: (book: Book) => void;
  onQuickView: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isInCart,
  currency = 'EUR',
  onAddToCart,
  onQuickView,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset loading state if the book's cover URL changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [book.coverUrl]);

  return (
    <article className="group bg-white rounded-2xl p-3 sm:p-4 border border-[#ECE5D8] hover:border-[#D1C6B4] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative">
      
      {/* Book Cover Container with Strict Aspect Ratio (Zero CLS) */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F4EFE6] mb-3 shadow-inner select-none">
        
        {/* Placeholder Shimmer Skeleton during Lazy Loading */}
        {!isLoaded && !hasError && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#EDE7DC] via-[#F7F3EC] to-[#E5DDD0] animate-pulse"
            aria-hidden="true"
          >
            <div className="w-10 h-10 rounded-full bg-[#DFD6C7]/60 flex items-center justify-center text-[#9E9484] mb-1.5 shadow-2xs">
              <BookOpen className="w-5 h-5 text-[#B8860B]/50" />
            </div>
            <span className="text-[10px] font-serif italic text-[#A69B89] tracking-wider">
              Bookiin
            </span>
          </div>
        )}

        {/* Fallback Display if Cover Fails to Load */}
        {hasError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2D2A24] via-[#1F1C18] to-[#12110F] text-[#FAF8F5] p-3 flex flex-col justify-between items-center text-center">
            <span className="text-[9px] uppercase tracking-widest text-[#B8860B] font-bold">
              {book.category}
            </span>
            <div className="px-2">
              <p className="font-serif font-bold text-xs line-clamp-3 text-[#EDE8E0]">
                {book.title}
              </p>
              <p className="text-[10px] text-[#A69E90] mt-1 truncate">
                {book.author}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-[#C59B27]/80">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Édition Numérique</span>
            </div>
          </div>
        ) : (
          /* Progressive Lazy-Loaded Book Cover Image */
          <img
            src={book.coverUrl}
            alt={`Couverture de ${book.title}`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width={300}
            height={400}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out ${
              isLoaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-98'
            }`}
          />
        )}

        {/* Category Badge top left */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="bg-[#1A1A1A]/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-xs">
            {book.category}
          </span>
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2 z-10">
          <button
            onClick={() => onQuickView(book)}
            className="bg-white/95 text-[#1A1A1A] hover:bg-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
            aria-label={`Aperçu de ${book.title}`}
          >
            <Eye className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Aperçu</span>
          </button>
        </div>

        {/* Formats badge top right */}
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <span className="bg-white/90 text-[9px] font-semibold text-[#5A5449] px-1.5 py-0.5 rounded shadow-xs">
            EPUB
          </span>
        </div>
      </div>

      {/* Book Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Star rating */}
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex items-center text-[#B8860B]">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-[#1A1A1A] tabular-nums">
              {book.rating.toFixed(1)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8C8476]">
              ({book.reviewsCount})
            </span>
          </div>

          {/* Book Title */}
          <h3 
            onClick={() => onQuickView(book)}
            className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors line-clamp-2 cursor-pointer leading-tight mb-1"
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-[11px] sm:text-xs text-[#736C5E] font-medium mb-2.5 truncate">
            {book.author}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <span className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] tabular-nums whitespace-nowrap block">
              {formatPrice(book.price, currency)}
            </span>
            {book.originalPrice && (
              <span className="block text-[10px] text-[#9E9789] line-through tabular-nums whitespace-nowrap">
                {formatPrice(book.originalPrice, currency)}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(book)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
              isInCart
                ? 'bg-[#EFEAE0] text-[#554E42] border border-[#D9D1C1]'
                : 'bg-[#1A1A1A] text-white hover:bg-[#332F28] hover:scale-105 active:scale-95'
            }`}
            aria-label={isInCart ? `« ${book.title} » déjà dans le panier` : `Ajouter « ${book.title} » au panier`}
            title={isInCart ? 'Déjà ajouté au panier' : 'Ajouter au panier'}
          >
            {isInCart ? (
              <Check className="w-4 h-4 text-[#B8860B]" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-[#E6C665]" />
            )}
          </button>
        </div>

      </div>

    </article>
  );
};

