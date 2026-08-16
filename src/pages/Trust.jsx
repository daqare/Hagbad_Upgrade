import React from 'react';
import { ShieldCheck, Share2, Clock, Phone, RotateCw, Star, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button, ProgressRing, DemoBadge } from '../components/ui';
import { ScoreLine } from '../components/Charts';
import { fmtMoney } from '../utils/format';

const ICONS = { clock: Clock, phone: Phone, rotate: RotateCw, star: Star, alert: AlertTriangle };

export default function Trust() {
  const { state } = useApp();
  const { trust, profile, wallet } = state;
  const history = trust.history.map((h, i) => ({ label: `P${i + 1}`, score: h.score }));

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">Trust Profile</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Your Hagbad Trust Score & financial reputation.</p></div>
        <div className="flex gap-2"><DemoBadge /><Button variant="ghost" size="sm"><Share2 className="h-4 w-4" /> Share profile</Button></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-8 text-center bg-gradient-to-br from-plum-900 to-forest-950 text-white">
          <ProgressRing value={(trust.score / 900) * 100} size={150} stroke={12} color="#D4A017" track="rgba(255,255,255,0.12)">
            <div><p className="font-display text-4xl font-extrabold">{trust.score}</p><p className="text-xs text-white/60">/ 900</p></div>
          </ProgressRing>
          <Badge tone="gold" className="mt-4">{trust.level}</Badge>
          <p className="mt-2 text-sm text-white/60">Hagbad Trust Score</p>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Score history</h3><Badge tone="plum">Animated trend</Badge></div>
          <div className="mt-4"><ScoreLine data={history} /></div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-display font-bold">Factors affecting your score</h3>
          <div className="mt-4 space-y-3">
            {trust.factors.map((f, i) => {
              const I = ICONS[f.icon] || Star;
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-3"><I className={`h-4 w-4 ${f.impact >= 0 ? 'text-forest-500' : 'text-coral-500'}`} /><span className="text-sm">{f.label}</span></div>
                  <span className={`font-bold text-sm ${f.impact >= 0 ? 'text-forest-600 dark:text-forest-300' : 'text-coral-600'}`}>{f.impact > 0 ? '+' : ''}{f.impact}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-bold">Shareable financial profile</h3>
          <div className="mt-4 space-y-3">
            {[
              ['Hagbad history', '2 completed cycles'],
              ['Groups completed', '3 circles'],
              ['Total contributions', fmtMoney(wallet.totalContributions, profile.currency)],
              ['On-time payment rate', '96%'],
              ['Savings consistency', '6 / 6 months'],
              ['Verified status', 'Phone verified · KYC pending'],
              ['Community standing', 'Good'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm border-b border-forest-100 dark:border-white/10 pb-2.5">
                <span className="text-forest-700/60 dark:text-sand-100/50">{k}</span><b>{v}</b>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-forest-600 dark:text-forest-300"><ShieldCheck className="h-4 w-4" /><span className="text-xs font-semibold">Verified community member</span></div>
        </Card>
      </div>
    </div>
  );
}
