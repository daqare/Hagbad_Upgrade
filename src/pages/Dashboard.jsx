import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, CalendarDays, ShieldCheck, ArrowUpRight, ArrowDownLeft,
  Zap, HeartHandshake, Target, Flame, ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCountUp } from '../hooks/useCountUp';
import { fmtMoney, fmtDate, pct, relTime } from '../utils/format';
import { Card, Stat, Badge, Button, ProgressRing, Bar, DemoBadge } from '../components/ui';
import { AreaFlow, DualBar } from '../components/Charts';
import { SomaliPattern } from '../components/SomaliPattern';

const MONTHLY = [
  { m: 'Mar', amount: 320 }, { m: 'Apr', amount: 380 }, { m: 'May', amount: 340 },
  { m: 'Jun', amount: 460 }, { m: 'Jul', amount: 420 }, { m: 'Aug', amount: 510 },
];
const CASHFLOW = [
  { m: 'Mar', in: 420, out: 260 }, { m: 'Apr', in: 500, out: 310 },
  { m: 'May', in: 470, out: 280 }, { m: 'Jun', in: 620, out: 350 },
  { m: 'Jul', in: 560, out: 400 }, { m: 'Aug', in: 680, out: 320 },
];

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const nav = useNavigate();
  const balance = useCountUp(state.wallet.balance);
  const { profile, trust, groups, savingsAccounts, transactions, meta } = state;

  const nextPayout = groups[0];
  const totalSavings = savingsAccounts.reduce((a, s) => a + s.balance, 0);
  const goal = savingsAccounts[0];

  return (
    <div className="space-y-6 py-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-950 via-forest-900 to-teal-950 text-sand-50 p-7 md:p-9 shadow-lift">
        <SomaliPattern color="#D4A017" opacity={0.09} />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sand-100/60 text-sm">Assalaamu calaykum, <span className="font-semibold text-sand-50">{profile.name.split(' ')[0]}</span></p>
              <DemoBadge />
              {meta.investorMode && <Badge tone="coral"><Zap className="h-3 w-3" /> Investor Mode</Badge>}
            </div>
            <p className="mt-4 text-sm text-sand-100/60">Available wallet balance</p>
            <motion.p key={Math.round(balance)} className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-gold-400">
              {fmtMoney(balance, profile.currency)}
            </motion.p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="gold" onClick={() => nav('/pay')}><ArrowUpRight className="h-4 w-4" /> Make a payment</Button>
              <Button variant="ghost" className="!border-white/25 !text-sand-50" onClick={() => nav('/wallet')}>View wallet</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-80">
            <div className="glass !bg-white/10 rounded-2xl p-4">
              <p className="text-xs text-sand-100/60">Savings total</p>
              <p className="mt-1 font-display text-xl font-bold">{fmtMoney(totalSavings, profile.currency)}</p>
            </div>
            <div className="glass !bg-white/10 rounded-2xl p-4">
              <p className="text-xs text-sand-100/60">Trust score</p>
              <p className="mt-1 font-display text-xl font-bold text-gold-400">{trust.score}</p>
            </div>
            <div className="glass !bg-white/10 rounded-2xl p-4 col-span-2 flex items-center justify-between">
              <div>
                <p className="text-xs text-sand-100/60">Next payout · {nextPayout?.name}</p>
                <p className="mt-0.5 font-semibold">{fmtDate(nextPayout?.nextPayout)}</p>
              </div>
              <CalendarDays className="h-6 w-6 text-gold-400" />
            </div>
          </div>
        </div>
      </div>

      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gold-100 dark:bg-gold-500/15 grid place-items-center text-gold-600"><Zap className="h-5 w-5" /></div>
          <div>
            <p className="font-semibold text-sm">Investor presentation mode</p>
            <p className="text-xs text-forest-700/60 dark:text-sand-100/50">Simulates live community activity every few seconds.</p>
          </div>
        </div>
        <button onClick={() => dispatch({ type: 'TOGGLE_INVESTOR' })}
          className={`relative h-7 w-[52px] rounded-full transition ${meta.investorMode ? 'bg-gold-500' : 'bg-black/15 dark:bg-white/15'}`}
          aria-label="Toggle investor mode">
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${meta.investorMode ? 'left-[26px]' : 'left-1'}`} />
        </button>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active groups" value={groups.length} sub="Hagbad circles" icon={<Users className="h-5 w-5" />} tone="forest" />
        <Stat label="Contributions" value={fmtMoney(state.wallet.totalContributions, profile.currency)} sub="All-time" icon={<ArrowUpRight className="h-5 w-5" />} tone="teal" />
        <Stat label="Payouts received" value={fmtMoney(state.wallet.totalPayouts, profile.currency)} sub="All-time" icon={<ArrowDownLeft className="h-5 w-5" />} tone="gold" />
        <Stat label="Emergency fund" value="Active" sub="1 open request" icon={<HeartHandshake className="h-5 w-5" />} tone="coral" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">Monthly savings</h3>
            <Badge tone="teal">Demo data</Badge>
          </div>
          <div className="mt-4"><AreaFlow data={MONTHLY} gradient="sav" /></div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">Cash flow</h3>
            <Badge tone="teal">Demo data</Badge>
          </div>
          <div className="mt-4"><DualBar data={CASHFLOW} /></div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 flex items-center gap-5">
          <ProgressRing value={pct(goal.balance, goal.goal)} color="#D4A017">
            <p className="font-display font-bold text-lg">{pct(goal.balance, goal.goal)}%</p>
          </ProgressRing>
          <div>
            <div className="flex items-center gap-2"><Target className="h-4 w-4 text-gold-600" /><p className="text-sm font-semibold">{goal.name}</p></div>
            <p className="mt-1 text-2xl font-display font-bold">{fmtMoney(goal.balance, profile.currency)}</p>
            <p className="text-xs text-forest-700/60 dark:text-sand-100/50">of {fmtMoney(goal.goal, profile.currency)} goal</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2"><Flame className="h-4 w-4 text-coral-500" /><h3 className="font-display font-bold text-sm">Financial health</h3></div>
          <p className="mt-3 text-3xl font-display font-extrabold text-forest-800 dark:text-gold-300">Strong</p>
          <p className="mt-1 text-xs text-forest-700/60 dark:text-sand-100/50">You saved in 6 of the last 6 months and never missed a circle contribution. Keep it up!</p>
          <Bar value={82} color="bg-gradient-to-r from-forest-500 to-teal-500" className="mt-4" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-teal-600" /><h3 className="font-display font-bold text-sm">Trust level</h3></div>
          <p className="mt-3 text-3xl font-display font-extrabold">{trust.level}</p>
          <Bar value={(trust.score / 900) * 100} color="bg-gradient-to-r from-plum-500 to-plum-700" className="mt-4" />
          <Link to="/trust" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300">View full profile <ChevronRight className="h-3 w-3" /></Link>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">Recent transactions</h3>
            <Link to="/wallet" className="text-xs font-semibold text-teal-700 dark:text-teal-300">See all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center ${tx.amount >= 0 ? 'bg-forest-100 text-forest-700 dark:bg-forest-800/40 dark:text-forest-200' : 'bg-coral-100 text-coral-700 dark:bg-coral-800/30 dark:text-coral-300'}`}>
                    {tx.amount >= 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize">{tx.type}</p>
                    <p className="text-xs text-forest-700/50 dark:text-sand-100/40">{tx.group || tx.account || tx.provider} · {relTime(tx.date)}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${tx.amount >= 0 ? 'text-forest-700 dark:text-forest-200' : 'text-coral-600'}`}>
                  {tx.amount >= 0 ? '+' : ''}{fmtMoney(tx.amount, profile.currency)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold">Active groups</h3>
            <Link to="/groups" className="text-xs font-semibold text-teal-700 dark:text-teal-300">Manage</Link>
          </div>
          <div className="mt-4 space-y-3">
            {groups.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl border border-forest-100 dark:border-white/10 hover:border-gold-400/60 transition">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{g.name}</p>
                  <Badge tone="forest">{g.members.length}/{g.memberLimit}</Badge>
                </div>
                <p className="mt-1 text-xs text-forest-700/60 dark:text-sand-100/50">{fmtMoney(g.contribution, profile.currency)} · {g.frequency} · next {fmtDate(g.nextPayout)}</p>
                <Bar value={g.health} color="bg-gradient-to-r from-teal-500 to-forest-500" className="mt-3" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
