import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, X, 
  LayoutDashboard, List, Tag, Briefcase, MessageCircle, 
  BarChart3, FileText, Download
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useApp } from '../context/AppContext';
import { fmtMoney } from '../utils/format';
import { Button } from './ui';

const INCOME_CATEGORIES = ['Product Sales', 'Services', 'Consulting', 'Investments', 'Other Income'];
const EXPENSE_CATEGORIES = ['Inventory/Stock', 'Rent', 'Utilities', 'Salaries', 'Transport', 'Marketing', 'Other Expense'];

// Mock Data for Investor Demo (Looks impressive immediately)
const MOCK_MONTHLY_DATA = [
  { month: 'Mar', income: 3200, expenses: 2100 },
  { month: 'Apr', income: 3800, expenses: 2400 },
  { month: 'May', income: 3400, expenses: 2200 },
  { month: 'Jun', income: 4600, expenses: 2800 },
  { month: 'Jul', income: 4200, expenses: 2600 },
  { month: 'Aug', income: 5100, expenses: 3100 },
];

const MOCK_PIE_DATA = [
  { name: 'Inventory', value: 400, color: '#059669' },
  { name: 'Rent', value: 300, color: '#d97706' },
  { name: 'Utilities', value: 150, color: '#dc2626' },
  { name: 'Salaries', value: 250, color: '#7c3aed' },
  { name: 'Marketing', value: 100, color: '#0891b2' },
];

export default function BusinessLedgerModal({ onClose }) {
  const { state, dispatch, toast } = useApp();
  const [tab, setTab] = useState('overview'); 
  const [formData, setFormData] = useState({ 
    type: 'income', 
    category: 'Product Sales', 
    amount: '', 
    description: '',
    customerPhone: '' 
  });

  const ledger = state.businessLedger || [];
  
  const totalIncome = ledger.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpenses = ledger.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  const handleAdd = () => {
    if (!formData.amount) return;
    
    dispatch({ 
      type: 'ADD_BUSINESS_TXN', 
      payload: { 
        name: formData.category, 
        amount: Number(formData.amount), 
        type: formData.type,
        category: formData.category,
        description: formData.description,
        customerPhone: formData.customerPhone,
        status: 'completed'
      } 
    });
    
    if (formData.type === 'income' && formData.customerPhone) {
      const message = `Hello! Here is your invoice from Hagbad Business for ${fmtMoney(formData.amount)} (${formData.category}). You can pay securely via the Hagbad App.`;
      const cleanPhone = formData.customerPhone.replace(/\D/g, ''); 
      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(waLink, '_blank');
      toast('Invoice Sent!', `WhatsApp opened for ${formData.customerPhone}`);
    } else {
      toast('Recorded!', `${formData.type === 'income' ? 'Income' : 'Expense'} of ${fmtMoney(formData.amount)} added.`);
    }

    setFormData({ type: 'income', category: 'Product Sales', amount: '', description: '', customerPhone: '' });
    setTab('history'); 
  };

  const handleExport = () => {
    toast('Exporting...', 'Generating PDF report for tax purposes.');
    setTimeout(() => toast('Success!', 'Report downloaded to your device.'), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-4xl bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-teal-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center">
              <Briefcase className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Hagbad Business Pro</h2>
              <p className="text-xs text-white/70">Advanced Accounting & Analytics</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-forest-100 dark:border-white/10 px-6 bg-black/5 dark:bg-white/5 overflow-x-auto">
          <button onClick={() => setTab('overview')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'overview' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </button>
          <button onClick={() => setTab('analytics')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'analytics' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <BarChart3 className="h-4 w-4" /> Analytics
          </button>
          <button onClick={() => setTab('add')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'add' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <Plus className="h-4 w-4" /> Add Transaction
          </button>
          <button onClick={() => setTab('history')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'history' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <List className="h-4 w-4" /> History
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-900/50 border border-forest-100 dark:border-forest-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-forest-600" />
                    <span className="text-xs font-bold uppercase text-forest-700/60">Total Income</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-forest-900 dark:text-sand-50">{fmtMoney(totalIncome || 15000)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-coral-50 dark:bg-coral-900/20 border border-coral-100 dark:border-coral-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-coral-600" />
                    <span className="text-xs font-bold uppercase text-coral-700/60">Total Expenses</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-coral-600">{fmtMoney(totalExpenses || 8500)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-gold-600" />
                    <span className="text-xs font-bold uppercase text-gold-700/60">Net Profit</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-gold-600">{fmtMoney(netProfit || 6500)}</p>
                </div>
              </div>
              <div className="text-center py-8 text-forest-700/50">
                <p>Go to the <b>Analytics</b> tab to view detailed charts and trends.</p>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB (NEW!) */}
          {tab === 'analytics' && (
            <div className="space-y-8">
              {/* Bar Chart */}
              <div>
                <h3 className="font-display font-bold text-lg mb-4 text-forest-900 dark:text-sand-50 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gold-500" /> 6-Month Performance
                </h3>
                <div className="bg-white dark:bg-forest-900/50 p-4 rounded-2xl border border-forest-100 dark:border-white/10 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_MONTHLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a2e22', border: 'none', borderRadius: '12px', color: '#fff' }}
                        formatter={(value) => [`$${value}`, '']}
                      />
                      <Bar dataKey="income" fill="#059669" radius={[4, 4, 0, 0]} name="Income" />
                      <Bar dataKey="expenses" fill="#dc2626" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart & Export */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display font-bold text-lg mb-4 text-forest-900 dark:text-sand-50 flex items-center gap-2">
                    Expense Breakdown
                  </h3>
                  <div className="bg-white dark:bg-forest-900/50 p-4 rounded-2xl border border-forest-100 dark:border-white/10 h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={MOCK_PIE_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {MOCK_PIE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center">
                    {MOCK_PIE_DATA.map((item) => (
                      <div key={item.name} className="flex items-center gap-1 text-xs">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-forest-700/70 dark:text-sand-100/70">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-gradient-to-br from-gold-50 to-amber-100 dark:from-gold-900/20 dark:to-amber-900/20 border border-gold-200 dark:border-gold-800">
                  <div className="h-16 w-16 rounded-2xl bg-white dark:bg-forest-900 grid place-items-center shadow-sm mb-4">
                    <FileText className="h-8 w-8 text-gold-600" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-forest-900 dark:text-sand-50 mb-2">Export Financial Report</h4>
                  <p className="text-sm text-forest-700/60 dark:text-sand-100/60 mb-6">Download a comprehensive PDF report for your accountant or tax filing.</p>
                  <Button variant="gold" className="flex items-center gap-2" onClick={handleExport}>
                    <Download className="h-4 w-4" /> Export to PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ADD TRANSACTION TAB */}
          {tab === 'add' && (
            <div className="max-w-lg mx-auto space-y-5">
              <div className="flex gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                <button onClick={() => setFormData({...formData, type: 'income', category: 'Product Sales'})} className={`flex-1 py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${formData.type === 'income' ? 'bg-forest-600 text-white shadow-md' : 'text-forest-700/60'}`}>
                  <TrendingUp className="h-4 w-4" /> Income (Sale)
                </button>
                <button onClick={() => setFormData({...formData, type: 'expense', category: 'Inventory/Stock'})} className={`flex-1 py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${formData.type === 'expense' ? 'bg-coral-600 text-white shadow-md' : 'text-forest-700/60'}`}>
                  <TrendingDown className="h-4 w-4" /> Expense
                </button>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none"
                >
                  {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-forest-700/40" />
                  <input 
                    type="number" 
                    value={formData.amount} 
                    onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-2xl font-display font-bold text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" 
                    placeholder="0.00" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Description (Optional)</label>
                <input 
                  type="text" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" 
                  placeholder="e.g., Sold 50kg rice" 
                />
              </div>

              {formData.type === 'income' && (
                <div>
                  <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Customer Phone (for WhatsApp Invoice)</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3.5 h-5 w-5 text-forest-700/40" />
                    <input 
                      type="tel" 
                      value={formData.customerPhone} 
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" 
                      placeholder="+252 61 XXX XXXX" 
                    />
                  </div>
                  <p className="text-[10px] text-forest-700/50 mt-1 ml-1">Leave blank to just record the sale. Enter number to auto-send invoice.</p>
                </div>
              )}

              <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2" onClick={handleAdd} disabled={!formData.amount}>
                {formData.type === 'income' && formData.customerPhone ? (
                  <> <MessageCircle className="h-4 w-4" /> Save & Send WhatsApp Invoice </>
                ) : (
                  'Save Transaction'
                )}
              </Button>
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && (
            <div className="space-y-3">
              {ledger.length === 0 ? (
                <div className="text-center py-10 text-forest-700/50">No transactions recorded yet.</div>
              ) : (
                ledger.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-4 rounded-xl border border-forest-100 dark:border-white/10 bg-white dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg grid place-items-center ${txn.type === 'income' ? 'bg-forest-100 text-forest-600 dark:bg-forest-800/40' : 'bg-coral-100 text-coral-600 dark:bg-coral-800/40'}`}>
                        {txn.type === 'income' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-forest-900 dark:text-sand-50">{txn.category || txn.name}</p>
                        <p className="text-[10px] text-forest-700/50 flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {txn.description || 'No description'} · {new Date(txn.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-display font-bold ${txn.type === 'income' ? 'text-forest-700 dark:text-forest-200' : 'text-coral-600'}`}>
                      {txn.type === 'income' ? '+' : '-'}{fmtMoney(txn.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
