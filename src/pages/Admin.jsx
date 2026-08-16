import React from 'react';
import { Users, Landmark, Wallet, PiggyBank, TrendingUp, ShieldAlert, Activity, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Stat, Badge } from '../components/ui';
import { AreaFlow } from '../components/Charts';
import { fmtMoney } from '../utils/format';

export default function Admin() {
  const { state } = useApp();
  const a = state.admin;

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">Admin Portal</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Platform-wide demo analytics for investors.</p></div>
        <Badge tone="coral">All figures are demo data</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total users" value={a.users.toLocaleString()} sub="+9% this month" icon={<Users className="h-5 w-5" />} tone="forest" />
        <Stat label="Active groups" value={a.activeGroups} sub={`${a.saccoGroups} SACCO groups`} icon={<Landmark className="h-5 w-5" />} tone="teal" />
        <Stat label="Savings accounts" value={a.savingsAccounts} icon={<PiggyBank className="h-5 w-5" />} tone="gold" />
        <Stat label="Txn volume" value={fmtMoney(a.volume)} sub="Simulated" icon={<TrendingUp className="h-5 w-5" />} tone="plum" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Revenue preview" value={fmtMoney(a.revenue)} sub="2% platform fee" icon={<DollarSign className="h-5 w-5" />} tone="gold" />
        <Stat label="Pending KYC" value={a.pendingKyc} sub="Awaiting review" icon={<Wallet className="h-5 w-5" />} tone="teal" />
        <Stat label="Risk alerts" value={a.riskAlerts} sub="Fraud monitoring" icon={<ShieldAlert className="h-5 w-5" />} tone="coral" />
        <Stat label="Open disputes" value={a.disputes} sub={`${a.openEmergencies} emergencies`} icon={<Activity className="h-5 w-5" />} tone="plum" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Community growth</h3><Badge tone="teal">Demo</Badge></div>
          <div className="mt-4"><AreaFlow data={a.growth.map((g) => ({ m: g.m, amount: g.users }))} gradient="adm" color="#279697" /></div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Live demo ledger feed</h3><span className="flex items-center gap-1.5 text-xs font-semibold text-forest-600 dark:text-forest-300"><span className="h-2 w-2 rounded-full bg-forest-500 animate-pulse" /> Streaming</span></div>
          <div className="mt-4 space-y-2">
            {a.ledger.map((l, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-sm">
                <div className="flex items-center gap-3"><span className="font-mono text-xs text-forest-700/50 dark:text-sand-100/40">{l.time}</span><span>{l.desc}</span></div>
                <b className="text-forest-700 dark:text-forest-200">{fmtMoney(l.amount)}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
