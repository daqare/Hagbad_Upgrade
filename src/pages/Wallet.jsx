import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, ArrowUpRight, ArrowDownLeft, Plus, Target, PartyPopper, PiggyBank } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, Field, inputCls, ProgressRing, Modal, EmptyState, DemoBadge } from '../components/ui';
import { fmtMoney, fmtDate, pct, daysFromNow } from '../utils/format';
import { uid, txnRef } from '../utils/ids';
import { Confetti } from '../components/Confetti';

const ACCOUNT_TYPES = [
  { name: 'Personal Savings', icon: '👤' }, { name: 'Emergency Savings', icon: '🛡️' },
  { name: 'Education Fund', icon: '🎓' }, { name: 'Hajj / Umrah Fund', icon: '🕋' },
  { name: 'Business Growth', icon: '💼' }, { name: 'Family Support', icon: '👨‍👩‍👧' },
  { name: 'Custom Goal', icon: '🎯' },
];
const COLOR = { coral: '#E76F51', forest: '#0F3D2E', plum: '#9d4f9f', teal: '#279697', gold: '#D4A017' };

const saveSchema = z.object({
  name: z.string().min(2, 'Name required'),
  goal: z.coerce.number().min(10, 'Goal too small'),
  monthly: z.coerce.number().min(1, 'Monthly amount required'),
  months: z.coerce.number().min(1).max(120),
});

export default function WalletPage() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const { wallet, transactions, savingsAccounts, profile } = state;
  const [filter, setFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [addFor, setAddFor] = useState(null);
  const [addAmt, setAddAmt] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  const filtered = transactions.filter((t) => filter === 'all' || t.type === filter);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(saveSchema),
    defaultValues: { name: 'Personal Savings', goal: 1000, monthly: 50, months: 12 },
  });

  const createAccount = (d) => {
    const colors = Object.keys(COLOR);
    dispatch({ type: 'ADD_SAVINGS', account: {
      id: uid('sv'), name: d.name, icon: 'custom', color: colors[savingsAccounts.length % colors.length],
      goal: d.goal, balance: 0, monthly: d.monthly, targetDate: daysFromNow(d.months * 30), history: [],
    }});
    toast('Savings account created', d.name);
    reset(); setCreateOpen(false);
  };

  const addMoney = () => {
    const amt = Number(addAmt);
    if (!amt || amt <= 0) return;
    const newBal = +(addFor.balance + amt).toFixed(2);
    dispatch({ type: 'UPDATE_SAVINGS', id: addFor.id, patch: {
      balance: newBal, history: [...addFor.history, { date: new Date().toISOString(), amount: amt }],
    }});
    dispatch({ type: 'WALLET', payload: { balance: +(wallet.balance - amt).toFixed(2) } });
    dispatch({ type: 'ADD_TXN', txn: { id: uid('tx'), type: 'savings', account: addFor.name, amount: amt, provider: 'Wallet', date: new Date().toISOString(), ref: txnRef(), status: 'success' } });
    toast('Money added', `${fmtMoney(amt)} → ${addFor.name}`);
    if (newBal >= addFor.goal) setCelebrate(true);
    setAddFor(null); setAddAmt('');
  };

  return (
    <div className="py-6 space-y-6">
      {celebrate && <Confetti />}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">Wallet & Savings</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Your balances, accounts and history.</p></div>
        <div className="flex gap-2">
          <DemoBadge />
          <Button variant="ghost" size="sm" onClick={() => toast('Statement ready', 'Demo statement downloaded (simulated).')}><Download className="h-4 w-4" /> Statement</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: 'Available balance', v: wallet.balance },
          { l: 'Total deposited', v: wallet.totalDeposited },
          { l: 'Total contributions', v: wallet.totalContributions },
          { l: 'Payouts received', v: wallet.totalPayouts },
        ].map((s) => (
          <Card key={s.l} className="p-5"><p className="text-xs text-forest-700/60 dark:text-sand-100/50">{s.l}</p><p className="mt-1 font-display text-2xl font-bold">{fmtMoney(s.v, profile.currency)}</p></Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="gold" onClick={() => nav('/pay')}><Plus className="h-4 w-4" /> Add money</Button>
        <Button variant="ghost" onClick={() => setCreateOpen(true)}><PiggyBank className="h-4 w-4" /> New savings account</Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {savingsAccounts.map((s) => (
          <Card key={s.id} className="p-6" hover>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold">{s.name}</h3>
              <Badge tone="teal">{fmtMoney(s.monthly, profile.currency)}/mo</Badge>
            </div>
            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={pct(s.balance, s.goal)} color={COLOR[s.color] || COLOR.gold} size={84} stroke={9}>
                <p className="font-bold text-sm">{pct(s.balance, s.goal)}%</p>
              </ProgressRing>
              <div>
                <p className="font-display text-2xl font-bold">{fmtMoney(s.balance, profile.currency)}</p>
                <p className="text-xs text-forest-700/60 dark:text-sand-100/50">of {fmtMoney(s.goal, profile.currency)}</p>
                <p className="mt-1 text-xs text-forest-700/50 dark:text-sand-100/40">Target {fmtDate(s.targetDate)}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => setAddFor(s)}><Plus className="h-3.5 w-3.5" /> Add</Button>
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => toast('Withdraw requested', 'Simulated request sent for review.')}>Withdraw</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-display font-bold">Transaction history</h3>
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'deposit', 'contribution', 'payout', 'savings', 'withdraw'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${filter === f ? 'bg-forest-900 text-sand-50' : 'bg-black/5 dark:bg-white/10 text-forest-700/70 dark:text-sand-100/60'}`}>{f}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={Target} title="No transactions" body="No records match this filter yet." />
        ) : (
          <div className="mt-4 divide-y divide-forest-100 dark:divide-white/10">
            {filtered.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center ${tx.amount >= 0 ? 'bg-forest-100 text-forest-700 dark:bg-forest-800/40 dark:text-forest-200' : 'bg-coral-100 text-coral-600 dark:bg-coral-800/30'}`}>
                    {tx.amount >= 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize">{tx.type} <span className="text-xs font-normal text-forest-700/50 dark:text-sand-100/40">· {tx.provider}</span></p>
                    <p className="text-xs text-forest-700/50 dark:text-sand-100/40">{tx.group || tx.account || tx.purpose || ''} · {fmtDate(tx.date)} · <span className="font-mono">{tx.ref}</span></p>
                  </div>
                </div>
                <p className={`font-bold ${tx.amount >= 0 ? 'text-forest-700 dark:text-forest-200' : 'text-coral-600'}`}>{tx.amount >= 0 ? '+' : ''}{fmtMoney(tx.amount, profile.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
        <h3 className="font-display text-xl font-bold">New savings account</h3>
        <p className="text-sm text-forest-700/60 dark:text-sand-100/50 mt-1">Set a goal and automate your habit.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {ACCOUNT_TYPES.map((t) => (
            <button key={t.name} onClick={() => reset((f) => ({ ...f, name: t.name }))} className="px-3 py-2 rounded-xl border border-forest-200 dark:border-white/15 text-sm hover:border-gold-400 text-left">{t.icon} {t.name}</button>
          ))}
        </div>
        <form onSubmit={handleSubmit(createAccount)} className="mt-4 space-y-3">
          <Field label="Account name" error={errors.name?.message}><input {...register('name')} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Goal amount" error={errors.goal?.message}><input type="number" {...register('goal')} className={inputCls} /></Field>
            <Field label="Monthly" error={errors.monthly?.message}><input type="number" {...register('monthly')} className={inputCls} /></Field>
          </div>
          <Field label="Duration (months)" error={errors.months?.message}><input type="number" {...register('months')} className={inputCls} /></Field>
          <Button type="submit" className="w-full">Create account</Button>
        </form>
      </Modal>

      <Modal open={!!addFor} onClose={() => setAddFor(null)}>
        {addFor && (<>
          <h3 className="font-display text-xl font-bold">Add to {addFor.name}</h3>
          <p className="text-sm text-forest-700/60 dark:text-sand-100/50 mt-1">From wallet: {fmtMoney(wallet.balance, profile.currency)}</p>
          <input type="number" value={addAmt} onChange={(e) => setAddAmt(e.target.value)} placeholder="Amount" className={inputCls + ' mt-4'} />
          <Button className="w-full mt-4" onClick={addMoney}>Confirm deposit</Button>
        </>)}
      </Modal>

      {celebrate && (
        <Modal open onClose={() => setCelebrate(false)}>
          <div className="text-center">
            <PartyPopper className="h-12 w-12 mx-auto text-gold-500" />
            <h3 className="mt-3 font-display text-2xl font-bold">Goal reached! 🎉</h3>
            <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">MashaAllah, you hit your savings target.</p>
            <Button className="mt-5 w-full" onClick={() => setCelebrate(false)}>Alhamdulillah</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
