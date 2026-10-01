import React, { useState } from 'react';
import { X, Copy, Check, Code, Database, Cloud, CreditCard, Mail, FolderTree, Terminal } from 'lucide-react';
import {
  NEXTJS_FOLDER_STRUCTURE,
  SUPABASE_SQL_SCHEMA,
  CLOUDFLARE_R2_EDGE_FUNCTION,
  STRIPE_GUEST_CHECKOUT_FLOW,
  RESEND_EMAIL_SNIPPET,
} from '../lib/serverlessDocs';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'folders' | 'sql' | 'r2' | 'stripe' | 'resend'>('folders');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'folders':
        return NEXTJS_FOLDER_STRUCTURE;
      case 'sql':
        return SUPABASE_SQL_SCHEMA;
      case 'r2':
        return CLOUDFLARE_R2_EDGE_FUNCTION;
      case 'stripe':
        return STRIPE_GUEST_CHECKOUT_FLOW;
      case 'resend':
        return RESEND_EMAIL_SNIPPET;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] text-stone-200 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-stone-800 relative max-h-[92vh] flex flex-col font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-[#E6C665]">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-white">
                  Livrables & Architecture Serverless
                </h2>
                <span className="text-[10px] bg-stone-800 text-[#E6C665] px-2 py-0.5 rounded font-mono">
                  Coût 0€/mois
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Next.js (App Router), Supabase SQL & RLS, Cloudflare R2 Edge Function & Stripe Checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#E6C665]" />
                  <span>Copier le code</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-stone-800 pt-3 pb-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('folders')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'folders' ? 'bg-[#B8860B] text-stone-950 font-bold' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Arborescence Next.js</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'sql' ? 'bg-[#B8860B] text-stone-950 font-bold' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Schéma Supabase SQL & RLS</span>
          </button>

          <button
            onClick={() => setActiveTab('r2')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'r2' ? 'bg-[#B8860B] text-stone-950 font-bold' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloudflare R2 Signed URLs</span>
          </button>

          <button
            onClick={() => setActiveTab('stripe')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'stripe' ? 'bg-[#B8860B] text-stone-950 font-bold' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Stripe Guest Checkout</span>
          </button>

          <button
            onClick={() => setActiveTab('resend')}
            className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'resend' ? 'bg-[#B8860B] text-stone-950 font-bold' : 'text-stone-400 hover:bg-stone-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Resend Transactionnel</span>
          </button>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-y-auto pt-4 pb-2">
          <pre className="font-mono text-xs text-stone-300 bg-stone-950 p-5 rounded-2xl border border-stone-800/80 overflow-x-auto leading-relaxed selection:bg-[#B8860B]/40 selection:text-white">
            <code>{getCurrentContent()}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <span>
            {activeTab === 'folders' && '✓ Arborescence complète standard Next.js 15 App Router'}
            {activeTab === 'sql' && '✓ PostgreSQL 15, Row-Level Security, fonctions is_super_admin() & is_editor()'}
            {activeTab === 'r2' && '✓ Edge Function sans serveur, expiration 900s, 0 frais de bande passante'}
            {activeTab === 'stripe' && '✓ Guest Checkout complet sans création préalable de compte'}
            {activeTab === 'resend' && '✓ Envoi sans mot de passe vers Supabase Auth Magic Link'}
          </span>
          <span className="font-mono text-[10px] text-stone-400">
            Bookiin V1 Architecture Spec
          </span>
        </div>

      </div>
    </div>
  );
};
