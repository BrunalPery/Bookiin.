import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Download,
  Mail,
  ArrowRight,
  ShieldCheck,
  LogOut,
  FileText,
  CheckCircle2,
  FolderArchive,
  Smartphone,
  HelpCircle,
  Sparkles,
  Layers,
  Compass
} from 'lucide-react';
import { Book, Order } from '../types';
import { downloadFromR2OrGenerate, downloadAllCustomerBooks } from '../lib/bookDownloader';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  orders: Order[];
  currentUserEmail: string | null;
  onLoginWithMagicLink: (email: string) => void;
  onLogout: () => void;
  onOpenReader: (book: Book) => void;
  onOpenComicReader?: (book?: Book) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  books,
  orders,
  currentUserEmail,
  onLoginWithMagicLink,
  onLogout,
  onOpenReader,
  onOpenComicReader,
}) => {
  const [inputEmail, setInputEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);
  const [showPhoneGuide, setShowPhoneGuide] = useState(false);

  if (!isOpen) return null;

  // Retrieve books purchased by currentUserEmail
  const userOrders = orders.filter(
    (o) => currentUserEmail && o.customerEmail.toLowerCase() === currentUserEmail.toLowerCase()
  );

  const purchasedBookIds = Array.from(
    new Set(
      userOrders.flatMap((o) =>
        o.items.flatMap((item) => item.bookIds || [item.id])
      )
    )
  );

  // If user has orders, get their books. If they just signed in with the demo account, include demo books
  const purchasedBooks = books.filter((b) => purchasedBookIds.includes(b.id));

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim() || !inputEmail.includes('@')) return;
    setMagicLinkSent(true);
  };

  const handleSimulateMagicLinkClick = () => {
    onLoginWithMagicLink(inputEmail.trim().toLowerCase());
    setMagicLinkSent(false);
  };

  const handleDownload = async (book: Book, format: 'EPUB' | 'PDF' | 'CBZ') => {
    setDownloadingBookId(`${book.id}-${format}`);
    try {
      const fileName = await downloadFromR2OrGenerate(book, format);

      setDownloadSuccessNotice(
        `Fichier "${fileName}" téléchargé avec succès ! Prêt pour votre liseuse ou smartphone.`
      );
      setTimeout(() => setDownloadSuccessNotice(null), 5000);
    } catch (err) {
      console.error('[Library] Download error:', err);
      setDownloadSuccessNotice(`Erreur lors de la génération du fichier ${format}.`);
      setTimeout(() => setDownloadSuccessNotice(null), 4000);
    } finally {
      setDownloadingBookId(null);
    }
  };

  const handleDownloadAll = async () => {
    if (purchasedBooks.length === 0) return;
    setDownloadingBookId('all-books');
    try {
      const fileName = await downloadAllCustomerBooks(purchasedBooks);
      setDownloadSuccessNotice(`Archive complète "${fileName}" téléchargée !`);
      setTimeout(() => setDownloadSuccessNotice(null), 5000);
    } catch (err) {
      console.error('[Library] Download all error:', err);
    } finally {
      setDownloadingBookId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FDFBF7] rounded-3xl max-w-3xl w-full p-4 sm:p-7 shadow-2xl border border-[#EAE3D4] relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE6D7]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3E1] border border-[#EADBB8] flex items-center justify-center text-[#B8860B] shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] truncate">
                  Ma Bibliothèque Hors-Ligne
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  0 DRM
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#7A7468] truncate">
                {currentUserEmail ? (
                  <span>Compte : <strong className="text-[#1A1A1A]">{currentUserEmail}</strong></span>
                ) : (
                  'Accédez à vos livres et téléchargez-les sur vos appareils'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUserEmail && (
              <button
                onClick={onLogout}
                className="text-xs text-[#7A7468] hover:text-[#1A1A1A] flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#D9D1C1] hover:bg-[#FAF7F0] cursor-pointer transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Changer de compte</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-[#EFE7D8] flex items-center justify-center text-[#736C5E] hover:text-[#1A1A1A] cursor-pointer transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice Toast */}
        {downloadSuccessNotice && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate flex-1">{downloadSuccessNotice}</span>
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          {!currentUserEmail ? (
            /* Magic Link Sign In */
            <div className="max-w-md mx-auto text-center space-y-4 py-4">
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Retrouvez tous vos livres
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6558] leading-relaxed">
                  Entrez l’adresse e-mail renseignée lors de vos achats pour télécharger vos fichiers (EPUB, PDF, CBZ) et lire sans connexion.
                </p>
              </div>

              {!magicLinkSent ? (
                <form onSubmit={handleSendMagicLink} className="space-y-3 pt-2">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="votre.email@exemple.com"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-white border border-[#D9D1C1] rounded-full pl-10 pr-4 py-3 focus:outline-none focus:border-[#B8860B] text-[#1A1A1A] shadow-xs"
                    />
                    <Mail className="w-4 h-4 text-[#8C8477] absolute left-3.5 top-3.5" />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] text-white py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#332F28] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Recevoir mon lien de lecture</span>
                    <ArrowRight className="w-4 h-4 text-[#E6C665]" />
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setInputEmail('lecteur.passionne@bookiin.fr');
                        onLoginWithMagicLink('lecteur.passionne@bookiin.fr');
                      }}
                      className="text-xs font-semibold text-[#8C6608] hover:underline"
                    >
                      Connexion rapide (compte démo avec livres) →
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-3 text-left animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lien magique envoyé !</span>
                  </div>

                  <p className="text-xs text-[#554E42]">
                    Un lien sécurisé a été généré pour <strong className="text-[#1A1A1A]">{inputEmail}</strong>.
                  </p>

                  <button
                    type="button"
                    onClick={handleSimulateMagicLinkClick}
                    className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-full text-xs font-semibold hover:bg-[#332F28] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ouvrir ma bibliothèque</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C8477] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                <span>Accès sécurisé sans mot de passe • Formats universels sans DRM</span>
              </div>
            </div>
          ) : (
            /* User's Purchased Books List */
            <div className="space-y-4">
              
              {/* Top Action & Offline Notice Bar */}
              <div className="bg-[#FAF6ED] p-3.5 sm:p-4 rounded-2xl border border-[#EDE2CC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF0D5] text-[#8C6608] flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                      <span>Téléchargement direct hors plateforme</span>
                      <span className="text-[10px] bg-[#EAE2D1] text-[#7A5A09] px-2 py-0.2 rounded-full font-semibold">
                        {purchasedBooks.length} ouvrage{purchasedBooks.length > 1 ? 's' : ''}
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#736C5E] mt-0.5">
                      Enregistrez vos fichiers sur votre téléphone pour les lire hors ligne dans l'application de votre choix (Apple Livres, Moon+ Reader, Panels).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowPhoneGuide(!showPhoneGuide)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-[#7A5A09] bg-white border border-[#D9CEB8] hover:bg-[#FAF7F0] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Guide smartphone</span>
                  </button>

                  {purchasedBooks.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadAll}
                      disabled={downloadingBookId === 'all-books'}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#332F28] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                    >
                      <FolderArchive className="w-3.5 h-3.5 text-[#E6C665]" />
                      <span>{downloadingBookId === 'all-books' ? 'Génération...' : 'Tout télécharger (ZIP)'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Guide Accordion / Modal */}
              {showPhoneGuide && (
                <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9] space-y-3 text-xs text-[#4A453E] animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
                    <h5 className="font-serif font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#B8860B]" />
                      <span>Comment lire vos livres sur votre téléphone hors-ligne ?</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowPhoneGuide(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE7DB] space-y-1">
                      <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                        <span>iPhone & iPad (iOS)</span>
                      </p>
                      <p className="text-[11px] text-[#6E6759]">
                        Téléchargez le fichier <strong>.EPUB</strong>. Ouvrez l'application <strong>Fichiers</strong> et touchez-le : il s'importe automatiquement dans <strong>Apple Livres</strong>.
                      </p>
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE7DB] space-y-1">
                      <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                        <span>Android</span>
                      </p>
                      <p className="text-[11px] text-[#6E6759]">
                        Touchez le fichier <strong>.EPUB</strong> ou <strong>.PDF</strong> dans vos Téléchargements. Choisissez <strong>Google Play Livres</strong>, <strong>Moon+ Reader</strong> ou <strong>Lithium</strong>.
                      </p>
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE7DB] space-y-1">
                      <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                        <span>BD & Mangas (.CBZ / .CBR)</span>
                      </p>
                      <p className="text-[11px] text-[#6E6759]">
                        Téléchargez le <strong>.CBZ</strong> et ouvrez-le avec <strong>Panels</strong> ou <strong>Chunky</strong> (iOS) ou <strong>Kuro Reader / ComicScreen</strong> (Android), ou directement dans notre lecteur intégré ci-dessous.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated CBZ / CBR Comic Reader Trigger Box */}
              {onOpenComicReader && (
                <div className="bg-gradient-to-r from-[#1E1B17] via-[#2A241C] to-[#1E1B17] p-3.5 sm:p-4 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-[#3E382E]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                        <span>Lecteur Spécialisé BD & Manga (.CBZ / .CBR)</span>
                        <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold uppercase">Nouveau</span>
                      </h4>
                      <p className="text-xs text-stone-300 mt-0.5">
                        Lisez en mode double page, sens manga droite-à-gauche ou défilement webtoon. Compatible avec vos propres archives .cbz / .cbr.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenComicReader();
                    }}
                    className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold shrink-0 cursor-pointer shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Lancer le lecteur BD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Purchased Books Grid */}
              {purchasedBooks.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <h4 className="font-serif text-base font-bold text-[#1A1A1A]">Aucun livre trouvé</h4>
                  <p className="text-xs text-[#7A7468] max-w-sm mx-auto">
                    Aucun achat n'est encore associé à cette adresse e-mail.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {purchasedBooks.map((book) => {
                    const isComic = book.category === 'BD_MANGA' || book.isComic || book.formats.includes('CBZ');
                    const hasCbz = book.formats.includes('CBZ');
                    const hasPdf = book.formats.includes('PDF');
                    const hasEpub = book.formats.includes('EPUB');

                    return (
                      <div
                        key={book.id}
                        className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#ECE5D8] flex gap-3.5 shadow-xs hover:border-[#D1C6B4] transition-all"
                      >
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded-xl bg-[#FAF7F1] shrink-0 shadow-sm border border-[#EAE3D4]"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[9px] font-bold text-[#8C6608] bg-[#FAF3E1] px-1.5 py-0.5 rounded uppercase">
                                {book.category}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                {book.fileSize}
                              </span>
                            </div>
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] truncate">
                              {book.title}
                            </h4>
                            <p className="text-[11px] text-[#736C5E] truncate">
                              {book.author}
                            </p>
                          </div>

                          {/* Customer Actions & Formats */}
                          <div className="pt-2.5 space-y-2">
                            {/* Read in app button */}
                            <div className="flex items-center gap-2">
                              {isComic && onOpenComicReader ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onOpenComicReader(book);
                                  }}
                                  className="bg-amber-400 hover:bg-amber-300 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Layers className="w-3 h-3" />
                                  <span>Lecteur BD</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onOpenReader(book)}
                                  className="bg-[#1A1A1A] text-white hover:bg-[#332F28] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <BookOpen className="w-3 h-3 text-[#E6C665]" />
                                  <span>Liseuse</span>
                                </button>
                              )}
                              <span className="text-[10px] text-[#8C8477]">ou télécharger :</span>
                            </div>

                            {/* Download Outside Platform Buttons */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {hasEpub && (
                                <button
                                  type="button"
                                  disabled={downloadingBookId === `${book.id}-EPUB`}
                                  onClick={() => handleDownload(book, 'EPUB')}
                                  className="bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#3A352D] px-2.5 py-1 rounded-full text-[11px] font-semibold border border-[#DED7C7] flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                                  title="Télécharger le fichier .EPUB pour Apple Livres, Kobo, smartphone"
                                >
                                  <Download className="w-3 h-3 text-[#B8860B]" />
                                  <span>{downloadingBookId === `${book.id}-EPUB` ? '...' : 'EPUB'}</span>
                                </button>
                              )}

                              {hasPdf && (
                                <button
                                  type="button"
                                  disabled={downloadingBookId === `${book.id}-PDF`}
                                  onClick={() => handleDownload(book, 'PDF')}
                                  className="bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#3A352D] px-2.5 py-1 rounded-full text-[11px] font-semibold border border-[#DED7C7] flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                                  title="Télécharger le document .PDF"
                                >
                                  <FileText className="w-3 h-3 text-[#B8860B]" />
                                  <span>{downloadingBookId === `${book.id}-PDF` ? '...' : 'PDF'}</span>
                                </button>
                              )}

                              {hasCbz && (
                                <button
                                  type="button"
                                  disabled={downloadingBookId === `${book.id}-CBZ`}
                                  onClick={() => handleDownload(book, 'CBZ')}
                                  className="bg-amber-50 hover:bg-amber-100 text-[#7A5A09] px-2.5 py-1 rounded-full text-[11px] font-semibold border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                                  title="Télécharger l'archive .CBZ (Planches BD & Manga)"
                                >
                                  <Layers className="w-3 h-3 text-[#B8860B]" />
                                  <span>{downloadingBookId === `${book.id}-CBZ` ? '...' : 'CBZ'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
