import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HandCoins, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmtMoney } from '../utils/format';
import { Button, Card, Badge } from './ui';

export default function QardHasanModal({ onClose }) {
  const { state, dispatch, toast } = useApp();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  
  // Mock Logic: Trust Score determines borrowing limit
  const trustScore = state.trust.score;
  const maxLoan = Math.floor(trustScore * 5); 
  const isEligible = trustScore >= 600;

  const handleBorrow = () => {
    const loanAmount = parseFloat(amount);
    if (!loanAmount || loanAmount > maxLoan) {
      toast('Invalid Amount', `Please enter an amount up to ${fmtMoney(maxLoan)}`, 'error');
      return;
    }
    
    // Simulate loan disbursement by adding to wallet balance
    dispatch({ type: 'WALLET', payload: { balance: +(state.wallet.balance + loanAmount).toFixed(2) } });
    dispatch({ type: 'ADD_TXN', txn: { id: 'loan-' + Date.now(), type: 'Qard Hasan Loan', amount: loanAmount, provider: 'SACCO Pool', date: new Date().toISOString(), ref: 'QH-' + Math.floor(Math.random() * 9999), status: 'success' } });
    
    toast('Loan Disbursed!', `${fmtMoney(loanAmount)} added to your wallet.`);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-plum-900 to-forest-900 p-6 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition">
            <X className="h-5 w-5" />
          </button>
          <div className="h-12 w-12 mx-auto rounded-full bg-white/20 backdrop-blur-sm grid place-items-center mb-3">
            <HandCoins className="h-6 w-6 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-bold">Qard Hasan</h2>
          <p className="text-xs text-white/70 mt-1">Interest-Free Community Loan</p>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <>
              {/* Eligibility Check */}
              <div className={`p-4 rounded-2xl mb-6 flex items-start gap-3 ${isEligible ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800' : 'bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800'}`}>
                {isEligible ? <ShieldCheck className="h-5 w-5 text-teal-600 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-coral-600 mt-0.5" />}
                <div>
                  <p className={`text-sm font-bold ${isEligible ? 'text-teal-800 dark:text-teal-200' : 'text-coral-800 dark:text-coral-200'}`}>
                    {isEligible ? 'You are eligible!' : 'Eligibility Required'}
                  </p>
                  <p className="text-xs mt-1 text-forest-700/70 dark:text-sand-100/60">
                    {isEligible 
                      ? `Your Trust Score of ${trustScore} unlocks a borrowing limit of ${fmtMoney(maxLoan)}.` 
                      : 'Maintain a Trust Score of 600+ by making on-time Hagbad contributions to unlock loans.'}
                  </p>
                </div>
              </div>

              {isEligible && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block text-forest-800 dark:text-sand-100">Loan Amount</label>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)} 
                      className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-2xl font-display font-bold text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" 
                      placeholder={`Max: ${maxLoan}`} 
                    />
                  </div>
                  
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs space-y-1 text-forest-700/70 dark:text-sand-100/60">
                    <p className="font-bold text-forest-900 dark:text-sand-50">Repayment Terms:</p>
                    <p>• 0% Interest (Riba-free)</p>
                    <p>• Automatically deducted from your next 3 Hagbad payouts.</p>
                  </div>

                  <Button 
                    variant="gold" 
                    className="w-full" 
                    onClick={handleBorrow} 
                    disabled={!amount || parseFloat(amount) > maxLoan}
                  >
                    Request {fmtMoney(amount || 0)}
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-16 w-16 mx-auto rounded-full bg-teal-100 dark:bg-teal-800/40 grid place-items-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-teal-600" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-forest-900 dark:text-sand-50">Loan Approved!</h3>
              <p className="text-sm text-forest-700/60 mt-2 mb-6">
                {fmtMoney(amount)} has been added to your wallet. Repayment will begin automatically from your next circle payout.
              </p>
              <Button variant="gold" className="w-full" onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
