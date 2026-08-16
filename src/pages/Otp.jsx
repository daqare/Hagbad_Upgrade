import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Badge } from '../components/ui';

export default function Otp() {
  const nav = useNavigate();
  const { state, dispatch } = useApp();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  const setAt = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const complete = digits.every((d) => d !== '');

  const verify = () => {
    setVerifying(true);
    setTimeout(() => {
      dispatch({ type: 'AUTH', payload: { isAuthenticated: true } });
      nav(state.auth.onboarded ? '/' : '/onboarding');
    }, 1100);
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-sand-100 dark:bg-[#0a1f18]">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass rounded-3xl shadow-lift p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-forest-100 dark:bg-white/10 grid place-items-center text-forest-700 dark:text-gold-300">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold">Enter verification code</h2>
        <p className="mt-1.5 text-sm text-forest-700/60 dark:text-sand-100/50">
          We sent a 6-digit code to <span className="font-semibold">{state.profile.phone}</span>
        </p>
        <Badge tone="gold" className="mt-3">Demo: any 6 digits work</Badge>

        <div className="mt-8 flex justify-center gap-2.5" dir="ltr">
          {digits.map((d, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} value={d}
              onChange={(e) => setAt(i, e.target.value)} onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric" maxLength={1} aria-label={`Digit ${i + 1}`}
              className="h-14 w-12 text-center text-xl font-bold rounded-2xl border border-forest-200 dark:border-white/15 bg-white/70 dark:bg-white/5 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition" />
          ))}
        </div>

        <Button onClick={verify} disabled={!complete || verifying} size="lg" className="w-full mt-8">
          {verifying ? 'Verifying…' : 'Verify & continue'}
        </Button>
        <button onClick={() => nav('/signin')} className="mt-4 text-sm text-forest-700/60 dark:text-sand-100/50 hover:underline">
          Use a different number
        </button>
      </motion.div>
    </div>
  );
}
