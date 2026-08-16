import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Briefcase, BadgeCheck, Globe2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Layout';
import { Button, Field, inputCls, Badge, Bar } from '../components/ui';
import { CURRENCIES } from '../utils/format';
import { LANGS } from '../utils/i18n';

const STEPS = ['Welcome', 'Profile', 'Currency', 'KYC'];

export default function Onboarding() {
  const nav = useNavigate();
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: state.profile.name, location: state.profile.location,
    currency: state.profile.currency, employment: state.profile.employment,
  });

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      dispatch({ type: 'PROFILE', payload: form });
      dispatch({ type: 'AUTH', payload: { onboarded: true } });
      dispatch({ type: 'ADD_NOTIFICATION', item: { id: 'nt_w', kind: 'member', title: 'Welcome to Hagbad 🎉', body: 'Your profile is ready. Explore your dashboard.', date: new Date().toISOString(), read: false } });
      nav('/');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-br from-sand-100 to-sand-200 dark:from-[#0a1f18] dark:to-[#0d2a20]">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <Logo size={34} />
          <span className="text-xs font-semibold text-forest-700/50 dark:text-sand-100/40">Step {step + 1} of {STEPS.length}</span>
        </div>
        <Bar value={((step + 1) / STEPS.length) * 100} color="bg-gradient-to-r from-gold-500 to-coral-500" className="mb-8" />

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="glass rounded-3xl shadow-lift p-8">
            {step === 0 && (
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-3xl bg-gradient-to-br from-forest-800 to-teal-800 grid place-items-center text-gold-400 shadow-soft"><Globe2 className="h-7 w-7" /></div>
                <h2 className="mt-5 font-display text-3xl font-bold">Soo dhawoow 👋</h2>
                <p className="mt-2 text-forest-700/60 dark:text-sand-100/50">
                  Hagbad brings your community savings, circles and trust into one secure place — interest-free and transparent.
                </p>
                <div className="mt-6 flex justify-center gap-2 flex-wrap">
                  {LANGS.map((l) => (
                    <button key={l.code} onClick={() => dispatch({ type: 'SET_LANG', lang: l.code })}
                      className={`px-4 py-2 rounded-2xl border text-sm font-medium ${state.lang === l.code ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' : 'border-forest-200 dark:border-white/15'}`}>
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold">Tell us about you</h2>
                <Field label="Full name"><div className="relative"><User className="absolute left-3.5 top-3 h-4 w-4 text-forest-400" /><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls + ' pl-10'} /></div></Field>
                <Field label="Phone"><div className="relative"><Phone className="absolute left-3.5 top-3 h-4 w-4 text-forest-400" /><input value={state.profile.phone} readOnly className={inputCls + ' pl-10 opacity-70'} /></div></Field>
                <Field label="Location"><div className="relative"><MapPin className="absolute left-3.5 top-3 h-4 w-4 text-forest-400" /><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls + ' pl-10'} /></div></Field>
                <Field label="Employment / business">
                  <div className="relative"><Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-forest-400" />
                    <select value={form.employment} onChange={(e) => setForm({ ...form, employment: e.target.value })} className={inputCls + ' pl-10'}>
                      {['Small business owner', 'Trader / merchant', 'Employed', 'Self-employed', 'Student', 'Diaspora professional', 'Other'].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-bold">Preferred currency</h2>
                <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Used for display only in this demo.</p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {Object.values(CURRENCIES).map((c) => (
                    <button key={c.code} onClick={() => setForm({ ...form, currency: c.code })}
                      className={`p-4 rounded-2xl border text-center transition ${form.currency === c.code ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 shadow-soft' : 'border-forest-200 dark:border-white/15'}`}>
                      <p className="text-2xl font-bold">{c.symbol}</p>
                      <p className="mt-1 text-xs font-semibold">{c.code}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-3xl bg-teal-100 dark:bg-teal-800/30 grid place-items-center text-teal-700 dark:text-teal-300"><BadgeCheck className="h-7 w-7" /></div>
                <h2 className="mt-5 font-display text-2xl font-bold">Identity verification</h2>
                <p className="mt-2 text-sm text-forest-700/60 dark:text-sand-100/50">KYC helps keep circles safe. Your current status:</p>
                <Badge tone="gold" className="mt-3">Pending review (simulated)</Badge>
                <div className="mt-6 space-y-2 text-left">
                  {['Phone number verified', 'Name and location provided', 'ID document (pending)'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className={`h-2 w-2 rounded-full ${i < 2 ? 'bg-forest-500' : 'bg-gold-500'}`} /> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              {step > 0 && <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>}
              <Button onClick={next} className="flex-1">{step === STEPS.length - 1 ? 'Enter Hagbad' : 'Continue'}</Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
