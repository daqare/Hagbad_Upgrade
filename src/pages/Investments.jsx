import React, { useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, Bar, Modal, DemoBadge } from '../components/ui';
import { fmtMoney } from '../utils/format';
import { uid } from '../utils/ids';

const RISK = { Low: 'forest', Medium: 'gold', High: 'coral' };

export default function Investments() {
  const { state, dispatch, toast } = useApp();
  const { investments, profile } = state;
  const [investIn, setInvestIn] = useState(null);
  const [amt, setAmt] = useState('');

  const invest = () => {
    const amount = Number(amt);
    if (!amount || amount < investIn.minContribution) { toast('Minimum not met', `Minimum contribution is ${fmtMoney(investIn.minContribution)}`, 'warn'); return; }
    dispatch({ type: 'INVEST', id: investIn.id, amount });
    dispatch({ type: 'ADD_TXN', txn: { id: uid('tx'), type: 'invest', account: investIn.name, amount: -amount, provider: 'Wallet', date: new Date().toISOString(), ref: 'HGB-INV', status: 'success' } });
    toast('Investment recorded', `${fmtMoney(amount)} committed to ${investIn.name} (demo)`);
    setInvestIn(null); setAmt('');
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">Investment Groups</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Pool resources into community-vetted opportunities.</p></div>
        <DemoBadge />
      </div>

      <Card className="p-4 flex items-start gap-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40">
        <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
        <p className="text-sm text-teal-800 dark:text-teal-200">Projected scenarios for demonstration only. Investment outcomes are not guaranteed and no returns are promised.</p>
      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {investments.map((iv) => (
          <Card key={iv.id} className="p-6" hover>
            <div className="flex items-center justify-between">
              <Badge tone="plum">{iv.category}</Badge>
              <Badge tone={RISK[iv.risk]}>{iv.risk} risk</Badge>
            </div>
            <h3 className="mt-3 font-display text-xl font-bold">{iv.name}</h3>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1.5"><span className="text-forest-700/60 dark:text-sand-100/50">Raised</span><b>{fmtMoney(iv.raised, profile.currency)} / {fmtMoney(iv.target, profile.currency)}</b></div>
              <Bar value={(iv.raised / iv.target) * 100} color="bg-gradient-to-r from-plum-500 to-gold-500" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-2"><p className="font-bold">{iv.investors}</p><p className="text-forest-700/50 dark:text-sand-100/40">Investors</p></div>
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-2"><p className="font-bold">{fmtMoney(iv.minContribution, profile.currency)}</p><p className="text-forest-700/50 dark:text-sand-100/40">Min.</p></div>
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-2"><p className="font-bold">{iv.horizon}</p><p className="text-forest-700/50 dark:text-sand-100/40">Horizon</p></div>
            </div>
            <Button variant="plum" className="w-full mt-5" onClick={() => setInvestIn(iv)}><TrendingUp className="h-4 w-4" /> Commit funds</Button>
          </Card>
        ))}
      </div>

      <Modal open={!!investIn} onClose={() => setInvestIn(null)}>
        {investIn && (<>
          <h3 className="font-display text-xl font-bold">Invest in {investIn.name}</h3>
          <p className="text-sm text-forest-700/60 dark:text-sand-100/50 mt-1">Minimum {fmtMoney(investIn.minContribution, profile.currency)} · {investIn.category}</p>
          <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="Amount" className="w-full rounded-2xl border border-forest-200 dark:border-white/15 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm mt-4 outline-none focus:ring-2 focus:ring-gold-500" />
          <p className="mt-2 text-xs text-forest-700/50 dark:text-sand-100/40">Demo only. No real investment is made and no returns are guaranteed.</p>
          <Button variant="plum" className="w-full mt-4" onClick={invest}>Confirm commitment</Button>
        </>)}
      </Modal>
    </div>
  );
}
