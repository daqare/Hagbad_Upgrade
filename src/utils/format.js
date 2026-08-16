export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', label: 'US Dollar' },
  SOS: { code: 'SOS', symbol: 'Sh.So', label: 'Somali Shilling' },
  KES: { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling' },
};

export function fmtMoney(amount, code = 'USD') {
  const c = CURRENCIES[code] || CURRENCIES.USD;
  const n = Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return code === 'USD' ? `${c.symbol}${n}` : `${n} ${c.symbol}`;
}

export function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function relTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.min(100, Math.round((part / whole) * 100));
}

export function initials(name = '') {
  return name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}
