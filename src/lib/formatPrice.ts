export type Currency = 'EUR' | 'XOF' | 'USD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
  flag: string;
  rateFromEUR: number; // 1 EUR in this currency
  format: (amount: number) => string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'Euro (€)',
    flag: '🇪🇺',
    rateFromEUR: 1,
    format: (amount: number) => {
      const formatted = amount.toFixed(2).replace('.', ',');
      return `${formatted}\u00A0€`;
    }
  },
  XOF: {
    code: 'XOF',
    symbol: 'FCFA',
    label: 'FCFA (XOF)',
    flag: '🌍',
    rateFromEUR: 655.957, // Standard fixed parity
    format: (amount: number) => {
      const rounded = Math.round(amount / 50) * 50; // standard commercial rounding in FCFA
      const formatted = rounded.toLocaleString('fr-FR');
      return `${formatted}\u00A0FCFA`;
    }
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'Dollar ($)',
    flag: '🇺🇸',
    rateFromEUR: 1.08,
    format: (amount: number) => {
      const formatted = amount.toFixed(2);
      return `$${formatted}`;
    }
  }
};

/**
 * Detect user currency based on location, timezone, and locale.
 * Automatically defaults to:
 * - XOF (FCFA) for West & Central Africa (Ivory Coast, Senegal, etc.) or Africa timezones
 * - USD ($) for United States / Americas
 * - EUR (€) for Europe and rest of the world
 */
export function detectUserCurrency(): Currency {
  try {
    if (typeof window === 'undefined') return 'EUR';

    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    const locales = [
      navigator.language,
      ...(Array.isArray(navigator.languages) ? navigator.languages : [])
    ].map(l => (l || '').toLowerCase());

    // West & Central African Franc (CFA / XOF / XAF) zone
    const cfaCities = [
      'abidjan', 'dakar', 'bamako', 'ouagadougou', 'niamey', 'lome',
      'cotonou', 'porto-novo', 'bissau', 'douala', 'yaounde', 'libreville',
      'brazzaville', 'kinshasa', 'bangui', 'ndjamena', 'malabo'
    ];
    const cfaCountrySuffixes = ['-ci', '-sn', '-bf', '-ml', '-tg', '-bj', '-ne', '-cm', '-ga', '-cg', '-td', '-cf', '-gw'];

    const matchesCfaCity = cfaCities.some(city => tz.includes(city));
    const matchesCfaLocale = locales.some(loc => cfaCountrySuffixes.some(s => loc.endsWith(s) || loc.includes(s)));
    const isAfricaTimezone = tz.startsWith('africa/');

    if (matchesCfaCity || matchesCfaLocale || isAfricaTimezone) {
      return 'XOF';
    }

    // US Dollar zone
    const usCities = ['new_york', 'chicago', 'denver', 'los_angeles', 'phoenix', 'anchorage', 'honolulu'];
    const matchesUsCity = usCities.some(c => tz.includes(c));
    const matchesUsLocale = locales.some(l => l === 'en-us' || l.endsWith('-us'));

    if (matchesUsCity || matchesUsLocale) {
      return 'USD';
    }

    // European and default
    return 'EUR';
  } catch {
    return 'EUR';
  }
}

/**
 * Convert base EUR price to selected currency and format string
 */
export function formatPrice(baseEurPrice: number | undefined | null, currency: Currency = 'EUR'): string {
  if (baseEurPrice === undefined || baseEurPrice === null || isNaN(baseEurPrice)) {
    return CURRENCIES[currency].format(0);
  }
  const config = CURRENCIES[currency] || CURRENCIES.EUR;
  const convertedAmount = baseEurPrice * config.rateFromEUR;
  return config.format(convertedAmount);
}
