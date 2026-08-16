import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export function Card({ children, className = '', hover = false, ...rest }) {
  return (
    <div className={`glass rounded-3xl shadow-soft ${hover ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-forest-900 text-sand-50 hover:bg-forest-800 shadow-soft',
    gold: 'bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-glow',
    coral: 'bg-coral-500 text-white hover:bg-coral-400',
    plum: 'bg-plum-800 text-white hover:bg-plum-700',
    ghost: 'bg-transparent border border-forest-200 dark:border-white/15 text-forest-800 dark:text-sand-100 hover:bg-forest-50 dark:hover:bg-white/5',
    danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>{children}</button>;
}

export function Badge({ children, tone = 'forest', className = '' }) {
  const tones = {
    forest: 'bg-forest-100 text-forest-800 dark:bg-forest-800/40 dark:text-forest-200',
    gold: 'bg-gold-100 text-gold-800 dark:bg-gold-800/30 dark:text-gold-300',
    coral: 'bg-coral-100 text-coral-800 dark:bg-coral-800/30 dark:text-coral-300',
    plum: 'bg-plum-100 text-plum-800 dark:bg-plum-800/30 dark:text-plum-300',
    teal: 'bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-300',
    gray: 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60',
  };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${tones[tone]} ${className}`}>{children}</span>;
}

export function DemoBadge() {
  return <Badge tone="gold">Demo simulation</Badge>;
}

export function Stat({ label, value, sub, icon, tone = 'forest' }) {
  const tones = {
    forest: 'from-forest-600 to-teal-700', gold: 'from-gold-500 to-gold-600',
    coral: 'from-coral-500 to-coral-600', plum: 'from-plum-700 to-plum-800', teal: 'from-teal-600 to-teal-800',
  };
  return (
    <Card className="p-5" hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-sand-100/50 font-semibold">{label}</p>
          <p className="mt-1 text-2xl font-display font-bold">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-forest-700/60 dark:text-sand-100/50">{sub}</p>}
        </div>
        {icon && <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${tones[tone]} text-white grid place-items-center shadow-soft`}>{icon}</div>}
      </div>
    </Card>
  );
}

export function ProgressRing({ value, size = 96, stroke = 10, color = '#D4A017', track = 'rgba(0,0,0,0.07)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }} transition={{ duration: 1.1, ease: 'easeOut' }} />
      </svg>
      <div className="absolute text-center">{children}</div>
    </div>
  );
}

export function Bar({ value, color = 'bg-gold-500', className = '' }) {
  return (
    <div className={`h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden ${className}`}>
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, value)}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
    </div>
  );
}

export function Modal({ open, onClose, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <motion.div className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className={`relative glass rounded-3xl shadow-lift w-full ${wide ? 'max-w-2xl' : 'max-w-md'} p-6 max-h-[85vh] overflow-y-auto`}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}

export function Toasts({ items, onDismiss }) {
  const icon = { success: CheckCircle2, info: Info, warn: AlertTriangle };
  const color = { success: 'text-forest-600', info: 'text-teal-600', warn: 'text-coral-600' };
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[60] space-y-2 w-[calc(100%-2rem)] max-w-sm">
      {items.map((n) => {
        const I = icon[n.tone] || icon.success;
        return (
          <motion.div key={n.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
            className="glass rounded-2xl shadow-lift p-3.5 flex items-start gap-3">
            <I className={`h-5 w-5 mt-0.5 ${color[n.tone] || color.success}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{n.title}</p>
              {n.body && <p className="text-xs text-forest-700/70 dark:text-sand-100/60">{n.body}</p>}
            </div>
            <button onClick={() => onDismiss(n.id)} className="text-black/30 dark:text-white/30 hover:opacity-70" aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-forest-100 dark:bg-white/10 grid place-items-center text-forest-600 dark:text-sand-200">
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 font-display font-bold">{title}</h3>
      {body && <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50 max-w-sm mx-auto">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Field({ label, error, children, hint }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-forest-700/60 dark:text-sand-100/50">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-forest-700/50 dark:text-sand-100/40">{hint}</p>}
      {error && <p className="mt-1 text-xs text-coral-600 font-medium">{error}</p>}
    </label>
  );
}

export const inputCls =
  'w-full rounded-2xl border border-forest-200/70 dark:border-white/15 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500 transition';
