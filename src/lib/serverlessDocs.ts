export const NEXTJS_FOLDER_STRUCTURE = `bookiin-app/
├── app/
│   ├── layout.tsx                    # Root layout avec polices Playfair Display & Plus Jakarta Sans
│   ├── page.tsx                      # Page d'accueil (Hero, Nouveautés, Bundles, Best-sellers)
│   ├── catalogue/
│   │   └── page.tsx                  # Catalogue complet avec filtres de catégories et recherche
│   ├── livre/
│   │   └── [slug]/page.tsx           # Page détaillée du livre (SSG avec generateStaticParams)
│   ├── bundles/
│   │   └── page.tsx                  # Section bundles pré-faits & custom bundle builder
│   ├── bibliotheque/
│   │   └── page.tsx                  # Espace Ma Bibliothèque (Magic Link Auth & Liseuse)
│   ├── affiliation/
│   │   └── page.tsx                  # Programme Partagez & Gagnez (Stats, liens, commissions)
│   ├── admin/
│   │   ├── page.tsx                  # Dashboard Admin (Super Admin vs Éditeur selon Supabase RLS)
│   │   └── livres/
│   │       └── nouveau/page.tsx      # Formulaire d'ajout d'ebook (upload couverture & R2 key)
│   └── api/
│       ├── checkout/
│       │   └── route.ts              # Stripe Checkout Session (Guest Checkout sans compte obligatoire)
│       ├── webhooks/
│       │   └── stripe/route.ts       # Webhook Stripe -> Enregistre commande, livrets, commission affilié
│       ├── auth/
│       │   └── magic-link/route.ts   # Supabase Auth Magic Link trigger & verification
│       ├── download/
│       │   └── [bookId]/route.ts     # Edge Function Cloudflare R2 Signed URL (validité 15 min)
│       └── affiliate/
│           └── track/route.ts        # Enregistrement du cookie de parrainage (?ref=...)
├── components/
│   ├── ui/                           # Boutons pill, dialogs, sliders, inputs (Shadcn/Tailwind)
│   ├── Header.tsx                    # Barre de navigation avec logo Bookiin., recherche & panier
│   ├── Footer.tsx                    # Footer noir avec liens catalogue, bibliothèque, affiliation
│   ├── BookCard.tsx                  # Carte de livre avec badge catégorie, couverture, prix & avis
│   ├── BookReader.tsx                # Liseuse web intégrée (chapitres, police, mode nuit/crème)
│   ├── CartDrawer.tsx                # Panier latéral avec remise auto 10% sur 3+ livres
│   └── AdminBookForm.tsx             # Formulaire d'ajout de livre pour les éditeurs
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Client Supabase pour le navigateur
│   │   ├── server.ts                 # Client Supabase Server-side avec cookies
│   │   └── admin.ts                  # Client Supabase Service Role pour les webhooks
│   ├── stripe.ts                     # Configuration Stripe Node SDK
│   ├── cloudflare-r2.ts              # AWS S3-compatible SDK pour générer les Presigned URLs Cloudflare R2
│   └── resend.ts                     # Client Resend pour l'envoi des Magic Links et factures
├── supabase/
│   ├── schema.sql                    # Schéma SQL PostgreSQL complet avec tables et RLS
│   └── migrations/                   # Fichiers de migration SQL
├── public/                           # Assets statiques, favicon, logo Bookiin.
├── tailwind.config.ts                # Configuration du design system Bookiin
└── package.json`;

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- SCHEMA SUPABASE POSTGRESQL & ROW LEVEL SECURITY (RLS) POUR BOOKIIN V1
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('super_admin', 'editor', 'customer');
create type book_category as enum ('ROMAN', 'SF', 'THRILLER', 'DÉVELOPPEMENT', 'BUSINESS', 'ESSAI', 'HISTOIRE');
create type order_status as enum ('pending', 'paid', 'cancelled');
create type payout_status as enum ('pending', 'paid');

-- 3. TABLE DES PROFILS UTILISATEURS & RÔLES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  role user_role not null default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABLE DES LIVRES NUMÉRIQUES
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  author text not null,
  category book_category not null,
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2),
  rating numeric(3,2) default 5.00,
  reviews_count integer default 0,
  cover_url text not null,
  description text not null,
  pages integer not null,
  published_year integer not null,
  file_size text not null,
  r2_file_key text not null, -- Clé dans Cloudflare R2 (ex: "ebooks/titre.epub")
  formats text[] default array['EPUB', 'PDF']::text[],
  excerpt text[] default array[]::text[],
  is_featured boolean default false,
  is_new_release boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TABLE DES BUNDLES PRÉ-FAITS
create table public.bundles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  subtitle text,
  description text not null,
  badge text default 'PACK SPÉCIAL',
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) not null,
  discount_percentage integer not null,
  cover_image text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Liaison Plusieurs-à-Plusieurs : Livres dans un Bundle
create table public.bundle_books (
  bundle_id uuid references public.bundles on delete cascade,
  book_id uuid references public.books on delete cascade,
  primary key (bundle_id, book_id)
);

-- 6. TABLE DES AFFILIÉS
create table public.affiliates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  email text not null,
  ref_code text not null unique, -- ex: "alex24"
  commission_rate numeric(4,2) default 0.15 check (commission_rate between 0.05 and 0.50), -- 15% par défaut
  clicks_count integer default 0,
  sales_count integer default 0,
  total_earned numeric(10,2) default 0.00,
  pending_payout numeric(10,2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. TABLE DES COMMANDES (Compatible Guest Checkout Stripe)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  stripe_session_id text unique,
  customer_email text not null,
  total_amount numeric(10,2) not null,
  discount_amount numeric(10,2) default 0.00,
  status order_status default 'pending',
  affiliate_ref text references public.affiliates(ref_code) on delete set null,
  affiliate_commission numeric(10,2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Articles de la commande (permet l'accès aux livres pour la bibliothèque)
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete cascade not null,
  book_id uuid references public.books on delete restrict not null,
  unit_price numeric(10,2) not null,
  bundle_id uuid references public.bundles on delete set null
);

-- Index pour requêtes ultra-rapides sur la bibliothèque du client
create index idx_orders_customer_email on public.orders(customer_email);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_books_category on public.books(category);

-- ==============================================================================
-- POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.bundles enable row level security;
alter table public.bundle_books enable row level security;
alter table public.affiliates enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Fonction utilitaire pour vérifier si l'utilisateur courant est Super Admin
create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
end;
$$ language plpgsql security definer;

-- Fonction utilitaire pour vérifier si l'utilisateur courant est Éditeur ou Super Admin
create or replace function public.is_editor_or_higher()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('super_admin', 'editor')
  );
end;
$$ language plpgsql security definer;

-- POLITIQUES LIVRES (BOOKS)
-- Tout le monde (public) peut lire les livres du catalogue
create policy "Livres visibles par tous"
  on public.books for select
  using (true);

-- Éditeurs et Super Admins peuvent insérer de nouveaux livres
create policy "Ajout de livres par éditeurs et super admins"
  on public.books for insert
  with check (public.is_editor_or_higher());

-- SEUL le Super Admin peut modifier ou supprimer des livres
create policy "Mise à jour réservée au Super Admin"
  on public.books for update
  using (public.is_super_admin());

create policy "Suppression réservée au Super Admin"
  on public.books for delete
  using (public.is_super_admin());

-- POLITIQUES BUNDLES
create policy "Bundles visibles par tous"
  on public.bundles for select using (true);

create policy "Bundles gérés uniquement par Super Admin"
  on public.bundles for all
  using (public.is_super_admin());

-- POLITIQUES COMMANDES (ORDERS)
-- Le client peut lire ses propres commandes via son email authentifié par Magic Link
create policy "Clients accèdent à leurs commandes via email"
  on public.orders for select
  using (
    customer_email = auth.jwt() ->> 'email'
    or public.is_editor_or_higher()
  );

-- POLITIQUES ORDER_ITEMS
create policy "Clients accèdent à leurs ebooks achetés"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.customer_email = auth.jwt() ->> 'email' or public.is_editor_or_higher())
    )
  );

-- POLITIQUES AFFILIATION
create policy "Affilié peut voir son compte personnel"
  on public.affiliates for select
  using (user_id = auth.uid() or public.is_super_admin());

-- ==============================================================================
-- 8. SÉCURITÉ BASE DE DONNÉES AVANCÉE : TRIGGERS ANTI-FRAUDE & RESTRICTIONS STRICTES
-- ==============================================================================

-- Trigger Anti Self-Referral (interdiction stricte de l'auto-parrainage)
create or replace function public.check_anti_self_referral()
returns trigger as $$
declare
  v_affiliate_email text;
begin
  if new.affiliate_ref is not null then
    select email into v_affiliate_email from public.affiliates where ref_code = new.affiliate_ref;
    if lower(trim(new.customer_email)) = lower(trim(v_affiliate_email)) then
      -- Auto-parrainage détecté : révocation automatique de la commission
      new.affiliate_ref := null;
      new.affiliate_commission := 0.00;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_anti_self_referral
before insert or update on public.orders
for each row execute function public.check_anti_self_referral();

-- Verrouillage des privilèges par défaut (Database Hardening)
revoke all on all tables in schema public from public;
revoke all on all functions in schema public from public;
grant select on public.books, public.bundles, public.bundle_books to anon, authenticated;
grant select, insert on public.orders, public.order_items to authenticated, service_role;
grant select on public.affiliates to authenticated;
`;

export const CLOUDFLARE_R2_EDGE_FUNCTION = `// app/api/download/[bookId]/route.ts
// Edge Function ultra-rapide (Vercel Edge / Cloudflare Workers)
// Génère une URL présignée temporaire (15 minutes) vers Cloudflare R2
// Coût de téléchargement R2 = 0,00 $ (0 € d'egress bandwidth fees !)

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'edge';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: \`https://\${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const supabase = createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return NextResponse.json({ error: 'Accès non autorisé. Connectez-vous avec votre Magic Link.' }, { status: 401 });
  }

  // 1. Vérification stricte de propriété de l'achat
  const { data: purchase, error: purchaseError } = await supabase
    .from('order_items')
    .select('id, book_id, orders!inner(status, customer_email)')
    .eq('book_id', params.bookId)
    .eq('orders.customer_email', user.email)
    .eq('orders.status', 'paid')
    .limit(1)
    .single();

  if (!purchase || purchaseError) {
    return NextResponse.json({ error: 'Livre non acheté avec cette adresse email.' }, { status: 403 });
  }

  // 2. Récupération de la clé du fichier R2
  const { data: book } = await supabase
    .from('books')
    .select('title, r2_file_key')
    .eq('id', params.bookId)
    .single();

  if (!book) {
    return NextResponse.json({ error: 'Livre introuvable' }, { status: 404 });
  }

  // 3. Génération de l'URL signée temporaire (15 minutes = 900 secondes)
  const format = request.nextUrl.searchParams.get('format') || 'epub';
  const fileKey = format === 'pdf' ? book.r2_file_key.replace('.epub', '.pdf') : book.r2_file_key;

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: \`attachment; filename="\${encodeURIComponent(book.title)}.\${format}"\`,
  });

  const signedDownloadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

  return NextResponse.json({
    downloadUrl: signedDownloadUrl,
    expiresInSeconds: 900,
    bookTitle: book.title,
    format: format.toUpperCase(),
  });
}`;

export const STRIPE_GUEST_CHECKOUT_FLOW = `// app/api/checkout/route.ts
// Guest Checkout Stripe : L'utilisateur n'a besoin d'aucun mot de passe
// Il saisit simplement son email sur la page hébergée Stripe

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const { items, customerEmail, affiliateRef } = await req.json();

  // Calcul du sous-total et de la remise Custom Bundle (10% si 3 livres ou plus)
  const bookCount = items.filter((i: any) => i.type === 'book').length;
  const isCustomBundleEligible = bookCount >= 3;

  // Création des line_items Stripe
  const line_items = items.map((item: any) => {
    let unitAmount = Math.round(item.price * 100);
    if (isCustomBundleEligible && item.type === 'book') {
      unitAmount = Math.round(unitAmount * 0.9); // -10% automatique
    }

    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          images: [item.coverUrl],
          description: item.authorOrSubtitle,
        },
        unit_amount: unitAmount,
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'link'],
    mode: 'payment',
    customer_email: customerEmail || undefined, // Guest Checkout
    line_items,
    metadata: {
      affiliateRef: affiliateRef || '',
      bookIds: JSON.stringify(items.flatMap((i: any) => i.bookIds || [i.id])),
      isCustomBundle: isCustomBundleEligible ? 'true' : 'false',
    },
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/bibliotheque?session_id={CHECKOUT_SESSION_ID}&success=true\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/catalogue?canceled=true\`,
  });

  return NextResponse.json({ sessionId: session.id, checkoutUrl: session.url });
}`;

export const RESEND_EMAIL_SNIPPET = `// lib/resend.ts
// Envoi d'emails transactionnels avec Resend (Offre gratuite 3000 emails/mois)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLinkEmail(toEmail: string, magicLinkUrl: string) {
  return await resend.emails.send({
    from: 'Bookiin <bonjour@bookiin.fr>',
    to: [toEmail],
    subject: 'Votre accès instantané à votre bibliothèque Bookiin',
    html: \`
      <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; background: #FDFBF7; padding: 40px; border-radius: 16px; border: 1px solid #EFEAE1;">
        <h1 style="font-family: Georgia, serif; font-size: 28px; color: #1A1A1A; margin-bottom: 8px;">
          Bookiin<span style="color: #B8860B;">.</span>
        </h1>
        <p style="color: #666; font-size: 15px; line-height: 1.6;">
          Cliquez sur le bouton ci-dessous pour accéder immédiatement à vos livres numériques sans mot de passe :
        </p>
        <div style="margin: 32px 0;">
          <a href="\${magicLinkUrl}" style="background-color: #1A1A1A; color: #FFFFFF; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; display: inline-block;">
            Accéder à ma bibliothèque
          </a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Ce lien sécurisé expire dans 60 minutes. Vos ebooks restent disponibles à vie sur votre compte Bookiin.
        </p>
      </div>
    \`
  });
}`;
