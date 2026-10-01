import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle2, BookOpen, Send, Sparkles, PhoneCall } from 'lucide-react';
import { BookOrderRequest } from '../types';

interface CustomBookRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (request: BookOrderRequest) => void;
}

export const CustomBookRequestModal: React.FC<CustomBookRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmitRequest,
}) => {
  const [bookTitle, setBookTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [notes, setNotes] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+225'); // default CI/West Africa
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) {
      setError('Veuillez préciser le titre du livre souhaité.');
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.trim().length < 6) {
      setError('Veuillez renseigner un numéro WhatsApp valide pour recevoir la notification.');
      return;
    }
    setError('');

    const fullWhatsapp = `${countryCode} ${whatsappNumber.trim()}`;
    const newRequest: BookOrderRequest = {
      id: 'req_' + Math.random().toString(36).substring(2, 9),
      bookTitle: bookTitle.trim(),
      authorName: authorName.trim() || undefined,
      notes: notes.trim() || undefined,
      whatsappNumber: fullWhatsapp,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    onSubmitRequest(newRequest);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setBookTitle('');
    setAuthorName('');
    setNotes('');
    setWhatsappNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FDFBF7] rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#EAE3D4] relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EDE6D7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Commander un livre introuvable
              </h2>
              <p className="text-[11px] sm:text-xs text-[#7A7468]">
                Notification WhatsApp directe dès l’ajout au catalogue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF5EB] hover:bg-[#EFE7D8] flex items-center justify-center text-[#736C5E] hover:text-[#1A1A1A] cursor-pointer shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {submitted ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                  Demande bien enregistrée !
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5449] max-w-sm mx-auto leading-relaxed">
                  Notre équipe de libraires recherche <strong className="text-[#1A1A1A]">« {bookTitle} »</strong>. Vous recevrez un message WhatsApp dès que le format EPUB sera prêt au catalogue.
                </p>
              </div>

              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-mono inline-block">
                WhatsApp : {countryCode} {whatsappNumber}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#332F28] transition-all cursor-pointer shadow-md"
                >
                  Continuer sur le site
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="bg-[#FAF6EE] p-3 rounded-2xl border border-[#EDE4D2] flex items-start gap-2.5 text-xs text-[#6B5A2E]">
                <Sparkles className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <span>
                  Vous cherchez un roman, un livre de développement personnel ou un essai indisponible ? Indiquez-le ci-dessous.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A453E] mb-1">
                  Titre du livre <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atomic Habits, La Peste, L'Art de la Guerre..."
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B] focus:bg-white text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A453E] mb-1">
                  Auteur (si connu)
                </label>
                <input
                  type="text"
                  placeholder="Ex: James Clear, Albert Camus..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B] focus:bg-white text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A453E] mb-1">
                  Votre numéro WhatsApp pour être notifié <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-[#B8860B] font-semibold text-[#1A1A1A]"
                  >
                    <option value="+225">🇨🇮 +225 (CI)</option>
                    <option value="+221">🇸🇳 +221 (SN)</option>
                    <option value="+229">🇧🇯 +229 (BJ)</option>
                    <option value="+228">🇹🇬 +228 (TG)</option>
                    <option value="+226">🇧🇫 +226 (BF)</option>
                    <option value="+237">🇨🇲 +237 (CM)</option>
                    <option value="+243">🇨🇩 +243 (CD)</option>
                    <option value="+223">🇲🇱 +223 (ML)</option>
                    <option value="+33">🇫🇷 +33 (FR)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="07 00 00 00 00"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="flex-1 text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#B8860B] focus:bg-white text-[#1A1A1A]"
                  />
                </div>
                <p className="text-[10px] text-[#8C8477] mt-1 flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  <span>Un message unique WhatsApp vous sera envoyé dès la mise en ligne.</span>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A453E] mb-1">
                  Précisions / Édition particulière (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Format souhaité, édition française, traduction particulière..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F0] border border-[#D9D1C1] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#B8860B] focus:bg-white text-[#1A1A1A]"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-medium">{error}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1A1A1A] hover:bg-[#2C2924] text-white py-3 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-[#E6C665]" />
                  <span>Envoyer ma commande de livre</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
