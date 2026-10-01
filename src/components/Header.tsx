import React, { useState } from 'react';
import { Search, ShoppingBag, BookOpen, Sparkles, Menu, X, MessageSquare, Layers, Smartphone } from 'lucide-react';
import { CartItem } from '../types';
import { usePWAInstall } from '../lib/usePWAInstall';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenLibrary: () => void;
  onOpenComicReader?: () => void;
  onOpenAffiliate: () => void;
  onScrollToCatalogue: () => void;
  onScrollToBundles: () => void;
  onViewAllBundles: () => void;
  onRequestCustomBook?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isLoggedInUser: boolean;
  userEmail: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onOpenLibrary,
  onOpenComicReader,
  onOpenAffiliate,
  onScrollToCatalogue,
  onScrollToBundles,
  onViewAllBundles,
  searchQuery,
  onSearchChange,
  isLoggedInUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, install, isInstalled } = usePWAInstall();
  const cartCount = cartItems.length;

  const handleMobileNav = (callback: () => void) => {
    callback();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EFEAE1] transition-all">
      
      {/* Bandeau supérieur : CTA Affiliation Ultra-visible */}
      <div className="bg-gradient-to-r from-[#14120F] via-[#2A2318] to-[#14120F] text-white py-1.5 sm:py-2 px-3 sm:px-6 border-b border-[#3D3527] shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-[#B8860B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-200" />
              15% CASH
            </span>
            <span className="text-[11px] sm:text-xs text-[#FAF6EE] font-medium truncate">
              <strong className="text-amber-300 font-bold">Programme Affiliation :</strong> Gagnez 15% de commission sur chaque livre recommandé !
            </span>
          </div>

          <button
            onClick={onOpenAffiliate}
            className="shrink-0 bg-[#FAF1D9] hover:bg-white text-[#7A5805] text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-1 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span>Devenir Affilié</span>
            <span className="text-[#B8860B] font-black">→</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo Bookiin. */}
          <div className="flex items-center gap-4 lg:gap-7">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
              aria-label="Accueil Bookiin"
            >
              <img 
                src="/icon.svg" 
                alt="Logo Bookiin" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs transition-transform group-hover:scale-105 shrink-0 object-contain"
              />
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A] select-none block leading-none">
                  Bookiin<span className="text-[#B8860B] transition-transform group-hover:scale-125 inline-block">.</span>
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8A8477] font-medium mt-0.5">
                  Ebooks & Liseuse
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-sm font-medium text-[#4A453E]">
              <button 
                onClick={onScrollToCatalogue}
                className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#1A1A1A]"
              >
                Catalogue
              </button>
              
              <button 
                onClick={onScrollToBundles}
                className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 flex items-center gap-1 border-b border-transparent hover:border-[#1A1A1A]"
              >
                <Layers className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Packs & Offres</span>
              </button>

              {/* Bouton Lecteur BD / CBZ / CBR */}
              {onOpenComicReader && (
                <button
                  onClick={onOpenComicReader}
                  className="hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 flex items-center gap-1 border-b border-transparent hover:border-[#1A1A1A]"
                  title="Ouvrir le lecteur de bandes dessinées et mangas (.CBZ / .CBR)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Lecteur BD (.CBZ)</span>
                </button>
              )}

              {/* Bouton CTA Affiliation */}
              <button 
                onClick={onOpenAffiliate}
                className="bg-gradient-to-r from-amber-500/15 via-[#FAF3E0] to-amber-500/20 hover:from-amber-500/25 hover:to-amber-500/30 text-[#8C6608] hover:text-[#5E4405] border border-[#D4A017] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
                title="Gagnez 15% de commission sur chaque vente"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B] animate-pulse" />
                <span>Gagnez 15% • Espace Affilié</span>
              </button>
            </nav>
          </div>

          {/* Search bar & Action Buttons (Pas de bouton de devise) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Search input (visible on md+) */}
            <div className="relative hidden md:block w-36 lg:w-48 xl:w-56">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onFocus={() => {
                  if (window.scrollY > 80) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value.trim().length > 0 && window.scrollY > 80) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full bg-[#F4EFE6] text-xs text-[#1A1A1A] placeholder-[#8A8477] pl-8 pr-6 py-2 rounded-full border border-[#E8E1D5] focus:outline-none focus:border-[#B8860B] focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-[#8A8477] absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2 text-xs text-[#8A8477] hover:text-[#1A1A1A] cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Bouton "Mes livres" (remplace "Liseuse") */}
            <button
              onClick={onOpenLibrary}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer shadow-xs whitespace-nowrap"
              aria-label="Mes livres"
            >
              <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#B8860B]" />
              <span>Mes livres</span>
              {isLoggedInUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-0.5" title="Connecté"></span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1 sm:gap-2 bg-[#1A1A1A] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-[#2C2924] transition-all cursor-pointer shadow-sm group shrink-0"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#E6C665] group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide hidden md:inline">Panier</span>
              {cartCount > 0 && (
                <span className="bg-[#B8860B] text-white text-[11px] font-bold w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center -ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full hover:bg-[#F2ECE0] text-[#1A1A1A] transition-colors cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search input with 16px font to prevent mobile auto-zoom */}
        <div className="pb-2.5 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher un livre, un auteur..."
              value={searchQuery}
              onFocus={() => {
                if (window.scrollY > 80) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (e.target.value.trim().length > 0 && window.scrollY > 80) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              style={{ fontSize: '16px' }}
              className="w-full bg-[#F4EFE6] text-[16px] text-[#1A1A1A] placeholder-[#8A8477] pl-8.5 pr-8 py-2 rounded-full border border-[#E8E1D5] focus:outline-none focus:border-[#B8860B] focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-[#8A8477] absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2 text-xs text-[#8A8477] hover:text-[#1A1A1A] cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EFEAE1] bg-[#FDFBF7] px-4 py-3.5 space-y-2.5 shadow-lg animate-in slide-in-from-top-2">
          
          {/* CTA Affiliation Mobile Super Visible */}
          <button
            onClick={() => handleMobileNav(onOpenAffiliate)}
            className="w-full text-left py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#FAF3E0] to-[#F5EAD0] text-sm font-bold text-[#8C6608] border border-[#D9BC73] flex items-center justify-between cursor-pointer shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B8860B] animate-pulse" />
              <span>Gagnez 15% • Espace Affilié</span>
            </span>
            <span className="text-[10px] bg-[#B8860B] text-white px-2 py-0.5 rounded-full font-black uppercase shadow-2xs">
              15% CASH
            </span>
          </button>

          <button
            onClick={() => handleMobileNav(onScrollToCatalogue)}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-medium text-[#1A1A1A] cursor-pointer"
          >
            Catalogue complet
          </button>
          
          <button
            onClick={() => handleMobileNav(onViewAllBundles)}
            className="w-full text-left py-2 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-medium text-[#1A1A1A] flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B8860B]" />
              <span>Tous les Packs & Bundles (-10%)</span>
            </span>
            <span className="text-[10px] bg-[#FAF3E0] text-[#8C6608] px-2 py-0.5 rounded-full font-bold">
              Tout voir
            </span>
          </button>

          {onOpenComicReader && (
            <button
              onClick={() => handleMobileNav(onOpenComicReader)}
              className="w-full text-left py-2 px-3 rounded-xl hover:bg-[#F4EFE6] text-sm font-medium text-[#1A1A1A] flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Lecteur BD & Manga (.CBZ / .CBR)</span>
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                CBZ
              </span>
            </button>
          )}

          {!isInstalled && isInstallable && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                install();
              }}
              className="w-full text-left py-2 px-3 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium flex items-center justify-between cursor-pointer shadow-xs"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#E6C665]" />
                <span>Installer l'application Bookiin</span>
              </span>
              <span className="text-[10px] bg-[#332F28] text-[#E6C665] px-2 py-0.5 rounded-full font-bold">
                PWA
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
