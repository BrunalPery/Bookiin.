import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles, CheckCircle2, Lock, CreditCard, Download, FileText, Layers, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, Book } from '../types';
import { Currency, formatPrice } from '../lib/formatPrice';
import { downloadFromR2OrGenerate } from '../lib/bookDownloader';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  books?: Book[];
  currency?: Currency;
  onRemoveItem: (id: string, type: 'book' | 'bundle') => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
  affiliateRef: string;
  onUpdateAffiliateRef: (ref: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  books = [],
  currency = 'EUR',
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  affiliateRef,
  onUpdateAffiliateRef,
}) => {
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);
  const [refInput, setRefInput] = useState(affiliateRef);
  const [showRefBox, setShowRefBox] = useState(!!affiliateRef);

  if (!isOpen) return null;

  // Calculate pricing & discounts
  const rawSubtotal = items.reduce((sum, item) => sum + item.price, 0);
  const singleBooksCount = items.filter(i => i.type === 'book').length;
  const isCustomBundleActive = singleBooksCount >= 3;

  const singleBooksTotal = items
    .filter(i => i.type === 'book')
    .reduce((sum, item) => sum + item.price, 0);
  const discountAmount = isCustomBundleActive ? singleBooksTotal * 0.10 : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleLaunchStripeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail.trim() || !guestEmail.includes('@') || !guestEmail.includes('.')) {
      setEmailError('Veuillez saisir une adresse email valide.');
      return;
    }
    setEmailError('');
    setShowStripeModal(true);
  };

  const handleConfirmStripePayment = () => {
    setIsProcessingStripe(true);

    setTimeout(() => {
      const commissionAmount = affiliateRef ? Number((finalTotal * 0.15).toFixed(2)) : undefined;
      const newOrder: Order = {
        id: 'ord_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        customerEmail: guestEmail.trim().toLowerCase(),
        totalAmount: finalTotal,
        items: [...items],
        createdAt: new Date().toISOString(),
        status: 'paid',
        stripePaymentId: 'ch_stripe_' + Math.random().toString(36).substring(2, 10),
        affiliateRef: affiliateRef || undefined,
        commissionAmount,
      };

      setIsProcessingStripe(false);
      setShowStripeModal(false);
      setOrderCompleted(newOrder);

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      onOrderSuccess(newOrder);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col border-l border-[#EAE3D4]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#ECE4D5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B8860B]" />
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                Mon Panier <span className="text-xs sm:text-sm font-sans font-normal text-[#8A8477]">({items.length})</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-[#EFE7D8] flex items-center justify-center text-[#736C5E] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Content or Order Success */}
          {orderCompleted ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Paiement Réussi !
              </h3>
              <p className="text-xs sm:text-sm text-[#5A5449] max-w-xs">
                Vos livres sont prêts et disponibles sur votre adresse <strong className="text-[#1A1A1A]">{orderCompleted.customerEmail}</strong>.
              </p>

              <div className="bg-[#FAF6ED] p-3.5 rounded-xl border border-[#EDE4D2] text-xs text-left w-full space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#8C8476]">Commande :</span>
                  <span className="font-bold text-[#1A1A1A]">{orderCompleted.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C8476]">Total réglé :</span>
                  <span className="font-bold text-[#1A1A1A]">{formatPrice(orderCompleted.totalAmount)}</span>
                </div>
              </div>

              {/* Instant Downloads for purchased items */}
              <div className="w-full space-y-2 text-left pt-1">
                <span className="text-[11px] font-bold text-[#4A453E] uppercase tracking-wider block">
                  Téléchargement direct hors-ligne :
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {orderCompleted.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-2.5 bg-white rounded-xl border border-[#EDE4D2] flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <p className="font-serif font-bold text-xs text-[#1A1A1A] truncate">
                          {it.title}
                        </p>
                        <p className="text-[10px] text-[#7A7468]">Sans DRM • Prêt pour smartphone</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const foundBook = books.find((b) => b.id === it.id);
                            const bookToDownload: Book = foundBook || {
                              id: it.id,
                              title: it.title,
                              author: it.authorOrSubtitle,
                              category: 'ROMAN',
                              price: it.price,
                              rating: 5,
                              reviewsCount: 1,
                              coverUrl: it.coverUrl,
                              description: it.title,
                              pages: 250,
                              publishedYear: 2026,
                              fileSize: '3 Mo',
                              r2FileKey: '',
                              formats: ['EPUB', 'PDF'],
                              excerpt: [it.title],
                            };
                            downloadFromR2OrGenerate(bookToDownload, 'EPUB');
                          }}
                          className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#332F28] text-white text-[11px] font-semibold rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          title="Télécharger en EPUB (Cloudflare R2)"
                        >
                          <Download className="w-3 h-3 text-[#E6C665]" />
                          <span>EPUB</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const foundBook = books.find((b) => b.id === it.id);
                            const bookToDownload: Book = foundBook || {
                              id: it.id,
                              title: it.title,
                              author: it.authorOrSubtitle,
                              category: 'ROMAN',
                              price: it.price,
                              rating: 5,
                              reviewsCount: 1,
                              coverUrl: it.coverUrl,
                              description: it.title,
                              pages: 250,
                              publishedYear: 2026,
                              fileSize: '3 Mo',
                              r2FileKey: '',
                              formats: ['EPUB', 'PDF'],
                              excerpt: [it.title],
                            };
                            downloadFromR2OrGenerate(bookToDownload, 'PDF');
                          }}
                          className="px-2 py-1 bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#3A352D] text-[11px] font-semibold rounded-full border border-[#D9D1C1] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Télécharger en PDF (Cloudflare R2)"
                        >
                          <FileText className="w-3 h-3 text-[#B8860B]" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={() => {
                    setOrderCompleted(null);
                    onClose();
                  }}
                  className="w-full bg-[#1A1A1A] text-white py-3 rounded-full text-xs font-semibold hover:bg-[#332F28] transition-all cursor-pointer shadow-md"
                >
                  Accéder à ma bibliothèque complète
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#736C5F] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EC] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#A39B8D]" />
              </div>
              <p className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">Votre panier est vide</p>
              <p className="text-xs text-[#8A8477] max-w-xs">
                Ajoutez un ou plusieurs ebooks pour commencer votre lecture.
              </p>
              <button
                onClick={onClose}
                className="mt-1 px-4 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#332F28] cursor-pointer"
              >
                Parcourir les livres
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
                
                {/* Custom Bundle Alert */}
                {isCustomBundleActive && (
                  <div className="bg-[#FAF3DF] border border-[#E8D9B0] p-2.5 rounded-xl flex items-center gap-2 text-xs text-[#7A5B0B]">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#B8860B]" />
                    <span>
                      <strong>Remise pack -10% appliquée</strong> sur vos {singleBooksCount} livres !
                    </span>
                  </div>
                )}

                {items.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center gap-2.5 bg-white p-2.5 sm:p-3 rounded-xl border border-[#ECE5D8] shadow-xs"
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded-md shrink-0 bg-[#F4EFE6]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-[#8C6608] bg-[#FAF3E1] px-1.5 py-0.5 rounded">
                        {item.type === 'bundle' ? 'PACK' : 'EBOOK'}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-[#1A1A1A] truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#736C5E] truncate">
                        {item.authorOrSubtitle}
                      </p>
                      <span className="font-serif font-bold text-xs text-[#1A1A1A] mt-0.5 block">
                        {formatPrice(item.price, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id, item.type)}
                      className="text-[#A39B8D] hover:text-rose-600 p-1.5 transition-colors cursor-pointer shrink-0"
                      title="Retirer du panier"
                      aria-label={`Retirer ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Affiliate Code section */}
                <div className="pt-1">
                  {!showRefBox ? (
                    <button
                      onClick={() => setShowRefBox(true)}
                      className="text-xs text-[#8C6608] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Tag className="w-3 h-3" />
                      <span>Code de parrainage ?</span>
                    </button>
                  ) : (
                    <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#EAE3D4] space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-semibold text-[#5A5449]">
                        <span>Code affilié :</span>
                        <button 
                          onClick={() => setShowRefBox(false)}
                          className="text-[10px] text-[#8A8477]"
                        >
                          Fermer
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Ex: alex24"
                          value={refInput}
                          onChange={(e) => setRefInput(e.target.value)}
                          className="flex-1 text-xs bg-white border border-[#D9D1C1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#B8860B]"
                        />
                        <button
                          type="button"
                          onClick={() => onUpdateAffiliateRef(refInput.trim())}
                          className="bg-[#1A1A1A] text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-[#332F28] cursor-pointer"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Guest Checkout Form & Order Summary */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#ECE4D5] space-y-3">
                
                {/* Pricing Summary */}
                <div className="space-y-1 text-xs text-[#554E42]">
                  <div className="flex justify-between">
                    <span>Sous-total :</span>
                    <span className="tabular-nums">{formatPrice(rawSubtotal, currency)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Remise Pack (-10%) :</span>
                      <span className="tabular-nums">-{formatPrice(discountAmount, currency)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-1.5 border-t border-[#F2ECE1]">
                    <span>Total à régler :</span>
                    <span className="font-serif text-lg text-[#1A1A1A] tabular-nums">
                      {formatPrice(finalTotal, currency)}
                    </span>
                  </div>
                </div>

                {/* Guest Checkout Form */}
                <form onSubmit={handleLaunchStripeCheckout} className="space-y-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A453E] uppercase tracking-wider mb-1">
                      Votre email pour recevoir vos livres
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className="w-full text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-full px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B] focus:bg-white transition-all text-[#1A1A1A]"
                    />
                    {emailError ? (
                      <p className="text-[11px] text-rose-600 mt-1">{emailError}</p>
                    ) : (
                      <p className="text-[10px] text-[#8C8477] mt-1">
                        Aucun mot de passe nécessaire.
                      </p>
                    )}
                  </div>

                  {/* Payment Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white py-3 px-5 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#2C2924] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#E6C665]" />
                    <span>Régler {formatPrice(finalTotal, currency)}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C8477]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Paiement sécurisé Stripe • Téléchargement immédiat</span>
                  </div>
                </form>

              </div>
            </>
          )}

        </div>
      </div>

      {/* Hosted Stripe Checkout Overlay Simulation */}
      {showStripeModal && (
        <div className="fixed inset-0 z-60 bg-[#1A1A1A]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-black text-[#1A1A1A]">Bookiin<span className="text-[#B8860B]">.</span></span>
                <span className="text-[11px] bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 rounded font-mono font-medium">Stripe</span>
              </div>
              <button 
                onClick={() => setShowStripeModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="text-center">
                <p className="text-[11px] text-stone-500 uppercase tracking-widest font-semibold">Total à payer</p>
                <p className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A] mt-1">
                  {formatPrice(finalTotal, currency)}
                </p>
                <p className="text-xs text-stone-500 mt-0.5 truncate">Client : <strong className="text-stone-700">{guestEmail}</strong></p>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-stone-700 font-medium">
                  <CreditCard className="w-4 h-4 text-[#635BFF]" />
                  <span>Carte bancaire</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-stone-200 font-mono text-stone-600 flex justify-between text-xs">
                  <span>•••• •••• •••• 4242</span>
                  <span>12/28</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                disabled={isProcessingStripe}
                onClick={handleConfirmStripePayment}
                className="w-full bg-[#635BFF] hover:bg-[#5347ED] text-white py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isProcessingStripe ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Validation...</span>
                  </>
                ) : (
                  <>
                    <span>Valider et payer {formatPrice(finalTotal, currency)}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowStripeModal(false)}
                className="w-full py-1.5 text-xs text-stone-500 hover:text-stone-700 text-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
