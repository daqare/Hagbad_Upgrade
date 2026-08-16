import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/Layout';
import { SomaliPattern } from '../components/SomaliPattern';
import { useApp } from '../context/AppContext';

export default function Splash() {
  const nav = useNavigate();
  const { state } = useApp();

  useEffect(() => {
    const t = setTimeout(() => nav(state.auth.isAuthenticated ? '/' : '/signin'), 2200);
    return () => clearTimeout(t);
  }, [nav, state.auth.isAuthenticated]);

  return (
    <div className="min-h-screen relative grid place-items-center overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-teal-950 text-sand-50">
      <SomaliPattern color="#D4A017" opacity={0.1} />
      <motion.div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 7, repeat: Infinity }} />

      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="text-center z-10">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="inline-block">
          <Logo size={72} />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 font-display text-2xl font-bold">
          Community finance, <span className="text-gold-400">reimagined</span>
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-2 text-sand-100/60 text-sm">
          Digital infrastructure for Somali savings
        </motion.p>
        <motion.div initial={{ width: 0 }} animate={{ width: 160 }} transition={{ delay: 0.6, duration: 1.4 }} className="h-1 bg-gold-500 rounded-full mx-auto mt-8" />
      </motion.div>

      <p className="absolute bottom-6 text-xs text-sand-100/40">Simulated demo · No real transactions</p>
    </div>
  );
}
