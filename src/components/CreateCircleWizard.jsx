import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Link as LinkIcon, Copy, Check, ArrowRight, ArrowLeft, Users, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge } from './ui';
import { uid } from '../utils/ids';

export default function CreateCircleWizard({ onClose }) {
  const { state, dispatch, toast } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', 
    amount: '', 
    frequency: 'Monthly', 
    rule: 'random' 
  });
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const newGroup = {
      id: uid('grp'),
      name: formData.name,
      contribution: Number(formData.amount),
      frequency: formData.frequency,
      members: [state.profile.phone],
      memberLimit: 10,
      leader: state.profile.name,
      treasurer: state.profile.name,
      payPref: 'Mobile Money',
      feePct: 2,
    };
    dispatch({ type: 'ADD_GROUP', group: newGroup });
    toast('Circle Created!', `Invite members to start ${formData.name}`);
    onClose();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://hagbad.app/join/${uid('inv')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-lg bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header with Progress */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-forest-900 dark:text-sand-50">
              {step === 1 ? 'Circle Details' : step === 2 ? 'Invite Members' : 'Set Rules'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
              <X className="h-5 w-5 text-forest-700/60" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= i ? 'bg-gold-500' : 'bg-black/10 dark:bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 pb-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1 block text-forest-800 dark:text-sand-100">Circle Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3.5 h-5 w-5 text-forest-700/40" />
                  <input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" 
                    placeholder="e.g., Family Support 2026" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block text-forest-800 dark:text-sand-100">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-forest-700/40" />
                    <input 
                      type="number" 
                      value={formData.amount} 
                      onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" 
                      placeholder="100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-forest-800 dark:text-sand-100">Frequency</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-forest-700/40" />
                    <select 
                      value={formData.frequency} 
                      onChange={(e) => setFormData({...formData, frequency: e.target.value})} 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none appearance-none"
                    >
                      <option>Weekly</option>
                      <option>Bi-weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-2" variant="gold" onClick={() => setStep(2)} disabled={!formData.name || !formData.amount}>
                Next: Invite Members <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-forest-700/70 dark:text-sand-100/70">Share this link with your trusted community members via WhatsApp or SMS.</p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-forest-200 dark:border-white/10">
                <LinkIcon className="h-4 w-4 text-forest-700/60" />
                <span className="flex-1 text-sm font-mono truncate text-forest-900 dark:text-sand-50">https://hagbad.app/join/xyz123</span>
                <button onClick={copyLink} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition">
                  {copied ? <Check className="h-4 w-4 text-forest-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                <Button className="flex-1" variant="gold" onClick={() => setStep(3)}>Next: Rules <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-forest-700/70 dark:text-sand-100/70">How should the payout order be decided?</p>
              <div className="space-y-3">
                <button onClick={() => setFormData({...formData, rule: 'random'})} className={`w-full text-left p-4 rounded-xl border-2 transition ${formData.rule === 'random' ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' : 'border-forest-100 dark:border-white/10'}`}>
                  <p className="font-semibold text-forest-900 dark:text-sand-50">Random Draw 🎲</p>
                  <p className="text-xs text-forest-700/60 dark:text-sand-100/50 mt-1">A random member is selected to receive the pot each round.</p>
                </button>
                <button onClick={() => setFormData({...formData, rule: 'fixed'})} className={`w-full text-left p-4 rounded-xl border-2 transition ${formData.rule === 'fixed' ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' : 'border-forest-100 dark:border-white/10'}`}>
                  <p className="font-semibold text-forest-900 dark:text-sand-50">Fixed Order 📋</p>
                  <p className="text-xs text-forest-700/60 dark:text-sand-100/50 mt-1">Members agree on a predetermined payout sequence.</p>
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                <Button variant="gold" className="flex-1" onClick={handleCreate}>Create Circle 🎉</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
