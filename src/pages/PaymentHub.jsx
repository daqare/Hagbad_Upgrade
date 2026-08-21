import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Smartphone, CheckCircle2, Loader2, XCircle, RefreshCcw, Receipt,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmtMoney, txnRef } from '../utils/format';
import { uid } from '../utils/ids';
import { Card, Button, Badge, Field } from '../components/ui';
import { DemoBadge } from '../components/ui'; // Adjust import path if needed
import SendMoneyForm from '../components/SendMoneyForm'; // <-- NEW: Import the new form

// --- EXISTING SCHEMA & DATA ---
const schema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  phone: z.string().min(5, 'Invalid phone number'),
  purpose: z.string(),
});

const PROVIDER_GROUPS = [
  {
    label: 'Mobile Money',
    ids: ['evc', 'zaad', 'edahab', 'mpesa'],
  },
];

const byId = (id) => {
  const map = {
    evc: { id: 'evc', name: 'EVC Plus', region: 'Somalia', ussdHint: 'Dial *789#', accent: '#0055A4' },
    zaad: { id: 'zaad', name: 'Zaad Service', region: 'Somaliland', ussdHint: 'Dial *826#', accent: '#FFC72C' },
    edahab: { id: 'edahab', name: 'eDahab', region: 'Djibouti/Somalia', ussdHint: 'Dial *789#', accent: '#FF6B00' },
    mpesa: { id: 'mpesa', name: 'M-Pesa', region: 'Kenya', ussdHint: 'SIM Toolkit', accent: '#43B02A' },
  };
  return map[id];
};

const STAGES = [
  { key: 'init', label: 'Initiating secure connection' },
  { key: 'ussd', label: 'Sending USSD prompt to phone' },
  { key: 'pin', label: 'Waiting for PIN confirmation' },
  { key: 'success', label: 'Transaction approved' },
];

const PURPOSES = ['Circle contribution', 'Wallet deposit', 'Savings top-up', 'SACCO savings', 'Emergency support', 'Investment'];
const inputCls = 'w-full rounded-xl border border-forest-200 dark:border-white/10 bg-transparent px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500';

// --- MAIN COMPONENT ---
export default function PaymentHub() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  
  // 1. NEW: This is the "tab state". It remembers if the user clicked "Send" or "Deposit"
  const [tab, setTab] = useState('send'); 
  
  const [provider, setProvider] = useState(null);
  const [stage, setStage] = useState('form');
  const [stageIdx, setStageIdx] = useState(0);
  const [receipt, setReceipt] = useState(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: 100, phone: state.profile.phone, purpose: 'Circle contribution' },
  });
  const amount = watch('amount');

  const runPayment = async (data, forceFail = false) => {
    setStage('auth');
    setStageIdx(0);
    try {
      await provider.authorize({ amount: data.amount, phone: data.phone, onStage: setStageIdx, shouldFail: forceFail });
      const ref = txnRef();
      setReceipt({ ...data, ref, provider: provider.name, date: new Date().toISOString() });
      dispatch({ type: 'WALLET', payload: { balance: +(state.wallet.balance + data.amount).toFixed(2), totalDeposited: state.wallet.totalDeposited + data.amount } });
      dispatch({ type: 'ADD_TXN', txn: { id: uid('tx'), type: 'deposit', amount: data.amount, provider: provider.name, date: new Date().toISOString(), ref, status: 'success', purpose: data.purpose } });
      dispatch({ type: 'TRUST', delta: 5 });
      dispatch({ type: 'ADD_NOTIFICATION', item: { id: uid('nt'), kind: 'payment', title: 'Payment received', body: `${fmtMoney(data.amount)} via ${provider.name} · ${ref}`, date: new Date().toISOString(), read: false } });
      toast('Payment successful', `${fmtMoney(data.amount)} added via ${provider.name}`);
      setStage('success');
    } catch (e) {
      setStage('fail');
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Payment Hub</h1>
          <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Manage your wallet: Send money or Cash in.</p>
        </div>
        <DemoBadge />
      </div>

      {/* 2. NEW: The Tab Buttons to switch between Send and Deposit */}
      <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setTab('send')} 
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'send' ? 'bg-white dark:bg-forest-900 shadow-sm text-forest-900 dark:text-sand-50' : 'text-forest-700/60 dark:text-sand-100/50 hover:text-forest-900'}`}
        >
          Send Money / Pay Bills
        </button>
        <button 
          onClick={() => setTab('deposit')} 
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'deposit' ? 'bg-white dark:bg-forest-900 shadow-sm text-forest-900 dark:text-sand-50' : 'text-forest-700/60 dark:text-sand-100/50 hover:text-forest-900'}`}
        >
          Cash In (Deposit)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* 3. NEW: Only show the Deposit form if the 'deposit' tab is active */}
        {tab === 'deposit' && (
          <motion.div 
            key="deposit-view" 
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} 
            className="grid lg:grid-cols-5 gap-6"
          >
            <div className="lg:col-span-3 space-y-5">
              {PROVIDER_GROUPS.map((grp) => (
                <div key={grp.label}>
                  <p className="text-xs font-bold uppercase tracking-wide text-forest-700/50 dark:text-sand-100/40 mb-2">{grp.label}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {grp.ids.map((id) => {
                      const p = byId(id);
                      const active = provider?.id === id;
                      return (
                        <button key={id} onClick={() => setProvider(p)}
                          className={`text-left p-4 rounded-2xl border-2 transition-all ${active ? 'border-gold-500 shadow-lift bg-gold-50/50 dark:bg-gold-500/10' : 'border-forest-100 dark:border-white/10 hover:border-gold-300'}`}>
                          <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold" style={{ background: p.accent }}>
                              <Smartphone className="h-5 w-5" />
                            </div>
                            <Badge tone="gray">Demo</Badge>
                          </div>
                          <p className="mt-3 font-semibold text-sm">{p.name}</p>
                          <p className="text-xs text-forest-700/50 dark:text-sand-100/40">{p.region} · {p.ussdHint}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card className="p-6 sticky top-24">
                <h3 className="font-display font-bold">Payment details</h3>
                {!provider ? (
                  <p className="mt-4 text-sm text-forest-700/60 dark:text-sand-100/50">Select a provider to continue.</p>
                ) : (
                  <form onSubmit={handleSubmit((d) => runPayment(d))} className="mt-4 space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-2xl text-white" style={{ background: provider.accent }}>
                      <Smartphone className="h-4 w-4" /><span className="text-sm font-semibold">{provider.name}</span>
                      <Badge tone="gold" className="ml-auto">Demo simulation</Badge>
                    </div>
                    <Field label="Amount (USD)" error={errors.amount?.message}>
                      <input type="number" {...register('amount')} className={inputCls} />
                    </Field>
                    <Field label="Phone number" error={errors.phone?.message}>
                      <input {...register('phone')} className={inputCls} inputMode="tel" />
                    </Field>
                    <Field label="Purpose" error={errors.purpose?.message}>
                      <select {...register('purpose')} className={inputCls}>
                        {PURPOSES.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Button type="submit" variant="gold" size="lg" className="w-full">Pay {fmtMoney(amount || 0)}</Button>
                    <button type="button" onClick={handleSubmit((d) => runPayment(d, true))} className="w-full text-xs text-coral-600 hover:underline mt-2">
                      Simulate a failed payment (demo)
                    </button>
                  </form>
                )}
              </Card>
            </div>
          </motion.div>
        )}

        {/* 4. NEW: Show the Send Money form if the 'send' tab is active */}
        {tab === 'send' && (
          <motion.div
            key="send-view"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
          >
            <SendMoneyForm />
          </motion.div>
        )}

        {/* Existing Auth/Success/Fail stages for Deposit (Only show if tab is deposit) */}
        {tab === 'deposit' && stage === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-gold-500" />
              <h3 className="mt-4 font-display text-xl font-bold">Authorizing with {provider?.name}</h3>
              <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Approve the request on your phone ({provider?.ussdHint}).</p>
              <div className="mt-6 space-y-3 text-left">
                {STAGES.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-3">
                    {i < stageIdx ? <CheckCircle2 className="h-5 w-5 text-forest-500" />
                      : i === stageIdx ? <Loader2 className="h-5 w-5 animate-spin text-gold-500" />
                      : <span className="h-5 w-5 rounded-full border-2 border-black/15 dark:border-white/20" />}
                    <span className={`text-sm ${i <= stageIdx ? 'font-semibold' : 'text-forest-700/40 dark:text-sand-100/30'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'deposit' && stage === 'success' && receipt && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="h-16 w-16 mx-auto rounded-full bg-forest-100 dark:bg-forest-800/40 grid place-items-center text-forest-600 dark:text-forest-200">
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h3 className="mt-4 font-display text-2xl font-bold">Payment complete</h3>
              <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Demo transaction recorded to your ledger.</p>
              <div className="mt-6 rounded-2xl border border-dashed border-forest-300 dark:border-white/20 p-5 text-left space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-forest-700/60 dark:text-sand-100/50">Amount</span><b>{fmtMoney(receipt.amount)}</b></div>
                <div className="flex justify-between"><span className="text-forest-700/60 dark:text-sand-100/50">Provider</span><b>{receipt.provider}</b></div>
                <div className="flex justify-between"><span className="text-forest-700/60 dark:text-sand-100/50">Purpose</span><b>{receipt.purpose}</b></div>
                <div className="flex justify-between"><span className="text-forest-700/60 dark:text-sand-100/50">Reference</span><b className="font-mono">{receipt.ref}</b></div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => { reset(); setProvider(null); setStage('form'); }}><RefreshCcw className="h-4 w-4" /> New payment</Button>
                <Button className="flex-1" onClick={() => nav('/wallet')}><Receipt className="h-4 w-4" /> View wallet</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {tab === 'deposit' && stage === 'fail' && (
          <motion.div key="fail" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-coral-100 dark:bg-coral-800/30 grid place-items-center text-coral-600"><XCircle className="h-8 w-8" /></div>
              <h3 className="mt-4 font-display text-2xl font-bold">Payment failed</h3>
              <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">The provider declined the request. No money moved.</p>
              <div className="mt-6 flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setStage('form')}>Cancel</Button>
                <Button variant="coral" className="flex-1" onClick={handleSubmit((d) => runPayment(d))}><RefreshCcw className="h-4 w-4" /> Retry</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
