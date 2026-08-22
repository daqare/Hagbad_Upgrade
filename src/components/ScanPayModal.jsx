import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, CheckCircle, X, Zap, Flashlight, Image } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmtMoney } from '../utils/format';
import { Button } from './ui';

export default function ScanPayModal({ onClose }) {
  const { state, dispatch, toast } = useApp();
  const [step, setStep] = useState('camera'); // 'camera', 'amount', 'success'
  const [amount, setAmount] = useState('');
  const [scanning, setScanning] = useState(false);
  
  // Mock Merchant Data
  const merchant = {
    name: 'Hodan Supermarket',
    id: 'HOD-9921',
    category: 'Groceries & Retail'
  };

  const simulateScan = () => {
    setScanning(true);
    // Simulate camera finding a QR code
    setTimeout(() => {
      setScanning(false);
      setStep('amount');
    }, 2000);
  };

  const handlePay = () => {
    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) {
      toast('Invalid Amount', 'Please enter a valid amount.', 'error');
      return;
    }
    if (payAmount > state.wallet.balance) {
      toast('Insufficient Funds', 'Please top up your wallet.', 'error');
      return;
    }

    // Process Transaction
    dispatch({ type: 'WALLET', payload: { balance: +(state.wallet.balance - payAmount).toFixed(2) } });
    dispatch({ 
      type: 'ADD_TXN', 
      txn: { 
        id: 'scan-' + Date.now(), 
        type: 'QR Payment', 
        amount: -payAmount, 
        provider: merchant.name, 
        date: new Date().toISOString(), 
        ref: 'QR-' + Math.floor(Math.random() * 9999), 
        status: 'success' 
      } 
    });
    
    toast('Payment Successful!', `Sent ${fmtMoney(payAmount)} to ${merchant.name}`);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-forest-950 rounded-3xl shadow-2xl overflow-hidden relative border border-white/10"
        style={{ height: '600px' }}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition z-20">
          <X className="h-5 w-5 text-white" />
        </button>

        {/* CAMERA VIEWFINDER (Step 1) */}
        {step === 'camera' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            {/* Mock Camera Background */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80')] bg-cover bg-center" />
            
            {/* Scanning Animation */}
            <div className="relative z-10 w-64 h-64 border-2 border-white/30 rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-500 shadow-[0_0_15px_rgba(251,191,36,1)] animate-[scan_2s_ease-in-out_infinite]" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold-500 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold-500 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold-500 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold-500 rounded-br-xl" />
            </div>

            <p className="relative z-10 mt-8 text-white font-semibold text-lg">
              {scanning ? 'Scanning QR Code...' : 'Point camera at QR code'}
            </p>
            <p className="relative z-10 mt-2 text-white/60 text-sm">
              {scanning ? 'Processing...' : 'Align code within the frame'}
            </p>

            {/* Camera Controls */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 z-10">
              <button className="p-4 rounded-full bg-white/10 text-white"><Image className="h-6 w-6" /></button>
              <button 
                onClick={simulateScan} 
                disabled={scanning}
                className="p-6 rounded-full bg-gold-500 text-forest-900 shadow-lg hover:bg-gold-400 transition disabled:opacity-50"
              >
                <Camera className="h-8 w-8" />
              </button>
              <button className="p-4 rounded-full bg-white/10 text-white"><Flashlight className="h-6 w-6" /></button>
            </div>
          </div>
        )}

        {/* AMOUNT INPUT (Step 2) */}
        {step === 'amount' && (
          <div className="absolute inset-0 bg-forest-950 p-8 flex flex-col">
            <div className="text-center mt-12 mb-8">
              <div className="h-16 w-16 mx-auto rounded-full bg-teal-500/20 grid place-items-center mb-4">
                <QrCode className="h-8 w-8 text-teal-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">{merchant.name}</h2>
              <p className="text-sm text-white/60 mt-1">{merchant.category} • ID: {merchant.id}</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <label className="text-sm font-semibold text-white/60 mb-2 block text-center">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-1/2 -translate-x-1/2 top-2 text-3xl text-white/40 font-bold">$</span>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  autoFocus
                  className="w-full text-center bg-transparent text-6xl font-display font-extrabold text-white focus:outline-none pt-4" 
                  placeholder="0.00" 
                />
              </div>
              <p className="text-center text-white/40 text-sm mt-4">Available: {fmtMoney(state.wallet.balance)}</p>
            </div>

            <Button variant="gold" size="lg" className="w-full text-lg font-bold" onClick={handlePay} disabled={!amount}>
              Pay {amount ? fmtMoney(parseFloat(amount)) : '$0.00'}
            </Button>
          </div>
        )}

        {/* SUCCESS STATE (Step 3) */}
        {step === 'success' && (
          <div className="absolute inset-0 bg-forest-950 p-8 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: 'spring', damping: 10 }}
              className="h-24 w-24 rounded-full bg-teal-500/20 grid place-items-center mb-6"
            >
              <CheckCircle className="h-12 w-12 text-teal-400" />
            </motion.div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Payment Sent!</h2>
            <p className="text-white/60 mb-8">Successfully paid {merchant.name}</p>
            
            <div className="w-full bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
              <div className="flex justify-between mb-3">
                <span className="text-white/60 text-sm">Amount Paid</span>
                <span className="text-white font-bold text-lg">{fmtMoney(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-white/60 text-sm">Service Fee (Ujrah)</span>
                <span className="text-white font-bold">{fmtMoney(parseFloat(amount) * 0.015)}</span>
              </div>
              <div className="h-px bg-white/10 my-3" />
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Transaction ID</span>
                <span className="text-gold-400 font-mono text-sm">QR-{Math.floor(Math.random() * 9999)}</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full !border-white/20 !text-white" onClick={onClose}>
              Done
            </Button>
          </div>
        )}
      </motion.div>
      
      {/* CSS for scanning animation */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
