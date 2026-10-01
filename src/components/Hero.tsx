import React from 'react';
import { ArrowRight, Sparkles, Download, ShieldCheck, Zap, BookHeart, MessageSquare } from 'lucide-react';
import { Currency, formatPrice } from '../lib/formatPrice';

interface HeroProps {
  currency?: Currency;
  onExploreCatalogue: () => void;
  onExploreBundles: () => void;
  onRequestCustomBook?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currency = 'EUR',
  onExploreCatalogue,
  onExploreBundles,
  onRequestCustomBook,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-20 border-b border-[#EFEAE1]">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#FAF0D7]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-[#EFE4D0]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Top kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#F4EFE6] border border-[#E5DEC4] text-xs text-[#5E584D]">
              <span className="w-2 h-2 rounded-full bg-[#B8860B] animate-pulse"></span>
              <span className="font-medium">Sans abonnement • Lecture universelle</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.15]">
              L’art de lire, <br className="hidden xs:inline" />
              la liberté de <span className="italic font-serif text-[#B8860B]">posséder</span>.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#5A5449] max-w-xl leading-relaxed">
              Vos ebooks préférés en téléchargement direct <strong className="text-[#1A1A1A] font-semibold">EPUB & PDF sans DRM</strong>. 
              Accès immédiat par lien magique et liseuse web incluse.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={onExploreCatalogue}
                className="w-full sm:w-auto bg-[#1A1A1A] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#2F2C26] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                <span>Explorer le catalogue</span>
                <ArrowRight className="w-4 h-4 text-[#C59B27]" />
              </button>

              <button
                onClick={onExploreBundles}
                className="w-full sm:w-auto bg-white text-[#1A1A1A] border border-[#D9D1C1] px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#FAF7F0] hover:border-[#B8860B] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Packs & Bundles (-10%)</span>
              </button>
            </div>

            {/* Key benefits row */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#EFEAE1]/80 max-w-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider">
                  <Download className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Direct</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#7A7468]">Téléchargement à vie</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Invité</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#7A7468]">Paiement sans compte</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Sans DRM</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#7A7468]">Kindle, Kobo & tablettes</p>
              </div>
            </div>

          </div>

          {/* Visual Book Spotlight */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-xs sm:max-w-sm">
              
              <div className="relative rounded-2xl bg-gradient-to-br from-[#FAF6EE] to-[#EFE7D8] p-4 sm:p-6 shadow-xl border border-[#E8E0D0]">
                
                {/* Book Card floating display */}
                <div className="relative rounded-xl overflow-hidden shadow-2xl bg-[#1A1A1A] aspect-[3/4] max-h-[340px] sm:max-h-[380px] flex flex-col justify-end p-5 sm:p-6 text-white group">
                  <img
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80"
                    alt="Livre vedette"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-75 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent"></div>
                  
                  <div className="relative z-10 space-y-1.5">
                    <span className="inline-block bg-[#B8860B] text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
                      Coup de Cœur
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                      L’Archipel des Silences
                    </h3>
                    <p className="text-xs text-stone-300">
                      Camille de Montmirail • Roman
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <div className="text-sm font-medium">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#E6C665]">
                          {formatPrice(9.90, currency)}
                        </span>
                        <span className="line-through text-stone-400 text-xs ml-2">
                          {formatPrice(16.00, currency)}
                        </span>
                      </div>
                      <span className="text-xs text-stone-300 flex items-center gap-1">
                        ★ 4.8
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating badge for Custom bundle benefit */}
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-lg border border-[#E8E1D5] max-w-[180px] sm:max-w-[200px] flex items-center gap-2.5">
                  <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-[#FAF3E1] flex items-center justify-center shrink-0">
                    <BookHeart className="w-4 sm:w-5 h-4 sm:h-5 text-[#B8860B]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#1A1A1A]">Packs Sur-Mesure</p>
                    <p className="text-[9px] sm:text-[10px] text-[#7A7468]">-10% dès 3 livres</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
