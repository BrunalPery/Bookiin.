import React, { useRef, useState, useEffect } from 'react';
import { Package, Check, ShoppingBag, Layers, Percent, ChevronLeft, ChevronRight, ArrowRight, Eye, Flame, Sparkles } from 'lucide-react';
import { Bundle, Book, CartItem } from '../types';
import { Currency, formatPrice } from '../lib/formatPrice';

interface BundlesSectionProps {
  bundles: Bundle[];
  books: Book[];
  cartItems: CartItem[];
  currency: Currency;
  onAddBundleToCart: (bundle: Bundle) => void;
  onExploreCustomBundle: () => void;
  onViewAllBundles: () => void;
  title?: string;
  highlightedTitle?: string;
  subtitle?: string;
  badgeText?: string;
}

export const BundlesSection: React.FC<BundlesSectionProps> = ({
  bundles,
  books,
  cartItems,
  currency,
  onAddBundleToCart,
  onExploreCustomBundle,
  onViewAllBundles,
  title = 'Packs & Bundles',
  highlightedTitle = 'thématiques',
  subtitle = "Découvrez nos sélections exclusives regroupant plusieurs ouvrages et profitez d'une remise immédiate.",
  badgeText = 'Offres Spéciales & Collections',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const singleBooksInCart = cartItems.filter(i => i.type === 'book').length;
  const isCustomBundleActive = singleBooksInCart >= 3;

  // Gentle slide effect: softly advances when user is not actively hovering or interacting
  useEffect(() => {
    if (isHovered || !bundles.length) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const nextIndex = (activeIndex + 1) % bundles.length;
        const cardWidth = 320; // approximate width + gap
        scrollContainerRef.current.scrollTo({
          left: nextIndex * cardWidth,
          behavior: 'smooth',
        });
        setActiveIndex(nextIndex);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [activeIndex, isHovered, bundles.length]);

  const handleScrollEvent = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 320;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, index), bundles.length - 1));
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = 340;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - cardWidth : currentScroll + cardWidth;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const scrollToSpecificIndex = (idx: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      scrollContainerRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth',
      });
      setActiveIndex(idx);
    }
  };

  return (
    <section 
      id="bundles-section" 
      className="py-12 sm:py-20 bg-[#F8F5EE] border-b border-[#EAE3D4] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8C6608] font-bold">
              <Package className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{badgeText}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
              {title} <span className="italic font-serif text-[#B8860B]">{highlightedTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#666053] max-w-lg">
              {subtitle}
            </p>
          </div>

          {/* Action Row: Custom bundle notice + "Tout voir" button + Carousel arrows */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Custom bundle hint */}
            <button
              onClick={onExploreCustomBundle}
              className="inline-flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#DED6C5] text-xs font-medium text-[#2C2822] hover:border-[#B8860B] transition-all shadow-xs cursor-pointer"
            >
              <Percent className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Pack perso (-10%) : {isCustomBundleActive ? 'Actif' : `${singleBooksInCart}/3`}</span>
            </button>

            {/* "Tout voir" Button */}
            <button
              onClick={onViewAllBundles}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#332F28] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer group"
            >
              <span>Tout voir ({bundles.length} packs)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E6C665] group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Navigation arrows for scrolling */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full bg-white border border-[#DED6C5] text-[#2C2822] hover:bg-[#FAF6EE] hover:border-[#B8860B] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                aria-label="Pack précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full bg-white border border-[#DED6C5] text-[#2C2822] hover:bg-[#FAF6EE] hover:border-[#B8860B] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                aria-label="Pack suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel / Défilement avec léger effet de slide */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScrollEvent}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >

          {bundles.map((bundle) => {
            const isBundleInCart = cartItems.some(i => i.type === 'bundle' && i.id === bundle.id);
            const bundleBooks = books.filter(b => bundle.bookIds.includes(b.id));

            return (
              <div
                key={bundle.id}
                className="shrink-0 w-[290px] sm:w-[340px] snap-start bg-white rounded-2xl border border-[#E8E1D2] hover:border-[#C7BAA2] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Pack Image Stack / Visual area (défilement à partir de l'image) */}
                <div className="relative h-44 sm:h-48 bg-gradient-to-br from-[#2D2821] to-[#14120F] p-4 flex items-center justify-center overflow-hidden">
                  {/* Background atmospheric image subtle */}
                  <img
                    src={bundle.coverImage}
                    alt={bundle.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs scale-105 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14120F] via-transparent to-black/30" />

                  {/* Overlapping Book covers in pack (Visual stack) */}
                  <div className="relative z-10 flex items-center justify-center -space-x-8 sm:-space-x-9 pt-2">
                    {bundleBooks.slice(0, 3).map((b, idx) => (
                      <div
                        key={b.id}
                        className={`w-20 sm:w-22 aspect-[2/3] rounded-md overflow-hidden shadow-2xl border border-white/20 transition-all duration-300 transform group-hover:translate-y-[-4px] ${
                          idx === 0
                            ? '-rotate-6 scale-95 origin-bottom-left'
                            : idx === 1
                            ? 'z-20 rotate-0 scale-105 shadow-black/80'
                            : 'rotate-6 scale-95 origin-bottom-right z-10'
                        }`}
                      >
                        <img
                          src={b.coverUrl}
                          alt={b.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Badges on top */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    <span className="bg-[#FAF3E0] text-[#8C6608] border border-[#E9DCB8] text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
                      {bundle.badge}
                    </span>
                    <span className="bg-[#B8860B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      -{bundle.discountPercentage}%
                    </span>
                  </div>

                  {/* Stats pill at bottom of image */}
                  {(bundle.viewsCount || bundle.salesCount) && (
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-white/80 z-20">
                      {bundle.viewsCount && (
                        <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
                          <Eye className="w-3 h-3 text-[#E6C665]" />
                          {bundle.viewsCount.toLocaleString('fr-FR')} vues
                        </span>
                      )}
                      {bundle.salesCount && (
                        <span className="inline-flex items-center gap-1 bg-[#8C6608]/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-white font-medium">
                          <Flame className="w-3 h-3 text-amber-300" />
                          {bundle.salesCount} vendus
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Pack Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] mb-1 line-clamp-1 group-hover:text-[#8C6608] transition-colors">
                      {bundle.title}
                    </h3>
                    <p className="text-xs text-[#8C6608] font-medium mb-2.5 italic line-clamp-1">
                      {bundle.subtitle}
                    </p>

                    <p className="text-xs text-[#615B50] leading-relaxed mb-3.5 line-clamp-2">
                      {bundle.description}
                    </p>

                    {/* Included books mini list */}
                    <div className="space-y-1 mb-4 bg-[#FAF7F1] p-2.5 rounded-xl border border-[#EDE6D7]">
                      <div className="text-[10px] font-semibold text-[#736C5F] uppercase tracking-wider flex items-center gap-1 mb-1">
                        <Layers className="w-3 h-3 text-[#B8860B]" />
                        <span>Inclus ({bundleBooks.length} ebooks) :</span>
                      </div>
                      {bundleBooks.map((b) => (
                        <div key={b.id} className="flex items-center justify-between text-[11px] text-[#2A2722]">
                          <span className="truncate pr-2 font-medium">• {b.title}</span>
                          <span className="text-[#8C8477] shrink-0 font-medium">
                            {formatPrice(b.price, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to cart button */}
                  <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] tabular-nums">
                          {formatPrice(bundle.price, currency)}
                        </span>
                        <span className="text-xs text-[#9E9789] line-through tabular-nums">
                          {formatPrice(bundle.originalPrice, currency)}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Économisez {formatPrice(bundle.originalPrice - bundle.price, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddBundleToCart(bundle)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
                        isBundleInCart
                          ? 'bg-[#EAE4D7] text-[#554E42] border border-[#D9D1C1]'
                          : 'bg-[#1A1A1A] text-white hover:bg-[#332F28] hover:scale-105 active:scale-95'
                      }`}
                      aria-label={isBundleInCart ? 'Pack déjà dans le panier' : 'Ajouter le pack au panier'}
                      title={isBundleInCart ? 'Pack dans le panier' : 'Ajouter le pack au panier'}
                    >
                      {isBundleInCart ? (
                        <Check className="w-4 h-4 text-[#B8860B]" />
                      ) : (
                        <ShoppingBag className="w-4 h-4 text-[#E6C665]" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Slide Indicator Dots and mobile controls */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {bundles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSpecificIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeIndex === idx ? 'w-6 bg-[#B8860B]' : 'w-2 bg-[#DED6C5] hover:bg-[#B8860B]/60'
                }`}
                aria-label={`Aller au pack ${idx + 1}`}
              />
            ))}
            <span className="text-[10px] text-[#8C8477] ml-2 hidden sm:inline">
              {activeIndex + 1} / {bundles.length}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#736C5F]">
            <button
              onClick={onViewAllBundles}
              className="font-semibold text-[#8C6608] hover:text-[#5E4405] hover:underline cursor-pointer flex items-center gap-1 text-xs"
            >
              <span>Voir les {bundles.length} packs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

