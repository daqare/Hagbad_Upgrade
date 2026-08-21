import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, CheckCircle2, Loader2, FileText, Share2 } from 'lucide-react';
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
  const [receiptData, setReceiptData] = useState(null);
  
  const amount = parseFloat(formData.amount) || 0;
  const fee = amount > 0 ? Math.max(0.50, Math.min(5.00, amount * 0.015)) : 0;
  const total = amount + fee;
  const mockFxRate = 570.25; // Mock exchange rate for investor demo

  const handleSubmit = (e) => {
    e.preventDefault();
    if (total > state.wallet.balance) {
      toast('Insufficient funds', 'Please top up your wallet first.', 'error');
      return;
    }
    setStep(2);
    setTimeout(() => {
      const refId = 'HGB-' + Math.floor(Math.random() * 900000 + 100000);
      
      if (formData.type === 'p2p') {
        dispatch({ type: 'SEND_MONEY', payload: { amount, fee, recipient: formData.phone, provider: formData.provider, purpose: 'P2P Transfer', isSmartSend: false, smartCategory: '' } });
      } else if (formData.type === 'smart') {
        dispatch({ type: 'SEND_MONEY', payload: { amount, fee, recipient: formData.phone, provider: formData.provider, purpose: 'Smart Send', isSmartSend: true, smartCategory: formData.smartCategory } });
      } else {
        dispatch({ type: 'PAY_BILL', payload: { amount, provider: formData.provider, category: formData.smartCategory } });
      }
      
      setReceiptData({ refId, date: new Date().toLocaleString() });
      toast('Transfer Successful', `Sent ${fmtMoney(amount)} to ${formData.phone}`);
      setStep(3);
    }, 2000);
  };

  // --- LOADING STATE ---
  if (step === 2) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-gold-500" />
        <h3 className="mt-4 font-display text-xl font-bold text-forest-900 dark:text-sand-50">Processing Transfer...</h3>
        <p className="text-sm text-forest-700/60 mt-2">Securely connecting to {PROVIDERS.find(p => p.id === formData.provider)?.name}.</p>
      </Card>
    );
  }

  // --- SUCCESS / RECEIPT STATE (The Investor Pitch!) ---
  if (step === 3 && receiptData) {
    return (
      <Card className="p-0 max-w-md mx-auto overflow-hidden">
        {/* Receipt Header */}
        <div className="bg-gradient-to-r from-forest-900 to-teal-900 p-6 text-center text-white relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="h-14 w-14 mx-auto rounded-full bg-white/20 backdrop-blur-sm grid place-items-center mb-3">
            <CheckCircle2 className="h-8 w-8 text-gold-400" />
          </motion.div>
          <h3 className="font-display text-2xl font-bold">Transfer Successful</h3>
          <p className="text-xs text-white/70 mt-1">Transaction completed securely</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 bg-white dark:bg-forest-950">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-dashed border-forest-200 dark:border-white/10">
            <FileText className="h-4 w-4 text-forest-700/60" />
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700/60 dark:text-sand-100/50">Official Receipt</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-forest-700/60 dark:text-sand-100/50">Recipient</span>
              <span className="font-semibold text-forest-900 dark:text-sand-50">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest-700/60 dark:text-sand-100/50">Network</span>
              <span className="font-semibold text-forest-900 dark:text-sand-50">{PROVIDERS.find(p => p.id === formData.provider)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest-700/60 dark:text-sand-100/50">FX Rate (Demo)</span>
              <span className="font-semibold text-forest-900 dark:text-sand-50">1 USD = {mockFxRate} SOS</span>
            </div>
            
            <div className="pt-3 mt-3 border-t border-dashed border-forest-200 dark:border-white/10 space-y-2">
              <div className="flex justify-between text-forest-900 dark:text-sand-50">
                <span>Amount Sent</span>
                <span className="font-semibold">{fmtMoney(amount)}</span>
              </div>
              <div className="flex justify-between text-forest-700/60 dark:text-sand-100/50">
                <span>Service Fee (Ujrah)</span>
                <span className="font-semibold">{fmtMoney(fee)}</span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-forest-200 dark:border-white/10 flex justify-between items-center">
              <span className="font-bold text-forest-900 dark:text-sand-50">Total Deducted</span>
              <span className="font-display text-2xl font-extrabold text-gold-600">{fmtMoney(total)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-forest-100 dark:border-white/5 flex justify-between text-[10px] text-forest-700/40 dark:text-sand-100/30 font-mono">
            <span>Ref: {receiptData.refId}</span>
            <span>{receiptData.date}</span>
          </div>
        </div>

        {/* Receipt Footer Actions */}
        <div className="p-4 bg-black/5 dark:bg-white/5 flex gap-3">
          <Button variant="ghost" className="flex-1 flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4" /> Share Receipt
          </Button>
          <Button variant="gold" className="flex-1" onClick={() => { setStep(1); setFormData({ amount: '', phone: '', provider: 'zaad', type: 'p2p', smartCategory: '' }); }}>
            New Transfer
          </Button>
        </div>
      </Card>
    );
  }

  // --- FORM STATE ---
  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h3 className="font-display font-bold text-lg mb-4 text-forest-900 dark:text-sand-50">Send Money or Pay Bills</h3>
      
      <div className="flex gap-2 mb-6 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
        <button onClick={() => setFormData({ ...formData, type: 'p2p' })} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${formData.type === 'p2p' ? 'bg-white dark:bg-forest-900 shadow-sm text-forest-900 dark:text-sand-50' : 'text-forest-700/60'}`}>P2P Transfer</button>
        <button onClick={() => setFormData({ ...formData, type: 'smart' })} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${formData.type === 'smart' ? 'bg-white dark:bg-forest-900 shadow-sm text-forest-900 dark:text-sand-50' : 'text-forest-700/60'}`}>Smart Send</button>
        <button onClick={() => setFormData({ ...formData, type: 'bill' })} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${formData.type === 'bill' ? 'bg-white dark:bg-forest-900 shadow-sm text-forest-900 dark:text-sand-50' : 'text-forest-700/60'}`}>Pay Bills</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.type === 'bill' ? (
          <div>
            <label className="text-sm font-semibold mb-1 block text-forest-800 dark:text-sand-100">Select Bill Category</label>
            <select value={formData.smartCategory} onChange={(e) => setFormData({ ...formData, smartCategory: e.target.value })} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50" required>
              <option value="">Choose a category...</option>
              {BILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-semibold mb-1 block text-forest-800 dark:text-sand-100">Recipient Phone Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" placeholder="+252 61 XXX XXXX" required />
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
                <select value={formData.smartCategory} onChange={(e) => setFormData({ ...formData, smartCategory: e.target.value })} className="w-full mt-2 p-2 rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-forest-900 text-sm text-forest-900 dark:text-sand-50" required>
                  <option value="">Restrict to category...</option>
                  {BILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
          </>
        )}

        <div>
          <label className="text-sm font-semibold mb-1 block text-forest-800 dark:text-sand-100">Amount ({state.profile.currency})</label>
          <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-2xl font-display font-bold text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" placeholder="0.00" required />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Select Network</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROVIDERS.map((p) => (
              <button key={p.id} type="button" onClick={() => setFormData({ ...formData, provider: p.id })} className={`p-3 rounded-xl border-2 text-center transition ${formData.provider === p.id ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' : 'border-forest-100 dark:border-white/10 hover:border-gold-300'}`}>
                <div className={`h-8 w-8 mx-auto rounded-lg ${p.color} mb-2`} />
                <p className="text-xs font-bold text-forest-900 dark:text-sand-50">{p.name}</p>
              </button>
            ))}
          </div>
        </div>

        {amount > 0 && (
          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 space-y-1 text-sm">
            <div className="flex justify-between text-forest-900 dark:text-sand-50"><span>Amount</span><span>{fmtMoney(amount)}</span></div>
            <div className="flex justify-between text-forest-700/60 dark:text-sand-100/50"><span>Service Fee (Ujrah)</span><span>{fmtMoney(fee)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-black/10 dark:border-white/10 text-forest-900 dark:text-sand-50"><span>Total</span><span className="text-gold-600">{fmtMoney(total)}</span></div>
          </div>
        )}

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={total > state.wallet.balance}>
          {total > state.wallet.balance ? 'Insufficient Balance' : `Confirm & Send ${fmtMoney(total)}`}
        </Button>
      </form>
    </Card>
  );
}
