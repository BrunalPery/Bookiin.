import React, { useState } from 'react';
import { Package, ArrowLeft, ShoppingBag, Check, Layers, Sparkles, Filter } from 'lucide-react';
import { Bundle, Book, CartItem } from '../types';
import { Currency, formatPrice } from '../lib/formatPrice';

interface AllBundlesViewProps {
  bundles: Bundle[];
  books: Book[];
  cartItems: CartItem[];
  currency: Currency;
  onAddBundleToCart: (bundle: Bundle) => void;
  onBackToHome: () => void;
  onOpenCustomRequest: () => void;
}

export const AllBundlesView: React.FC<AllBundlesViewProps> = ({
  bundles,
  books,
  cartItems,
  currency,
  onAddBundleToCart,
  onBackToHome,
  onOpenCustomRequest,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'bestsellers'>('all');

  const displayedBundles = filterMode === 'bestsellers' 
    ? bundles.filter(b => b.isBestSeller)
    : bundles;

  return (
    <div className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EDE6D7] gap-3">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#B8860B] transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l’accueil</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              filterMode === 'all'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#5E584D] border border-[#ECE5D8]'
            }`}
          >
            Tous les packs ({bundles.length})
          </button>
          <button
            onClick={() => setFilterMode('bestsellers')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              filterMode === 'bestsellers'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#5E584D] border border-[#ECE5D8]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#B8860B]" />
            <span>Top Ventes & Vues</span>
          </button>
        </div>
      </div>

      {/* Page Title Header */}
      <div className="py-6 sm:py-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8C6608] font-bold">
          <Package className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Catalogue des Offres Groupées</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
          Tous les Packs & Bundles <span className="italic font-serif text-[#B8860B]">Bookiin</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#666053] max-w-xl">
          Économisez jusqu'à 20% par rapport à l'achat unitaire. Vos ebooks sont livrés ensemble sans DRM dans votre bibliothèque.
        </p>
      </div>

      {/* Grid of All Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBundles.map((bundle) => {
          const isBundleInCart = cartItems.some(i => i.type === 'bundle' && i.id === bundle.id);
          const bundleBooks = books.filter(b => bundle.bookIds.includes(b.id));

          return (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl p-5 border border-[#E8E1D2] hover:border-[#D1C6B4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badge & Discount */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-[#FAF3E0] text-[#8C6608] border border-[#E9DCB8] text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                    {bundle.badge}
                  </span>
                  <span className="bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    -{bundle.discountPercentage}%
                  </span>
                </div>

                {/* Cover & Title */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3.5 bg-[#FAF7F1] shadow-inner">
                  <img
                    src={bundle.coverImage}
                    alt={bundle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] text-white font-medium">
                      {bundleBooks.length} ebooks complets inclus
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] mb-1">
                  {bundle.title}
                </h3>
                <p className="text-xs text-[#8C6608] font-medium mb-2 italic">
                  {bundle.subtitle}
                </p>

                <p className="text-xs text-[#615B50] leading-relaxed mb-4">
                  {bundle.description}
                </p>

                {/* Included Books list */}
                <div className="space-y-1.5 mb-5 bg-[#FAF7F1] p-3 rounded-xl border border-[#EDE6D7]">
                  <div className="text-[10px] font-semibold text-[#736C5F] uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#B8860B]" />
                    <span>Titres inclus :</span>
                  </div>
                  {bundleBooks.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-xs text-[#2A2722]">
                      <span className="truncate pr-2 font-medium">• {b.title}</span>
                      <span className="text-[#8C8477] shrink-0 font-medium text-[11px]">
                        {formatPrice(b.price, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3.5 border-t border-[#F2ECE1] flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] tabular-nums">
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
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
          );
        })}
      </div>

      {/* Book Request Banner */}
      <div className="mt-12 bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#E8E1D2] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
            Un livre ou une saga manque à notre catalogue ?
          </h3>
          <p className="text-xs text-[#7A7468]">
            Demandez-le gratuitement et soyez notifié sur WhatsApp dès son arrivée.
          </p>
        </div>
        <button
          onClick={onOpenCustomRequest}
          className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#332F28] transition-all cursor-pointer shrink-0"
        >
          Commander un livre absent
        </button>
      </div>

    </div>
  );
};
