import React from 'react';
import { Sparkles, BookOpen, ArrowUp, MessageSquare, Lock } from 'lucide-react';

interface FooterProps {
  onScrollToCatalogue: () => void;
  onScrollToBundles: () => void;
  onViewAllBundles?: () => void;
  onRequestCustomBook?: () => void;
  onOpenLibrary: () => void;
  onOpenAffiliate: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToCatalogue,
  onScrollToBundles,
  onViewAllBundles,
  onRequestCustomBook,
  onOpenLibrary,
  onOpenAffiliate,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#1A1A1A] text-white border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tout en bas de page : Bloc d'action Demander un livre et Affilié juste en dessous */}
        <div className="mb-12 bg-gradient-to-b from-[#26221B] to-[#1F1C16] border border-[#3E3628] rounded-3xl p-6 sm:p-8 text-center shadow-xl">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-[#E6C665] font-bold block">
              Besoin d'un ouvrage ou envie de partager ?
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Nous trouvons vos livres & récompensons vos recommandations
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Un livre manque au catalogue ? Demandez-le-nous directement. Et devenez partenaire pour toucher 15% de commission immédiate sur chaque vente.
            </p>

            <div className="pt-2 flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
              {/* Bouton Demander */}
              {onRequestCustomBook && (
                <button
                  onClick={onRequestCustomBook}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-5 rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-200" />
                  <span>Demander un livre introuvable</span>
                </button>
              )}

              {/* Bouton Affilié juste en bas du bouton demander */}
              <button
                onClick={onOpenAffiliate}
                className="w-full bg-[#FAF3E0] hover:bg-[#FAF0D0] text-[#7A5805] font-bold py-3 px-5 rounded-full text-xs sm:text-sm border-2 border-[#D9BC73] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#B8860B] animate-pulse" />
                <span>Espace Affilié : Gagnez 15% par vente</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="/icon.svg" 
                alt="Logo Bookiin" 
                className="w-10 h-10 rounded-xl shadow-xs shrink-0 object-contain"
              />
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white select-none block leading-none">
                  Bookiin<span className="text-[#B8860B]">.</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#B8860B] font-medium mt-1">
                  Éditions Numériques
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Téléchargement direct</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"></span>
                <span>Sans DRM</span>
              </span>
            </div>
          </div>

          {/* Nav Links Column */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Explorer
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={onScrollToCatalogue}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Catalogue des Nouveautés
                </button>
              </li>
              <li>
                <button
                  onClick={onViewAllBundles || onScrollToBundles}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tous les Packs & Bundles (-10%)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLibrary}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>Mes livres</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAffiliate}
                  className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-xs text-[#E6C665]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Programme Affiliation (15%)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row with Admin discreet link */}
        <div className="pt-6 flex flex-col xs:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Bookiin. Tous droits réservés.</p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                title="Accès réservé aux administrateurs"
              >
                <Lock className="w-3 h-3 text-[#B8860B]" />
                <span>Administration</span>
              </button>
            )}
          </div>
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Retour en haut</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};

