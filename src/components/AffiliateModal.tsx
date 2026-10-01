import React, { useState } from 'react';
import { 
  X, Sparkles, Copy, Check, DollarSign, Award, ArrowUpRight, 
  ShieldCheck, Smartphone, Landmark, HelpCircle, CheckCircle2,
  Clock, AlertCircle, TrendingUp, Share2
} from 'lucide-react';
import { AffiliateUser, Order } from '../types';
import { Currency, formatPrice } from '../lib/formatPrice';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  affiliateUser: AffiliateUser;
  currency?: Currency;
  orders?: Order[];
  onUpdateRefCode: (newCode: string) => void;
  onRequestPayout: (payoutDetails?: { method: string; details: string; name: string }) => void;
}

export const AffiliateModal: React.FC<AffiliateModalProps> = ({
  isOpen,
  onClose,
  affiliateUser,
  currency = 'EUR',
  orders = [],
  onUpdateRefCode,
  onRequestPayout,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'payout' | 'rules'>('dashboard');
  const [copied, setCopied] = useState(false);
  const [customRefInput, setCustomRefInput] = useState(affiliateUser.refCode);
  const [isEditingCode, setIsEditingCode] = useState(false);

  // Payout Form State
  const [payoutMethod, setPayoutMethod] = useState<'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'BANK_TRANSFER' | 'PAYPAL'>('WAVE');
  const [payoutRecipientName, setPayoutRecipientName] = useState('');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://bookiin.fr';
  const referralLink = `${currentDomain}/?ref=${affiliateUser.refCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customRefInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (clean.length >= 3) {
      onUpdateRefCode(clean);
      setIsEditingCode(false);
    }
  };

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (affiliateUser.pendingPayout < 15) {
      setPayoutError(`Le seuil minimum de retrait est de ${formatPrice(15, currency)}.`);
      return;
    }
    if (!payoutRecipientName.trim() || !payoutDetails.trim()) {
      setPayoutError('Veuillez renseigner le nom du bénéficiaire et les coordonnées de paiement.');
      return;
    }

    onRequestPayout({
      method: payoutMethod,
      details: payoutDetails.trim(),
      name: payoutRecipientName.trim(),
    });

    setPayoutSuccess(true);
    setPayoutError(null);
    setTimeout(() => {
      setPayoutSuccess(false);
      setActiveTab('dashboard');
    }, 3500);
  };

  // Orders attributed to this affiliate
  const affiliateOrders = orders.filter(
    (o) => o.affiliateRef && o.affiliateRef.toLowerCase() === affiliateUser.refCode.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-[#FDFBF7] rounded-3xl max-w-xl w-full p-4 sm:p-7 shadow-2xl border border-[#EAE3D4] relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE6D7]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#8C6608] font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Programme Partenaires Bookiin</span>
              <span className="bg-[#B8860B] text-white text-[9px] font-black uppercase px-2 py-0.2 rounded-full">
                15% CASH
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              <span className="italic font-serif text-[#B8860B]">Recommandez</span>, et touchez 15%
            </h2>
            <p className="text-xs text-[#7A7468] mt-0.5">
              Commission instantanée sur chaque livre ou pack vendu grâce à votre lien.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-[#EFE7D8] flex items-center justify-center text-[#736C5E] hover:text-[#1A1A1A] cursor-pointer shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-[#ECE5D8] pt-2 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-[#1A1A1A] text-white' : 'text-[#665F52] hover:bg-[#EFE9DD]'
            }`}
          >
            Tableau de Bord
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'history' ? 'bg-[#1A1A1A] text-white' : 'text-[#665F52] hover:bg-[#EFE9DD]'
            }`}
          >
            <span>Ventes ({affiliateOrders.length || affiliateUser.salesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('payout')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'payout' ? 'bg-[#1A1A1A] text-white' : 'text-[#665F52] hover:bg-[#EFE9DD]'
            }`}
          >
            <span>Demander un Virement</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'rules' ? 'bg-[#1A1A1A] text-white' : 'text-[#665F52] hover:bg-[#EFE9DD]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Sécurité & Règles</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Key Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-[#ECE5D8] shadow-xs">
                  <div className="flex items-center justify-between text-[#8C6608] mb-1">
                    <span className="text-[11px] font-semibold uppercase">Total Gagné</span>
                    <DollarSign className="w-4 h-4 text-[#B8860B]" />
                  </div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                    {formatPrice(affiliateUser.totalEarnings, currency)}
                  </p>
                  <p className="text-[10px] text-[#8C8477]">15% sur chaque vente convertie</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#ECE5D8] shadow-xs">
                  <div className="flex items-center justify-between text-[#8C6608] mb-1">
                    <span className="text-[11px] font-semibold uppercase">Solde Disponible</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-emerald-700">
                    {formatPrice(affiliateUser.pendingPayout, currency)}
                  </p>
                  <p className="text-[10px] text-[#8C8477]">Prêt à être viré (Wave/MoMo/IBAN)</p>
                </div>
              </div>

              {/* Referral Link Box */}
              <div className="bg-white p-4 rounded-2xl border border-[#ECE5D8] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A453E] flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Votre lien de recommandation</span>
                  </label>
                  <button
                    onClick={() => setIsEditingCode(!isEditingCode)}
                    className="text-[11px] text-[#8C6608] hover:underline font-semibold cursor-pointer"
                  >
                    {isEditingCode ? 'Annuler' : 'Personnaliser mon tag'}
                  </button>
                </div>

                {isEditingCode ? (
                  <form onSubmit={handleSaveCustomCode} className="flex gap-2">
                    <input
                      type="text"
                      value={customRefInput}
                      onChange={(e) => setCustomRefInput(e.target.value)}
                      placeholder="monpseudo"
                      className="flex-1 text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B8860B]"
                    />
                    <button
                      type="submit"
                      className="bg-[#1A1A1A] text-white text-xs px-4 py-2 rounded-xl font-semibold hover:bg-[#332F28] cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E1D5]">
                    <span className="font-mono text-xs text-[#2A2722] truncate flex-1 select-all font-medium">
                      {referralLink}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="bg-[#1A1A1A] hover:bg-[#332F28] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#E6C665]" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-stone-500">
                  Partagez ce lien sur WhatsApp, Telegram, TikTok, Instagram ou votre blog. Chaque visiteur qui achète vous rapporte 15% de commission.
                </p>
              </div>

              {/* Quick Payout Callout */}
              <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8E1D5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A7468] block">Solde à transférer</span>
                  <span className="font-serif text-lg font-bold text-[#1A1A1A]">
                    {formatPrice(affiliateUser.pendingPayout, currency)}
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('payout')}
                  disabled={affiliateUser.pendingPayout <= 0}
                  className="bg-[#1A1A1A] hover:bg-[#332F28] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
                >
                  Demander le virement →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">
                Historique des Commandes Parrainées
              </h4>

              {affiliateOrders.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-[#ECE5D8] text-center space-y-2">
                  <Clock className="w-8 h-8 text-[#B8860B] mx-auto opacity-70" />
                  <p className="font-serif text-base font-bold text-[#1A1A1A]">
                    {affiliateUser.salesCount} vente(s) enregistrée(s)
                  </p>
                  <p className="text-xs text-[#7A7468] max-w-sm mx-auto">
                    Partagez votre lien de parrainage pour générer de nouvelles ventes et toucher 15% de commission sur chacune.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {affiliateOrders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white p-3 rounded-xl border border-[#ECE5D8] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#1A1A1A] block">{o.id}</span>
                        <span className="text-stone-400 text-[11px]">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 block font-serif text-sm">
                          +{formatPrice(o.commissionAmount || o.totalAmount * 0.15, currency)}
                        </span>
                        <span className="text-[10px] text-stone-400">Commande {formatPrice(o.totalAmount, currency)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYOUT REQUEST */}
          {activeTab === 'payout' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#ECE5D8]">
                <span className="text-[11px] text-[#7A7468] uppercase font-bold block">Solde Actuel</span>
                <span className="font-serif text-2xl font-bold text-emerald-700">
                  {formatPrice(affiliateUser.pendingPayout, currency)}
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  Seuil minimum : {formatPrice(15, currency)} (ou 10 000 FCFA).
                </p>
              </div>

              {payoutSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Demande de virement envoyée avec succès ! Traitement sous 24h.</span>
                </div>
              )}

              {payoutError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{payoutError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitPayout} className="bg-white p-5 rounded-2xl border border-[#ECE5D8] space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#554E42] mb-1">
                    Méthode de Paiement
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'WAVE', label: 'Wave Mobile Money', icon: Smartphone },
                      { id: 'ORANGE_MONEY', label: 'Orange Money', icon: Smartphone },
                      { id: 'MTN_MOMO', label: 'MTN MoMo', icon: Smartphone },
                      { id: 'BANK_TRANSFER', label: 'Virement (IBAN)', icon: Landmark },
                      { id: 'PAYPAL', label: 'PayPal', icon: DollarSign },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPayoutMethod(m.id as any)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                            payoutMethod === m.id
                              ? 'border-[#B8860B] bg-[#FAF3E0] font-bold text-[#8C6608]'
                              : 'border-[#EDE6D7] hover:border-[#D1C6B4] text-stone-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[11px] truncate">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#554E42] mb-1">
                    Nom & Prénom du Titulaire
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean Kouassi"
                    value={payoutRecipientName}
                    onChange={(e) => setPayoutRecipientName(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#554E42] mb-1">
                    {payoutMethod === 'BANK_TRANSFER'
                      ? 'IBAN ou Relevé Bancaire'
                      : payoutMethod === 'PAYPAL'
                      ? 'Email du compte PayPal'
                      : 'Numéro Mobile Money (+Indicatif)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      payoutMethod === 'BANK_TRANSFER'
                        ? 'FR76 ...'
                        : payoutMethod === 'PAYPAL'
                        ? 'email@paypal.com'
                        : '+225 07 ... ou +221 77 ...'
                    }
                    value={payoutDetails}
                    onChange={(e) => setPayoutDetails(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={affiliateUser.pendingPayout <= 0}
                  className="w-full bg-[#1A1A1A] hover:bg-[#332F28] text-white py-3 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4 text-[#E6C665]" />
                  <span>Envoyer la demande de versement</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: RULES & SECURITY */}
          {activeTab === 'rules' && (
            <div className="bg-white p-5 rounded-2xl border border-[#ECE5D8] space-y-3.5 text-xs text-stone-700">
              <h4 className="font-serif font-bold text-base text-[#1A1A1A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                Conditions & Règles de Sécurité du Programme
              </h4>

              <div className="space-y-2.5">
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EDE6D7]">
                  <h5 className="font-bold text-[#8C6608] mb-0.5">1. Commission transparente : 15% par vente</h5>
                  <p className="text-[11px] text-stone-600">
                    Vous touchez 15% net sur l'ensemble des livres numériques et des packs thématiques achetés par les visiteurs envoyés par votre lien.
                  </p>
                </div>

                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EDE6D7]">
                  <h5 className="font-bold text-[#8C6608] mb-0.5">2. Durée du Cookie de suivi : 30 jours</h5>
                  <p className="text-[11px] text-stone-600">
                    Même si le visiteur n'achète pas le jour même, vous touchez la commission s'il finalise sa commande dans les 30 jours suivants.
                  </p>
                </div>

                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EDE6D7]">
                  <h5 className="font-bold text-[#8C6608] mb-0.5">3. Politique Anti-Fraude & Règle Anti-Auto-Parrainage</h5>
                  <p className="text-[11px] text-stone-600">
                    Il est strictement interdit d'utiliser son propre lien d'affiliation pour acheter ses propres livres. Les commandes utilisant la même adresse email ou moyen de paiement sont invalidées.
                  </p>
                </div>

                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EDE6D7]">
                  <h5 className="font-bold text-[#8C6608] mb-0.5">4. Délais de versement rapides</h5>
                  <p className="text-[11px] text-stone-600">
                    Les virements Wave, Orange Money, MTN MoMo, PayPal et bancaires sont vérifiés et expédiés sous 24 à 48 heures ouvrées par l'équipe Bookiin.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
