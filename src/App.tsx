import React, { useState, useEffect, useMemo } from 'react';
import { Book, Bundle, CartItem, Order, BookCategory, AffiliateUser, BookOrderRequest } from './types';
import { INITIAL_BOOKS } from './data/mockBooks';
import { INITIAL_BUNDLES } from './data/mockBundles';
import { Currency, detectUserCurrency } from './lib/formatPrice';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BookCard } from './components/BookCard';
import { BundlesSection } from './components/BundlesSection';
import { AllBundlesView } from './components/AllBundlesView';
import { CustomBookRequestModal } from './components/CustomBookRequestModal';
import { CartDrawer } from './components/CartDrawer';
import { LibraryModal } from './components/LibraryModal';
import { EbookReaderModal } from './components/EbookReaderModal';
import { AffiliateModal } from './components/AffiliateModal';
import { AdminModal } from './components/AdminModal';
import { BookDetailModal } from './components/BookDetailModal';
import { ComicReaderModal } from './components/ComicReaderModal';
import { Footer } from './components/Footer';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ArrowUpDown, BookOpen, ShieldCheck, CheckCircle2, MessageSquare, Search } from 'lucide-react';
import { AdminRole } from './types';
import { validateAndSanitizeBook, validateAndSanitizeCustomRequest, validateAndSanitizeOrder } from './lib/databaseSecurity';

const CATEGORIES: ('TOUS' | BookCategory)[] = [
  'TOUS',
  'ROMAN',
  'SF',
  'THRILLER',
  'DÉVELOPPEMENT',
  'BUSINESS',
  'ESSAI',
  'HISTOIRE',
  'BD_MANGA',
];

export default function App() {
  // Currency automatically detected based on user location and time zone
  const [currency] = useState<Currency>(() => {
    return detectUserCurrency();
  });

  // Books state with localStorage persistence and automatic initial sync
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('bookiin_books');
      if (saved) {
        const parsed: Book[] = JSON.parse(saved);
        // If stored data contains the old mock fictional titles (e.g. 'L’Archipel des Silences'), upgrade to real books
        const hasOldFictionalBooks = parsed.some(
          (b) => b.id === 'book-1' && b.title.includes('Archipel')
        );
        if (hasOldFictionalBooks) {
          localStorage.setItem('bookiin_books', JSON.stringify(INITIAL_BOOKS));
          return INITIAL_BOOKS;
        }

        // Merge INITIAL_BOOKS with rich chapters
        const updated = INITIAL_BOOKS.map((ib) => {
          const stored = parsed.find((p) => p.id === ib.id);
          return stored ? { ...stored, chapters: ib.chapters || stored.chapters, formats: ib.formats } : ib;
        });
        const customBooks = parsed.filter((p) => !INITIAL_BOOKS.some((ib) => ib.id === p.id));
        const merged = [...updated, ...customBooks];
        localStorage.setItem('bookiin_books', JSON.stringify(merged));
        return merged;
      }
      return INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  // Bundles state
  const [bundles] = useState<Bundle[]>(INITIAL_BUNDLES);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bookiin_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bookiin_orders');
      if (saved) {
        const parsedOrders: Order[] = JSON.parse(saved);
        // Upgrade old demo order to real books if needed
        const demoOrder = parsedOrders.find(
          (o) => o.customerEmail.toLowerCase() === 'lecteur.passionne@bookiin.fr'
        );
        if (demoOrder && demoOrder.items.some((i) => i.title.includes('Archipel'))) {
          demoOrder.items = [
            {
              type: 'book',
              id: 'book-1',
              title: 'Le Petit Prince',
              authorOrSubtitle: 'Antoine de Saint-Exupéry',
              price: 6.90,
              coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
              bookIds: ['book-1'],
            },
            {
              type: 'book',
              id: 'book-2',
              title: 'Vingt Mille Lieues sous les mers',
              authorOrSubtitle: 'Jules Verne',
              price: 8.50,
              coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
              bookIds: ['book-2'],
            },
            {
              type: 'book',
              id: 'book-9',
              title: 'Alice au Pays des Merveilles (Édition Illustrée .CBZ)',
              authorOrSubtitle: 'Lewis Carroll & John Tenniel',
              price: 8.50,
              coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80',
              bookIds: ['book-9'],
            }
          ];
          localStorage.setItem('bookiin_orders', JSON.stringify(parsedOrders));
        }
        return parsedOrders;
      }
      return [
        {
          id: 'ord_DEMO101',
          customerEmail: 'lecteur.passionne@bookiin.fr',
          totalAmount: 23.90,
          items: [
            {
              type: 'book',
              id: 'book-1',
              title: 'Le Petit Prince',
              authorOrSubtitle: 'Antoine de Saint-Exupéry',
              price: 6.90,
              coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
              bookIds: ['book-1'],
            },
            {
              type: 'book',
              id: 'book-2',
              title: 'Vingt Mille Lieues sous les mers',
              authorOrSubtitle: 'Jules Verne',
              price: 8.50,
              coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
              bookIds: ['book-2'],
            },
            {
              type: 'book',
              id: 'book-9',
              title: 'Alice au Pays des Merveilles (Édition Illustrée .CBZ)',
              authorOrSubtitle: 'Lewis Carroll & John Tenniel',
              price: 8.50,
              coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80',
              bookIds: ['book-9'],
            }
          ],
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
          status: 'paid',
          stripePaymentId: 'ch_stripe_demo_initial',
          affiliateRef: 'alex24',
          commissionAmount: 3.58,
        }
      ];
    } catch {
      return [];
    }
  });

  // Custom Book Orders (WhatsApp notifications)
  const [customRequests, setCustomRequests] = useState<BookOrderRequest[]>(() => {
    try {
      const saved = localStorage.getItem('bookiin_custom_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current logged in user (via Magic link)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('bookiin_user_email') || null;
  });

  // Affiliate Ref & Partner State
  const [affiliateRef, setAffiliateRef] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) return ref;
    }
    return localStorage.getItem('bookiin_affiliate_ref') || '';
  });

  const [affiliateUser, setAffiliateUser] = useState<AffiliateUser>(() => {
    try {
      const saved = localStorage.getItem('bookiin_affiliate_user');
      return saved ? JSON.parse(saved) : {
        refCode: 'alex24',
        email: 'partenaire@bookiin.fr',
        commissionRate: 0.15,
        totalEarnings: 34.50,
        pendingPayout: 34.50,
        clicksCount: 84,
        salesCount: 3,
      };
    } catch {
      return {
        refCode: 'alex24',
        email: 'partenaire@bookiin.fr',
        commissionRate: 0.15,
        totalEarnings: 34.50,
        pendingPayout: 34.50,
        clicksCount: 84,
        salesCount: 3,
      };
    }
  });

  // UI Filters & Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'all-bundles'>('home');
  const [selectedCategory, setSelectedCategory] = useState<'TOUS' | BookCategory>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'newest'>('popular');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole>('super_admin');
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [readerBook, setReaderBook] = useState<Book | null>(null);
  const [isComicReaderOpen, setIsComicReaderOpen] = useState(false);
  const [comicReaderBook, setComicReaderBook] = useState<Book | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const handleOpenComicReader = (book?: Book) => {
    setComicReaderBook(book || null);
    setIsComicReaderOpen(true);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bookiin_currency', currency);
    } catch (err) {
      console.error(err);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_books', JSON.stringify(books));
    } catch (err) {
      console.error(err);
    }
  }, [books]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error(err);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_orders', JSON.stringify(orders));
    } catch (err) {
      console.error(err);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_custom_requests', JSON.stringify(customRequests));
    } catch (err) {
      console.error(err);
    }
  }, [customRequests]);

  useEffect(() => {
    try {
      if (currentUserEmail) {
        localStorage.setItem('bookiin_user_email', currentUserEmail);
      } else {
        localStorage.removeItem('bookiin_user_email');
      }
    } catch (err) {
      console.error(err);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_affiliate_ref', affiliateRef);
    } catch (err) {
      console.error(err);
    }
  }, [affiliateRef]);

  useEffect(() => {
    try {
      localStorage.setItem('bookiin_affiliate_user', JSON.stringify(affiliateUser));
    } catch (err) {
      console.error(err);
    }
  }, [affiliateUser]);

  // Handle URL hash changes for PWA shortcuts (e.g., #bibliotheque, #catalogue-section)
  useEffect(() => {
    const handleHashNav = () => {
      const hash = window.location.hash;
      if (hash === '#bibliotheque') {
        setIsLibraryOpen(true);
      } else if (hash === '#catalogue-section') {
        scrollToCatalogue();
      }
    };

    handleHashNav();
    window.addEventListener('hashchange', handleHashNav);
    return () => window.removeEventListener('hashchange', handleHashNav);
  }, []);

  // Cart actions
  const handleAddToCart = (book: Book) => {
    setCartItems((prev) => {
      const exists = prev.some((i) => i.type === 'book' && i.id === book.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          type: 'book',
          id: book.id,
          title: book.title,
          authorOrSubtitle: book.author,
          price: book.price,
          coverUrl: book.coverUrl,
          bookIds: [book.id],
        },
      ];
    });
    setToastNotification(`« ${book.title} » a été ajouté à votre panier`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleAddBundleToCart = (bundle: Bundle) => {
    setCartItems((prev) => {
      const exists = prev.some((i) => i.type === 'bundle' && i.id === bundle.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          type: 'bundle',
          id: bundle.id,
          title: bundle.title,
          authorOrSubtitle: bundle.subtitle,
          price: bundle.price,
          coverUrl: bundle.coverImage,
          bookIds: [...bundle.bookIds],
        },
      ];
    });
    setToastNotification(`Le « ${bundle.title} » a été ajouté au panier`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleRemoveCartItem = (id: string, type: 'book' | 'bundle') => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order placement & Magic Link auto-connection with Anti-Fraud & Database Validation
  const handleOrderSuccess = (newOrder: Order) => {
    const check = validateAndSanitizeOrder(newOrder, affiliateUser);
    if (!check.valid || !check.order) {
      setToastNotification(check.error || 'Erreur d’enregistrement de la commande');
      setTimeout(() => setToastNotification(null), 3500);
      return;
    }

    const sanitizedOrder = check.order;
    setOrders((prev) => [sanitizedOrder, ...prev]);
    setCurrentUserEmail(sanitizedOrder.customerEmail);

    if (sanitizedOrder.affiliateRef) {
      setAffiliateUser((prev) => {
        const comm = sanitizedOrder.commissionAmount || Number((sanitizedOrder.totalAmount * prev.commissionRate).toFixed(2));
        return {
          ...prev,
          totalEarnings: Number((prev.totalEarnings + comm).toFixed(2)),
          pendingPayout: Number((prev.pendingPayout + comm).toFixed(2)),
          salesCount: prev.salesCount + 1,
        };
      });
    }
  };

  // Custom book request submission with input sanitization
  const handleSubmitCustomRequest = (request: BookOrderRequest) => {
    const check = validateAndSanitizeCustomRequest(request);
    if (!check.valid || !check.request) {
      setToastNotification(check.error || 'Erreur dans le formulaire de demande');
      setTimeout(() => setToastNotification(null), 3500);
      return;
    }
    setCustomRequests((prev) => [check.request!, ...prev]);
  };

  // Admin Book Management Handlers with Schema & XSS Sanitization
  const handleAddBook = (newBook: Book) => {
    const check = validateAndSanitizeBook(newBook);
    if (!check.valid || !check.book) {
      setToastNotification(check.error || 'Données du livre invalides');
      setTimeout(() => setToastNotification(null), 3500);
      return;
    }
    setBooks((prev) => [check.book!, ...prev]);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleUpdateCustomRequestStatus = (id: string, status: 'pending' | 'notified') => {
    setCustomRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleApproveAffiliatePayout = () => {
    setAffiliateUser((prev) => ({
      ...prev,
      pendingPayout: 0,
    }));
  };

  const handleUpdateAffiliateCommission = (rate: number) => {
    setAffiliateUser((prev) => ({
      ...prev,
      commissionRate: rate,
    }));
  };

  const handleAffiliateRequestPayout = (payoutInfo?: { method: string; details: string; name: string }) => {
    setAffiliateUser((prev) => ({
      ...prev,
      pendingPayout: 0,
    }));
    setToastNotification('Votre demande de versement a été transmise à notre équipe financière.');
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Magic Link Sign in
  const handleLoginWithMagicLink = (email: string) => {
    setCurrentUserEmail(email);
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
  };

  // Filtered & sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesCategory =
          selectedCategory === 'TOUS' || book.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.publishedYear || 0) - (a.publishedYear || 0);
        return b.rating - a.rating;
      });
  }, [books, selectedCategory, searchQuery, sortBy]);

  // Search state and bundle prioritization
  const isSearching = searchQuery.trim().length > 0;

  // Bundles containing any of the searched books OR matching search query
  const bundlesContainingSearchedBooks = useMemo(() => {
    if (!isSearching) return bundles;
    const q = searchQuery.toLowerCase().trim();
    const foundBookIds = new Set(filteredBooks.map((b) => b.id));

    const containing = bundles.filter((bundle) => {
      const containsSearchedBook = bundle.bookIds.some((id) => foundBookIds.has(id));
      const titleMatch = bundle.title.toLowerCase().includes(q);
      const descMatch = bundle.description.toLowerCase().includes(q);
      return containsSearchedBook || titleMatch || descMatch;
    });

    return containing;
  }, [bundles, filteredBooks, isSearching, searchQuery]);

  const hasPacksWithSearchedBook = isSearching && bundlesContainingSearchedBooks.length > 0;

  // Auto-scroll to top when user starts typing a search from anywhere down the page
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      if (currentView !== 'home') {
        setCurrentView('home');
      }
      if (typeof window !== 'undefined' && window.scrollY > 40) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [searchQuery, currentView]);

  const scrollToCatalogue = () => {
    if (currentView !== 'home') setCurrentView('home');
    setTimeout(() => {
      const el = document.getElementById('catalogue-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToBundles = () => {
    if (currentView !== 'home') setCurrentView('home');
    setTimeout(() => {
      const el = document.getElementById('bundles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const renderCatalogueSection = (isSearchPriority: boolean) => (
    <section id="catalogue-section" className={`${isSearchPriority ? 'py-8 sm:py-12' : 'py-10 sm:py-16 md:py-20'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
        <div className="space-y-1">
          <div className="text-xs uppercase font-bold tracking-widest text-[#8C6608] flex items-center gap-1.5">
            {isSearchPriority ? (
              <>
                <Search className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Résultats Prioritaires • Livres</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Nouveautés</span>
              </>
            )}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A]">
            {isSearchPriority ? (
              <>
                Livres pour <span className="italic font-serif text-[#B8860B]">« {searchQuery} »</span>
              </>
            ) : (
              <>
                Notre catalogue <span className="italic font-serif text-[#B8860B]">sélectionné</span>
              </>
            )}
          </h2>
          {isSearchPriority && (
            <p className="text-xs sm:text-sm text-[#666053]">
              {filteredBooks.length > 0
                ? `${filteredBooks.length} ouvrage(s) trouvé(s) — les packs contenant ce livre s'affichent juste en dessous`
                : 'Aucun livre ne correspond exactement à votre recherche.'}
            </p>
          )}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 bg-[#F2EDE2] px-3 py-1.5 rounded-full border border-[#E5DEC4] text-xs text-[#5E584D]">
            <ArrowUpDown className="w-3 h-3 text-[#8A8477]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-xs font-semibold text-[#1A1A1A] focus:outline-none cursor-pointer"
            >
              <option value="popular">Populaires</option>
              <option value="newest">Nouveautés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>

          <span className="text-xs text-[#8A8477] font-medium hidden sm:inline">
            {filteredBooks.length} livres
          </span>
        </div>
      </div>

      {/* Interactive Category Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-6 sm:mb-8 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#5E584D] border border-[#ECE5D8] hover:border-[#D1C6B4] hover:text-[#1A1A1A]'
            }`}
          >
            {cat === 'TOUS' ? 'Tous les genres' : cat}
          </button>
        ))}
      </div>

      {/* Catalogue Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#ECE5D8] p-6 sm:p-8 space-y-3 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
            Livre introuvable dans notre catalogue ?
          </p>
          <p className="text-xs text-[#7A7468] leading-relaxed">
            Vous cherchez un ouvrage introuvable ? Demandez-le-nous gratuitement et notre équipe le rendra disponible pour vous sous 24h !
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
            >
              <MessageSquare className="w-4 h-4 text-emerald-200" />
              <span>Demander ce livre introuvable</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('TOUS');
                setSearchQuery('');
              }}
              className="px-4 py-2.5 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#332F28] cursor-pointer"
            >
              Voir tout le catalogue
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredBooks.map((book) => {
            const isInCart = cartItems.some((i) => i.type === 'book' && i.id === book.id);
            return (
              <BookCard
                key={book.id}
                book={book}
                isInCart={isInCart}
                currency={currency}
                onAddToCart={handleAddToCart}
                onQuickView={(b) => setDetailBook(b)}
              />
            );
          })}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] flex flex-col font-sans">
      
      {/* PWA Install Banner & Offline Alert */}
      <PWAInstallBanner />

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-[#E6C665] shrink-0" />
          <span className="font-medium">{toastNotification}</span>
        </div>
      )}

      {/* Main Header with WhatsApp Request and Visible Affiliate CTA */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenComicReader={() => handleOpenComicReader()}
        onOpenAffiliate={() => setIsAffiliateOpen(true)}
        onScrollToCatalogue={scrollToCatalogue}
        onScrollToBundles={scrollToBundles}
        onViewAllBundles={() => {
          setCurrentView('all-bundles');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRequestCustomBook={() => setIsCustomRequestOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedInUser={!!currentUserEmail}
        userEmail={currentUserEmail}
      />

      <main className="flex-1">
        {currentView === 'all-bundles' ? (
          /* Dedicated page for all packs and bundles */
          <AllBundlesView
            bundles={bundles}
            books={books}
            cartItems={cartItems}
            currency={currency}
            onAddBundleToCart={handleAddBundleToCart}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCustomRequest={() => setIsCustomRequestOpen(true)}
          />
        ) : isSearching ? (
          /* Search Results View: 1. Books Prioritized -> 2. Bundles containing this book below */
          <>
            {/* 1. SECTION LIVRES PRIORISÉE AU SOMMET */}
            {renderCatalogueSection(true)}

            {/* 2. SECTION BUNDLE AVEC LES PACKS CONTENANT CE LIVRE JUSTE EN DESSOUS */}
            <BundlesSection
              bundles={bundlesContainingSearchedBooks}
              books={books}
              cartItems={cartItems}
              currency={currency}
              onAddBundleToCart={handleAddBundleToCart}
              onExploreCustomBundle={scrollToCatalogue}
              onViewAllBundles={() => {
                setCurrentView('all-bundles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Packs & Bundles"
              highlightedTitle={hasPacksWithSearchedBook ? "contenant ce livre" : "recommandés"}
              subtitle={
                hasPacksWithSearchedBook
                  ? `Ces sélections thématiques incluent le livre recherché avec une remise avantageuse allant jusqu'à -25%.`
                  : "Découvrez toutes nos collections thématiques pour compléter vos lectures."
              }
              badgeText={hasPacksWithSearchedBook ? "Packs contenant ce livre" : "Offres Spéciales & Collections"}
            />
          </>
        ) : (
          /* Standard Homepage View: Hero -> Bundles & Packs -> Nouveautés */
          <>
            {/* Hero Section (Bouton affilié retiré sous le bundle) */}
            <Hero
              currency={currency}
              onExploreCatalogue={scrollToCatalogue}
              onExploreBundles={scrollToBundles}
            />

            {/* Section Bundles & Packs avec Défilement Doux (Placée avant Nouveautés) */}
            <BundlesSection
              bundles={bundles}
              books={books}
              cartItems={cartItems}
              currency={currency}
              onAddBundleToCart={handleAddBundleToCart}
              onExploreCustomBundle={scrollToCatalogue}
              onViewAllBundles={() => {
                setCurrentView('all-bundles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Section Nouveautés & Catalogue */}
            {renderCatalogueSection(false)}

            {/* Reassurance Callout (sans bouton demander) */}
            <section className="py-10 sm:py-14 bg-white border-b border-[#EFEAE1]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#FAF7F0] rounded-3xl p-5 sm:p-8 border border-[#E8E1D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="space-y-1.5 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#8C6608] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                      <span>Lecture Libre & Durable</span>
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                      Vos ebooks vous appartiennent réellement
                    </h3>
                    <p className="text-xs sm:text-sm text-[#666053] leading-relaxed">
                      Fichiers universels sans DRM intrusif, téléchargeables à tout moment et compatibles avec l'ensemble de vos liseuses et applications favorites.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={scrollToCatalogue}
                      className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#332F28] transition-all cursor-pointer shadow-md text-center"
                    >
                      Commencer mes lectures
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer avec bouton Demander et bouton Affilié juste en dessous tout en bas de page */}
      <Footer
        onScrollToCatalogue={scrollToCatalogue}
        onScrollToBundles={scrollToBundles}
        onViewAllBundles={() => {
          setCurrentView('all-bundles');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRequestCustomBook={() => setIsCustomRequestOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenAffiliate={() => setIsAffiliateOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        books={books}
        currency={currency}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
        affiliateRef={affiliateRef}
        onUpdateAffiliateRef={setAffiliateRef}
      />

      <CustomBookRequestModal
        isOpen={isCustomRequestOpen}
        onClose={() => setIsCustomRequestOpen(false)}
        onSubmitRequest={handleSubmitCustomRequest}
      />

      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        books={books}
        orders={orders}
        currentUserEmail={currentUserEmail}
        onLoginWithMagicLink={handleLoginWithMagicLink}
        onLogout={handleLogout}
        onOpenReader={(b) => {
          setIsLibraryOpen(false);
          setReaderBook(b);
        }}
        onOpenComicReader={(b) => {
          setIsLibraryOpen(false);
          handleOpenComicReader(b);
        }}
      />

      <AffiliateModal
        isOpen={isAffiliateOpen}
        onClose={() => setIsAffiliateOpen(false)}
        affiliateUser={affiliateUser}
        currency={currency}
        orders={orders}
        onUpdateRefCode={(code) => {
          setAffiliateUser((prev) => ({ ...prev, refCode: code }));
          setAffiliateRef(code);
        }}
        onRequestPayout={handleAffiliateRequestPayout}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminRole={adminRole}
        onChangeRole={setAdminRole}
        books={books}
        bundles={bundles}
        orders={orders}
        customRequests={customRequests}
        affiliateUser={affiliateUser}
        onAddBook={handleAddBook}
        onDeleteBook={handleDeleteBook}
        onUpdateCustomRequestStatus={handleUpdateCustomRequestStatus}
        onApproveAffiliatePayout={handleApproveAffiliatePayout}
        onUpdateAffiliateCommission={handleUpdateAffiliateCommission}
      />

      <BookDetailModal
        book={detailBook}
        isInCart={detailBook ? cartItems.some((i) => i.type === 'book' && i.id === detailBook.id) : false}
        currency={currency}
        onClose={() => setDetailBook(null)}
        onAddToCart={handleAddToCart}
        onOpenReader={(b) => {
          setDetailBook(null);
          setReaderBook(b);
        }}
        onOpenComicReader={(b) => {
          setDetailBook(null);
          handleOpenComicReader(b);
        }}
      />

      <EbookReaderModal
        book={readerBook}
        onClose={() => setReaderBook(null)}
      />

      <ComicReaderModal
        isOpen={isComicReaderOpen}
        onClose={() => setIsComicReaderOpen(false)}
        initialBook={comicReaderBook}
      />

    </div>
  );
}
