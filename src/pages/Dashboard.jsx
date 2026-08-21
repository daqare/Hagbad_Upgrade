import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, CalendarDays, ShieldCheck, ArrowUpRight, ArrowDownLeft, HandCoins,
  Zap, HeartHandshake, Target, Flame, ChevronRight, Send, Receipt, Wallet, Crown, TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCountUp } from '../hooks/useCountUp';
import { fmtMoney, fmtDate, pct, relTime } from '../utils/format';
import { Card, Stat, Badge, Button, ProgressRing, Bar, DemoBadge } from '../components/ui';
import { AreaFlow, DualBar } from '../components/Charts';
import { SomaliPattern } from '../components/SomaliPattern';
import QardHasanModal from '../components/QardHasanModal';
import ProUpgradeModal from '../components/ProUpgradeModal';
import BusinessLedgerModal from '../components/BusinessLedgerModal';
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
  const [showBusiness, setShowBusiness] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const { state, dispatch } = useApp();
  const nav = useNavigate();
  const balance = useCountUp(state.wallet.balance);
  const { profile, trust, groups, savingsAccounts, transactions, meta } = state;
  const [showLoan, setShowLoan] = useState(false);
  const nextPayout = groups[0];
  const totalSavings = savingsAccounts.reduce((a, s) => a + s.balance, 0);
  const goal = savingsAccounts[0];

  return (
    <div className="space-y-6 py-6">
      
      {/* 1. HERO WALLET CARD */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-950 via-forest-900 to-teal-950 text-sand-50 p-7 md:p-9 shadow-lift">
        <SomaliPattern color="#D4A017" opacity={0.09} />
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sand-100/60 text-sm">Assalaamu calaykum, <span className="font-semibold text-sand-50">{profile.name.split(' ')[0]}</span></p>
              <p className="mt-4 text-sm text-sand-100/60">Available wallet balance</p>
              <motion.p key={Math.round(balance)} className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-gold-400 mt-1">
                {fmtMoney(balance, profile.currency)}
              </motion.p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <DemoBadge />
              <Badge tone="teal" className="!bg-teal-500/20 !text-teal-200 !border-teal-500/30">
                <ShieldCheck className="h-3 w-3" /> 100% Sharia-Compliant
              </Badge>
            </div>
          </div>

          {/* 3 ACTION BUTTONS */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Button variant="gold" size="sm" onClick={() => nav('/pay')} className="flex flex-col items-center py-3 h-auto">
              <ArrowUpRight className="h-4 w-4 mb-1" /> 
              <span className="text-xs font-semibold">Send Money</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center py-3 h-auto !border-white/25 !text-sand-50" onClick={() => nav('/pay')}>
              <ArrowDownLeft className="h-4 w-4 mb-1" /> 
              <span className="text-xs font-semibold">Cash In</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center py-3 h-auto !border-white/25 !text-sand-50" onClick={() => nav('/wallet')}>
              <Wallet className="h-4 w-4 mb-1" /> 
              <span className="text-xs font-semibold">View Wallet</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. CRITICAL METRICS (The missing pieces!) */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-wider text-forest-700/60 dark:text-sand-100/50 font-bold">Total Savings</p>
          <p className="mt-1 font-display text-lg font-bold text-forest-900 dark:text-sand-50">{fmtMoney(totalSavings, profile.currency)}</p>
        </Card>
        <Card className="p-4 text-center flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-wider text-forest-700/60 dark:text-sand-100/50 font-bold">Next Payout</p>
          <p className="mt-1 font-display text-lg font-bold text-gold-600">{fmtDate(nextPayout?.nextPayout)}</p>
          <p className="text-[10px] text-forest-700/50 truncate w-full">{nextPayout?.name || 'No active circle'}</p>
        </Card>
        <Card className="p-4 text-center flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-wider text-forest-700/60 dark:text-sand-100/50 font-bold">Trust Score</p>
          <p className="mt-1 font-display text-lg font-bold text-teal-600">{trust.score}</p>
          <p className="text-[10px] text-forest-700/50">{trust.level}</p>
        </Card>
      </div>
            {/* HAGBAD PRO BANNER */}
      {!state.isPro && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 p-5 text-white shadow-lg">
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-lg">Unlock Hagbad Pro</p>
                <p className="text-xs text-white/90">SMS reminders, PDF reports & up to 500 members.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPro(true)} 
              className="px-5 py-2.5 rounded-xl bg-white text-gold-700 font-bold text-sm hover:bg-gold-50 transition shadow-md"
            >
              Upgrade $9.99/mo
            </button>
          </div>
        </div>
      )}

      {state.isPro && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
          <Crown className="h-4 w-4 text-teal-600" />
          <p className="text-xs font-bold text-teal-800 dark:text-teal-200">Hagbad Pro Active</p>
          <button onClick={() => dispatch({ type: 'SET_PRO', payload: false })} className="ml-auto text-[10px] text-teal-600 underline">Reset Demo</button>
        </div>
      )}
            {/* HAGBAD BUSINESS BUTTON */}
      <button 
        onClick={() => setShowBusiness(true)} 
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-forest-900 to-teal-900 text-white flex items-center justify-between shadow-lg hover:shadow-xl transition"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center">
            <TrendingUp className="h-5 w-5 text-gold-400" />
          </div>
          <div className="text-left">
            <p className="font-display font-bold text-sm">Hagbad Business</p>
            <p className="text-[10px] text-white/70">Track sales & send invoices</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-white/50" />
      </button>
      {/* 3. QUICK ACTIONS GRID */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Send', icon: Send, color: 'bg-gold-100 text-gold-600 dark:bg-gold-500/15 dark:text-gold-400', action: () => nav('/pay') },
          { label: 'Bills', icon: Receipt, color: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400', action: () => nav('/pay') },
          { label: 'Circles', icon: Users, color: 'bg-forest-100 text-forest-600 dark:bg-forest-500/15 dark:text-forest-400', action: () => nav('/groups') },
          { label: 'Smart', icon: Zap, color: 'bg-plum-100 text-plum-600 dark:bg-plum-500/15 dark:text-plum-400', action: () => nav('/pay') },
          { label: 'Loan', icon: HandCoins, color: 'bg-coral-100 text-coral-600 dark:bg-coral-500/15 dark:text-coral-400', action: () => setShowLoan(true) },
        ].map((item) => (
          <button key={item.label} onClick={item.action} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-white/5 border border-forest-100 dark:border-white/10 hover:border-gold-400/60 transition">
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-forest-800 dark:text-sand-100">{item.label}</span>
          </button>
        ))}
      </div>

      {/* INVESTOR MODE TOGGLE */}
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

      {/* 4. ACTIVE CIRCLES CAROUSEL */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-forest-900 dark:text-sand-50">Active Circles</h3>
          <Link to="/groups" className="text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center">View all <ChevronRight className="h-3 w-3" /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {groups.map((g) => (
            <div key={g.id} className="shrink-0 w-64 p-5 rounded-2xl bg-white dark:bg-white/5 border border-forest-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-forest-900 dark:text-sand-50 truncate">{g.name}</p>
                <Badge tone="forest" className="!text-[10px]">{g.members.length} members</Badge>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <ProgressRing value={g.health} color="#D4A017" size={40}>
                  <p className="text-[10px] font-bold">{g.health}%</p>
                </ProgressRing>
                <div>
                  <p className="text-xs text-forest-700/60 dark:text-sand-100/50">Next payout</p>
                  <p className="text-sm font-bold text-forest-900 dark:text-sand-50">{fmtDate(g.nextPayout)}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-forest-100 dark:border-white/10 flex justify-between text-xs">
                <span className="text-forest-700/60 dark:text-sand-100/50">Contribution</span>
                <span className="font-bold text-forest-900 dark:text-sand-50">{fmtMoney(g.contribution, profile.currency)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active groups" value={groups.length} sub="Hagbad circles" icon={<Users className="h-5 w-5" />} tone="forest" />
        <Stat label="Contributions" value={fmtMoney(state.wallet.totalContributions, profile.currency)} sub="All-time" icon={<ArrowUpRight className="h-5 w-5" />} tone="teal" />
        <Stat label="Payouts received" value={fmtMoney(state.wallet.totalPayouts, profile.currency)} sub="All-time" icon={<ArrowDownLeft className="h-5 w-5" />} tone="gold" />
        <Stat label="Emergency fund" value="Active" sub="1 open request" icon={<HeartHandshake className="h-5 w-5" />} tone="coral" />
      </div>

      {/* CHARTS */}
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

      {/* TRUST & GOALS */}
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

      {/* RECENT TRANSACTIONS */}
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
      {showLoan && <QardHasanModal onClose={() => setShowLoan(false)} />}
      {showPro && <ProUpgradeModal onClose={() => setShowPro(false)} />}
      {showBusiness && <BusinessLedgerModal onClose={() => setShowBusiness(false)} />}
    </div>
  );
}
