import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wallet, Users, Landmark, HeartHandshake, TrendingUp,
  ShieldCheck, MessageSquare, Bell, Settings, LogOut, Zap, Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Orbs } from './Orbs';
import { Toasts } from './ui';
import { relTime } from '../utils/format';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/wallet', label: 'Wallet & Savings', icon: Wallet },
  { to: '/groups', label: 'Hagbad Circles', icon: Users },
  { to: '/sacco', label: 'SACCO Groups', icon: Landmark },
  { to: '/emergency', label: 'Emergency Fund', icon: HeartHandshake },
  { to: '/invest', label: 'Investments', icon: TrendingUp },
  { to: '/trust', label: 'Trust Profile', icon: ShieldCheck },
  { to: '/community', label: 'Community', icon: MessageSquare },
  { to: '/admin', label: 'Admin Portal', icon: Zap },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Logo({ size = 36 }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-forest-800 to-teal-800 shadow-soft" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="none" className="text-gold-400" style={{ width: size * 0.55, height: size * 0.55 }}>
          <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.4" fill="currentColor" />
        </svg>
      </div>
      <span className="font-display font-extrabold text-xl tracking-tight">Hagbad</span>
    </div>
  );
}

export default function Layout() {
  const { state, dispatch } = useApp();
  const nav = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = state.notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const recent = state.notifications.filter((n) => n.kind === 'toast').slice(0, 1);
    if (recent.length) {
      setToasts(recent);
      const t = setTimeout(() => setToasts([]), 4000);
      return () => clearTimeout(t);
    }
  }, [state.notifications]);

  return (
    <div className="min-h-screen">
      <Orbs />
// Add this right after <Orbs /> in Layout.jsx
<div className="fixed top-0 inset-x-0 z-50 bg-amber-400/90 dark:bg-amber-500/90 text-amber-950 text-xs font-bold text-center py-1.5 backdrop-blur-sm">
  🛠️ Demo Mode: No real money is moved. All transactions are simulated.
</div>

// Then, adjust the <header> and <main> top padding to account for the banner:
// Change <header className="fixed top-0 ..."> to:
<header className="fixed top-6 inset-x-0 md:left-64 z-40 glass border-b border-white/40 dark:border-white/10">

// Change <main className="md:pl-64 pt-16 ..."> to:
<main className="md:pl-64 pt-20 pb-24 md:pb-10">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col glass border-r border-white/40 dark:border-white/10 z-30">
        <div className="p-5"><Logo /></div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${isActive ? 'bg-forest-900 text-sand-50 shadow-soft' : 'text-forest-800/70 dark:text-sand-100/60 hover:bg-forest-100/60 dark:hover:bg-white/5'}`}>
              <Icon className="h-[18px] w-[18px]" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-forest-100 dark:border-white/10">
          <button onClick={() => { dispatch({ type: 'AUTH', payload: { isAuthenticated: false } }); nav('/signin'); }}
            className="flex items-center gap-2 text-sm text-coral-600 font-medium hover:opacity-80">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <header className="fixed top-0 inset-x-0 md:left-64 z-30 glass border-b border-white/40 dark:border-white/10">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setMobileOpen(true)} aria-label="Menu" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </button>
            <Logo size={30} />
          </div>
          <div className="hidden md:block text-sm font-medium text-forest-700/60 dark:text-sand-100/50">
            {state.meta.investorMode && <span className="text-gold-600 font-semibold">● Investor Mode live</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setNotifOpen(true)} className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 grid place-items-center rounded-full bg-coral-500 text-white text-[10px] font-bold">{unread}</span>
              )}
            </button>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gold-400 to-coral-500 grid place-items-center text-white font-bold text-sm shadow-soft">
              {state.profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 28 }}
              className="fixed inset-y-0 left-0 w-64 glass z-50 md:hidden p-4 overflow-y-auto">
              <Logo />
              <nav className="mt-6 space-y-1">
                {NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium ${isActive ? 'bg-forest-900 text-sand-50' : 'text-forest-800/70 dark:text-sand-100/60'}`}>
                    <Icon className="h-[18px] w-[18px]" /> {label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/30 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNotifOpen(false)} />
            <motion.div initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }} transition={{ type: 'spring', damping: 30 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm glass z-50 p-5 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg">Notifications</h2>
                <button onClick={() => dispatch({ type: 'MARK_NOTIFS_READ' })} className="text-xs font-semibold text-teal-700 dark:text-teal-300">Mark all read</button>
              </div>
              <div className="mt-4 space-y-2">
                {state.notifications.map((n) => (
                  <div key={n.id} className={`rounded-2xl p-3.5 border ${n.read ? 'border-transparent bg-black/5 dark:bg-white/5' : 'border-gold-300/50 bg-gold-50/60 dark:bg-gold-500/10'}`}>
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-xs text-forest-700/60 dark:text-sand-100/50 mt-0.5">{n.body}</p>
                    <p className="text-[10px] mt-1 text-forest-700/40 dark:text-sand-100/30">{relTime(n.date)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="md:pl-64 pt-16 pb-24 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <Outlet />
        </div>
      </main>

      <Toasts items={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
