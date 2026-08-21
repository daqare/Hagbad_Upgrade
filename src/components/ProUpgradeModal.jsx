import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, X, Zap, FileText, MessageCircle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui';

export default function ProUpgradeModal({ onClose }) {
  const { dispatch, toast } = useApp();

  const handleSubscribe = () => {
    // Simulate payment processing
    dispatch({ type: 'SET_PRO', payload: true });
    toast('Welcome to Hagbad Pro!', 'Your account is now upgraded.');
    onClose();
  };

  const features = [
    { icon: MessageCircle, text: 'Automated WhatsApp & SMS Reminders' },
    { icon: FileText, text: 'One-Click PDF Financial Reports' },
    { icon: Users, text: 'Manage up to 500 Circle Members' },
    { icon: Zap, text: 'Priority Dispute Resolution' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-md bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition z-10">
          <X className="h-5 w-5 text-forest-700/60 dark:text-sand-100/60" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-gold-500 via-gold-600 to-amber-700 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm grid place-items-center mb-4 shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display text-3xl font-extrabold">Hagbad Pro</h2>
            <p className="text-sm text-white/90 mt-2 font-medium">For Circle Leaders & SACCO Admins</p>
          </div>
        </div>

        {/* Pricing & Features */}
        <div className="p-6 bg-white dark:bg-forest-950">
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-display font-extrabold text-forest-900 dark:text-sand-50">$9.99</span>
              <span className="text-forest-700/60 dark:text-sand-100/50 font-medium">/ month</span>
            </div>
            <p className="text-xs text-forest-700/50 dark:text-sand-100/40 mt-1">Cancel anytime. 7-day free trial included.</p>
          </div>

          <div className="space-y-3 mb-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 grid place-items-center shrink-0">
                  <feature.icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="text-sm font-medium text-forest-800 dark:text-sand-100">{feature.text}</span>
              </div>
            ))}
          </div>

          <Button 
            variant="gold" 
            size="lg" 
            className="w-full text-lg font-bold shadow-lg" 
            onClick={handleSubscribe}
          >
            Start 7-Day Free Trial
          </Button>
          
          <p className="text-[10px] text-center text-forest-700/40 dark:text-sand-100/30 mt-4">
            By subscribing, you agree to our Terms of Service. Demo mode: No real payment processed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
