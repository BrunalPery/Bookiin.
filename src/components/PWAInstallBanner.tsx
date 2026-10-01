import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, WifiOff, Share2, PlusSquare, BookOpen } from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isOnline, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('bookiin_pwa_dismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('bookiin_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Status Badge */}
      {!isOnline && (
        <aside aria-label="Alerte statut de connexion" className="bg-[#2D2314] text-[#E6C665] border-b border-[#5E4405] px-4 py-2 text-xs flex items-center justify-center gap-2 font-medium z-50">
          <WifiOff className="w-3.5 h-3.5 text-[#E6C665] animate-pulse" />
          <span>Mode Hors-Ligne Actif — Vos ebooks enregistrés restent disponibles dans votre liseuse</span>
        </aside>
      )}

      {/* PWA Install Banner for Mobile & Desktop (if not installed & not dismissed) */}
      {!isInstalled && !isDismissed && (isInstallable || isIOS) && (
        <aside aria-label="Installation de l'application" className="bg-[#FAF7F0] border-b border-[#E8DFC8] px-3 sm:px-4 py-2.5 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src="/icon.svg" 
                alt="Logo Bookiin" 
                className="w-9 h-9 rounded-xl shadow-xs shrink-0 object-contain"
              />
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-[#1A1A1A] truncate flex items-center gap-1.5">
                  <span>Installer l'application Bookiin</span>
                  <span className="text-[10px] bg-[#EFE4D0] text-[#7A5805] px-1.5 py-0.2 rounded font-semibold uppercase hidden sm:inline">PWA Mobile</span>
                </p>
                <p className="text-[11px] text-[#7A7468] truncate hidden xs:block">
                  Lisez vos ebooks en toute fluidité, même sans connexion internet.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isInstallable && (
                <button
                  onClick={install}
                  className="bg-[#1A1A1A] hover:bg-[#332F28] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Installer</span>
                </button>
              )}

              {isIOS && (
                <button
                  onClick={() => setShowIOSGuide(true)}
                  className="bg-[#1A1A1A] hover:bg-[#332F28] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Ajouter à l'écran d'accueil</span>
                </button>
              )}

              <button
                onClick={handleDismiss}
                className="text-[#999285] hover:text-[#1A1A1A] p-1 rounded-full hover:bg-[#EDE6D8] transition-colors cursor-pointer"
                title="Fermer"
                aria-label="Fermer la bannière"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* iOS Safari Guided Install Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#FDFBF7] p-6 shadow-2xl border border-[#ECE5D8] text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE5D8]">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/icon.svg" 
                  alt="Icône Bookiin" 
                  className="w-10 h-10 rounded-xl shadow-xs shrink-0 object-contain"
                />
                <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Installer sur iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                aria-label="Fermer le guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Pour profiter de Bookiin comme d'une véritable application avec lecture hors-ligne :
            </p>

            <ol className="space-y-3 text-xs text-[#2C2822]">
              <li className="flex items-start gap-3 bg-[#FAF7F0] p-3 rounded-2xl border border-[#ECE5D8]">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Appuyez sur le bouton Partager</p>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    Icône <Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> dans la barre de votre navigateur Safari.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-[#FAF7F0] p-3 rounded-2xl border border-[#ECE5D8]">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Sélectionnez « Sur l'écran d'accueil »</p>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    Faites défiler vers le bas et touchez <PlusSquare className="w-3.5 h-3.5 text-stone-700 inline" />.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-[#FAF7F0] p-3 rounded-2xl border border-[#ECE5D8]">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <div>
                  <p className="font-semibold text-[#1A1A1A]">Validez avec « Ajouter »</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    L'icône Bookiin apparaîtra immédiatement sur votre écran d'accueil.
                  </p>
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#332F28] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
