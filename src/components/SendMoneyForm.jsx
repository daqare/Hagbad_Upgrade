import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmtMoney } from '../utils/format';
import { Button, Card } from './ui';

const PROVIDERS = [
  { id: 'evc', name: 'EVC Plus', region: 'Somalia', color: 'bg-blue-600' },
  { id: 'zaad', name: 'Zaad Service', region: 'Somaliland', color: 'bg-yellow-500' },
  { id: 'edahab', name: 'eDahab', region: 'Djibouti/Somalia', color: 'bg-orange-500' },
  { id: 'mpesa', name: 'M-Pesa', region: 'Kenya', color: 'bg-green-600' },
];

const BILL_CATEGORIES = ['Mobile Airtime', 'Electricity (BEPCO)', 'Water', 'Internet'];

export default function SendMoneyForm() {
  const { state, dispatch, toast } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    amount: '', 
    phone: '', 
    provider: 'zaad', 
    type: 'p2p', 
    smartCategory: '' 
  });
  
  const amount = parseFloat(formData.amount) || 0;
  const fee = amount > 0 ? Math.max(0.50, Math.min(5.00, amount * 0.015)) : 0;
  const total = amount + fee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (total > state.wallet.balance) {
      toast('Insufficient funds', 'Please top up your wallet first.', 'error');
      return;
    }
    setStep(2);
    setTimeout(() => {
      if (formData.type === 'p2p') {
        dispatch({ 
          type: 'SEND_MONEY', 
          payload: { 
            amount, 
            fee, 
            recipient: formData.phone, 
            provider: formData.provider, 
            purpose: 'P2P Transfer', 
            isSmartSend: false, 
            smartCategory: '' 
          } 
        });
      } else if (formData.type === 'smart') {
        dispatch({ 
          type: 'SEND_MONEY', 
          payload: { 
            amount, 
            fee, 
            recipient: formData.phone, 
            provider: formData.provider, 
            purpose: 'Smart Send', 
            isSmartSend: true, 
            smartCategory: formData.smartCategory 
          } 
        });
      } else {
        dispatch({ 
          type: 'PAY_BILL', 
          payload: { 
            amount, 
            provider: formData.provider, 
            category: formData.smartCategory 
          } 
        });
      }
      toast('Transfer Successful', `Sent ${fmtMoney(amount)} to ${formData.phone}`);
      setStep(3);
    }, 2000);
  };

  if (step === 2) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-gold-500" />
        <h3 className="mt-4 font-display text-xl font-bold">Processing Transfer...</h3>
        <p className="text-sm text-forest-700/60 mt-2">Simulating secure mobile money handshake.</p>
      </Card>
    );
  }

  if (step === 3) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="h-16 w-16 mx-auto rounded-full bg-forest-100 dark:bg-forest-800/40 grid place-items-center text-forest-600"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>
        <h3 className="mt-4 font-display text-2xl font-bold">Transfer Complete!</h3>
        <div className="mt-6 rounded-2xl border border-dashed border-forest-300 dark:border-white/20 p-5 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-forest-700/60">Amount Sent</span>
            <b>{fmtMoney(amount)}</b>
          </div>
          <div className="flex justify-between">
            <span className="text-forest-700/60">Service Fee (Ujrah)</span>
            <b>{fmtMoney(fee)}</b>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-semibold">Total Deducted</span>
            <b className="text-gold-600">{fmtMoney(total)}</b>
          </div>
          {formData.type === 'smart' && (
            <div className="flex justify-between text-teal-600">
              <span>Restricted to:</span>
              <b>{formData.smartCategory}</b>
            </div>
          )}
        </div>
        <Button 
          className="w-full mt-6" 
          variant="gold" 
          onClick={() => { 
            setStep(1); 
            setFormData({ amount: '', phone: '', provider: 'zaad', type: 'p2p', smartCategory: '' }); 
          }}
        >
          Send Another
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h3 className="font-display font-bold text-lg mb-4">Send Money or Pay Bills</h3>
      
      <div className="flex gap-2 mb-6 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
        <button 
          onClick={() => setFormData({ ...formData, type: 'p2p' })} 
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${formData.type === 'p2p' ? 'bg-white dark:bg-forest-900 shadow-sm' : 'text-forest-700/60'}`}
        >
          P2P Transfer
        </button>
        <button 
          onClick={() => setFormData({ ...formData, type: 'smart' })} 
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${formData.type === 'smart' ? 'bg-white dark:bg-forest-900 shadow-sm' : 'text-forest-700/60'}`}
        >
          Smart Send
        </button>
        <button 
          onClick={() => setFormData({ ...formData, type: 'bill' })} 
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${formData.type === 'bill' ? 'bg-white dark:bg-forest-900 shadow-sm' : 'text-forest-700/60'}`}
        >
          Pay Bills
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.type === 'bill' ? (
          <div>
            <label className="text-sm font-semibold mb-1 block">Select Bill Category</label>
            <select 
              value={formData.smartCategory} 
              onChange={(e) => setFormData({ ...formData, smartCategory: e.target.value })} 
              className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent" 
              required
            >
              <option value="">Choose a category...</option>
              {BILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-semibold mb-1 block">Recipient Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent" 
                placeholder="+252 61 XXX XXXX" 
                required 
              />
            </div>
            {formData.type === 'smart' && (
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">Smart Send Active</p>
                    <p className="text-xs text-teal-700/70 dark:text-teal-300/70">Funds can only be spent at verified partners in the selected category.</p>
                  </div>
                </div>
                <select 
                  value={formData.smartCategory} 
                  onChange={(e) => setFormData({ ...formData, smartCategory: e.target.value })} 
                  className="w-full mt-2 p-2 rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-forest-900 text-sm" 
                  required
                >
                  <option value="">Restrict to category...</option>
                  {BILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
          </>
        )}

        <div>
          <label className="text-sm font-semibold mb-1 block">Amount ({state.profile.currency})</label>
          <input 
            type="number" 
            value={formData.amount} 
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
            className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-2xl font-display font-bold" 
            placeholder="0.00" 
            required 
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Select Network</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROVIDERS.map((p) => (
              <button 
                key={p.id} 
                type="button" 
                onClick={() => setFormData({ ...formData, provider: p.id })}
                className={`p-3 rounded-xl border-2 text-center transition ${formData.provider === p.id ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' : 'border-forest-100 dark:border-white/10 hover:border-gold-300'}`}
              >
                <div className={`h-8 w-8 mx-auto rounded-lg ${p.color} mb-2`} />
                <p className="text-xs font-bold">{p.name}</p>
              </button>
            ))}
          </div>
        </div>

        {amount > 0 && (
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Amount</span>
              <span>{fmtMoney(amount)}</span>
            </div>
            <div className="flex justify-between text-forest-700/60">
              <span>Service Fee (Ujrah)</span>
              <span>{fmtMoney(fee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-black/10 dark:border-white/10">
              <span>Total</span>
              <span className="text-gold-600">{fmtMoney(total)}</span>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          variant="gold" 
          size="lg" 
          className="w-full" 
          disabled={total > state.wallet.balance}
        >
          {total > state.wallet.balance ? 'Insufficient Balance' : `Confirm & Send ${fmtMoney(total)}`}
        </Button>
      </form>
    </Card>
  );
}
