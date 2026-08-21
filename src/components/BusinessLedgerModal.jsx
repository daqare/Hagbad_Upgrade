import React, { useState } from 'react'; // MUST HAVE useState
import { motion } from 'framer-motion';
import { Plus, Send, CheckCircle, Clock, TrendingUp, X, User, DollarSign, MessageCircle } from 'lucide-react'; // MUST HAVE ALL ICONS
import { useApp } from '../context/AppContext';
import { fmtMoney } from '../utils/format';
import { Button, Card, Badge } from './ui';

export default function BusinessLedgerModal({ onClose }) {
  const { state, dispatch, toast } = useApp();
  const [tab, setTab] = useState('sales'); // 'sales' or 'debts'
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '', type: 'sale' });

  const ledger = state.businessLedger || [];
  const sales = ledger.filter(t => t.type === 'sale');
  const debts = ledger.filter(t => t.type === 'debt');
  
  const totalSales = sales.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalDebts = debts.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const handleAdd = () => {
    if (!formData.name || !formData.amount) return;
    dispatch({ 
      type: 'ADD_BUSINESS_TXN', 
      payload: { 
        name: formData.name, 
        amount: Number(formData.amount), 
        type: formData.type,
        status: formData.type === 'sale' ? 'completed' : 'pending'
      } 
    });
    toast('Recorded!', `${formData.type === 'sale' ? 'Sale' : 'Debt'} of ${fmtMoney(formData.amount)} added.`);
    setFormData({ name: '', amount: '', type: 'sale' });
    setShowForm(false);
  };

  const sendReminder = (name) => {
    toast('Reminder Sent!', `WhatsApp invoice sent to ${name}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-2xl bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-900 to-teal-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center">
              <TrendingUp className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Hagbad Business</h2>
              <p className="text-xs text-white/70">Digital Ledger & Invoicing</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-forest-100 dark:border-white/10 px-6">
          <button onClick={() => setTab('sales')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${tab === 'sales' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            Sales Today ({sales.length})
          </button>
          <button onClick={() => setTab('debts')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${tab === 'debts' ? 'border-coral-500 text-coral-600' : 'border-transparent text-forest-700/60'}`}>
            Outstanding Debts ({debts.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'sales' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-900/50 flex justify-between items-center">
                <span className="text-sm font-semibold text-forest-800 dark:text-sand-100">Total Sales Today</span>
                <span className="font-display text-2xl font-bold text-forest-900 dark:text-gold-400">{fmtMoney(totalSales)}</span>
              </div>
              {sales.length === 0 ? (
                <div className="text-center py-10 text-forest-700/50">No sales recorded today. Tap below to add one.</div>
              ) : (
                sales.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl border border-forest-100 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-forest-100 dark:bg-forest-800/40 grid place-items-center text-forest-600"><CheckCircle className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-forest-900 dark:text-sand-50">{txn.name}</p>
                        <p className="text-[10px] text-forest-700/50">{new Date(txn.date).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-forest-700 dark:text-forest-200">+{fmtMoney(txn.amount)}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-coral-50 dark:bg-coral-900/20 flex justify-between items-center">
                <span className="text-sm font-semibold text-coral-800 dark:text-coral-200">Total Outstanding (Maad)</span>
                <span className="font-display text-2xl font-bold text-coral-600">{fmtMoney(totalDebts)}</span>
              </div>
              {debts.length === 0 ? (
                <div className="text-center py-10 text-forest-700/50">No outstanding debts. Your customers are paying on time!</div>
              ) : (
                debts.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl border border-coral-100 dark:border-coral-900/30">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-coral-100 dark:bg-coral-800/40 grid place-items-center text-coral-600"><Clock className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-forest-900 dark:text-sand-50">{txn.name}</p>
                        <p className="text-[10px] text-forest-700/50">Due immediately</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-coral-600">{fmtMoney(txn.amount)}</span>
                      <button onClick={() => sendReminder(txn.name)} className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 hover:bg-teal-100 transition">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer / Add Button */}
        <div className="p-4 border-t border-forest-100 dark:border-white/10 bg-black/5 dark:bg-white/5">
          {!showForm ? (
            <Button variant="gold" className="w-full flex items-center justify-center gap-2" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Record New Sale or Debt
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2 bg-white dark:bg-forest-900 p-1 rounded-xl">
                <button onClick={() => setFormData({...formData, type: 'sale'})} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${formData.type === 'sale' ? 'bg-forest-100 text-forest-800' : 'text-forest-700/60'}`}>Sale</button>
                <button onClick={() => setFormData({...formData, type: 'debt'})} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${formData.type === 'debt' ? 'bg-coral-100 text-coral-800' : 'text-forest-700/60'}`}>Debt (Maad)</button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-forest-700/40" />
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Customer Name" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-sm" />
                </div>
                <div className="relative w-32">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-forest-700/40" />
                  <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Amount" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="gold" className="flex-1" onClick={handleAdd} disabled={!formData.name || !formData.amount}>Save Record</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
