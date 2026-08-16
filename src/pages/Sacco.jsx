import React, { useState } from 'react';
import { Landmark, Users, TrendingUp, Award, Vote, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEMBERS } from '../data/seedData';
import { Card, Stat, Badge, Button, Bar, DemoBadge } from '../components/ui';
import { Donut } from '../components/Charts';
import { fmtMoney, fmtDate, initials } from '../utils/format';

export default function Sacco() {
  const { state, toast } = useApp();
  const { saccos, profile } = state;
  const s = saccos[0];
  const [tab, setTab] = useState('overview');

  if (!s) return null;
  const memberName = (id) => MEMBERS.find((m) => m.id === id)?.name || 'Member';

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">SACCO / Cooperative Groups</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Structured member savings & cooperative finance.</p></div>
        <DemoBadge />
      </div>

      <Card className="p-6 bg-gradient-to-br from-plum-900 to-plum-950 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-plum-500/30 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2"><Landmark className="h-5 w-5 text-gold-400" /><h2 className="font-display text-2xl font-bold">{s.name}</h2></div>
            <p className="mt-1 text-sm text-white/60">{s.members.length} members · mandatory {fmtMoney(s.mandatoryMonthly, profile.currency)}/month</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Total capital</p>
            <p className="font-display text-4xl font-extrabold text-gold-400">{fmtMoney(s.capital, profile.currency)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Member shares" value={fmtMoney(s.shareValue * s.members.length * 4, profile.currency)} icon={<Users className="h-5 w-5" />} tone="plum" />
        <Stat label="Monthly collections" value={fmtMoney(s.mandatoryMonthly * s.members.length, profile.currency)} icon={<TrendingUp className="h-5 w-5" />} tone="teal" />
        <Stat label="Emergency reserve" value={fmtMoney(s.emergencyReserve, profile.currency)} icon={<Award className="h-5 w-5" />} tone="coral" />
        <Stat label="Participation" value={`${s.participation}%`} sub="Active members" icon={<Vote className="h-5 w-5" />} tone="gold" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {[['overview', 'Overview'], ['leaderboard', 'Leaderboard'], ['meetings', 'Meetings & minutes'], ['investments', 'Investments']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-2xl text-sm font-semibold ${tab === k ? 'bg-plum-800 text-white' : 'bg-white/70 dark:bg-white/5 border border-forest-100 dark:border-white/10'}`}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-6"><h3 className="font-display font-bold">Capital allocation</h3><Donut data={[{ name: 'Investments', value: 7800 }, { name: 'Member savings', value: 3180 }, { name: 'Reserve', value: 1500 }]} /></Card>
          <Card className="p-6">
            <h3 className="font-display font-bold">Transparent timeline</h3>
            <div className="mt-4 space-y-3">
              {['Monthly collections reconciled by treasurer', 'Investment committee approved grain wholesale', 'Emergency reserve topped up by 2%', 'General meeting quorum reached'].map((t, i) => (
                <div key={i} className="flex gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-plum-500" /><p className="text-sm">{t}</p></div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'leaderboard' && (
        <Card className="p-6">
          <h3 className="font-display font-bold">Contribution leaderboard</h3>
          <div className="mt-4 space-y-3">
            {s.leaderboard.map((l, i) => {
              const max = s.leaderboard[0].contributed;
              return (
                <div key={l.id} className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-forest-700/50 dark:text-sand-100/40">{i + 1}</span>
                  <div className="h-9 w-9 rounded-full bg-plum-700 grid place-items-center text-white text-xs font-bold">{initials(memberName(l.id))}</div>
                  <div className="flex-1"><p className="text-sm font-semibold">{memberName(l.id)}</p><Bar value={(l.contributed / max) * 100} color="bg-gradient-to-r from-plum-500 to-gold-500" className="mt-1.5" /></div>
                  <p className="font-bold text-sm">{fmtMoney(l.contributed, profile.currency)}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === 'meetings' && (
        <Card className="p-6">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Meetings & digital minutes</h3><Button size="sm" variant="ghost" onClick={() => toast('Meeting scheduled', 'Demo notice sent to all members.')}><FileText className="h-4 w-4" /> New meeting</Button></div>
          <div className="mt-4 space-y-3">
            {s.meetings.map((m, i) => (
              <div key={i} className="p-4 rounded-2xl border border-forest-100 dark:border-white/10">
                <div className="flex items-center justify-between"><p className="font-semibold text-sm">{m.title}</p><Badge tone="plum">{m.attendance} attended</Badge></div>
                <p className="mt-1 text-xs text-forest-700/60 dark:text-sand-100/50">{fmtDate(m.date)}</p>
                <p className="mt-2 text-sm">{m.minutes}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'investments' && (
        <div className="grid md:grid-cols-2 gap-4">
          {s.investments.map((iv) => (
            <Card key={iv.name} className="p-6">
              <div className="flex items-center justify-between"><h3 className="font-display font-bold">{iv.name}</h3><Badge tone="forest">{iv.status}</Badge></div>
              <p className="mt-2 font-display text-2xl font-bold">{fmtMoney(iv.amount, profile.currency)}</p>
              <p className="text-xs text-forest-700/60 dark:text-sand-100/50 mt-1">Allocated from group capital</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
