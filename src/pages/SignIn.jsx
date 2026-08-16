import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Layout';
import { SomaliPattern } from '../components/SomaliPattern';
import { Button, Field, inputCls, Badge } from '../components/ui';
import { LANGS } from '../utils/i18n';

const schema = z.object({
  phone: z.string().min(9, 'Enter a valid phone number').regex(/^[+\d\s()-]+$/, 'Digits only'),
});

export default function SignIn() {
  const nav = useNavigate();
  const { state, dispatch } = useApp();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { phone: state.profile.phone },
  });

  const onSubmit = (data) => {
    dispatch({ type: 'PROFILE', payload: { phone: data.phone } });
    setTimeout(() => nav('/otp'), 400);
  };

  return (
    <div className="min-h-screen relative grid lg:grid-cols-2 bg-sand-100 dark:bg-[#0a1f18] overflow-hidden">
      <SomaliPattern opacity={0.05} />

      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-forest-950 via-forest-900 to-teal-950 text-sand-50 relative overflow-hidden">
        <SomaliPattern color="#D4A017" opacity={0.08} />
        <Logo />
        <div className="z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-display text-5xl font-extrabold leading-tight">
            The digital home of <span className="text-gold-400">Hagbad</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-4 text-sand-100/70 text-lg max-w-md">
            Transparent circles, SACCO savings, emergency support and trust — built for Somali communities worldwide.
          </motion.p>
          <div className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, text: 'Interest-free, Islamic-finance conscious' },
              { icon: Sparkles, text: 'Trust scores built on real community history' },
              { icon: Smartphone, text: 'Works with EVC Plus, Zaad, eDahab & M-Pesa' },
            ].map(({ icon: I, text }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }} className="flex items-center gap-3 text-sand-100/80">
                <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center"><I className="h-4 w-4 text-gold-400" /></div>
                <span className="text-sm">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <Badge tone="gold">Interactive demo · No real money moves</Badge>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h2 className="font-display text-3xl font-bold">Welcome back</h2>
          <p className="mt-1.5 text-forest-700/60 dark:text-sand-100/50 text-sm">Sign in with your phone number to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Field label="Phone number" error={errors.phone?.message} hint="Demo: any phone number works">
              <input {...register('phone')} className={inputCls} placeholder="+252 61 234 5678" inputMode="tel" />
            </Field>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-700/60 dark:text-sand-100/50 mb-2">Language</p>
              <div className="flex gap-2">
                {LANGS.map((l) => (
                  <button type="button" key={l.code} onClick={() => dispatch({ type: 'SET_LANG', lang: l.code })}
                    className={`flex-1 px-3 py-2.5 rounded-2xl border text-sm font-medium transition ${state.lang === l.code ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 text-forest-900 dark:text-gold-300' : 'border-forest-200 dark:border-white/15 text-forest-700/70 dark:text-sand-100/60'}`}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending code…' : 'Send verification code'}
            </Button>
            <p className="text-center text-xs text-forest-700/50 dark:text-sand-100/40">
              By continuing you agree to the demo terms. Verification is simulated.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
