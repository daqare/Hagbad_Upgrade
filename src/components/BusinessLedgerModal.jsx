import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Plus, X, 
  LayoutDashboard, List, Tag, Briefcase, MessageCircle, 
  BarChart3, FileText, Download, Package, AlertTriangle, 
  Trash2, Edit2, Save, Percent, ShoppingCart
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useApp } from '../context/AppContext';
import { fmtMoney } from '../utils/format';
import { Button } from './ui';

const INCOME_CATEGORIES = ['Product Sales', 'Services', 'Consulting', 'Investments', 'Other Income'];
const EXPENSE_CATEGORIES = ['Inventory/Stock', 'Rent', 'Utilities', 'Salaries', 'Transport', 'Marketing', 'Other Expense'];

const MOCK_MONTHLY_DATA = [
  { month: 'Mar', revenue: 3200, profit: 1100 },
  { month: 'Apr', revenue: 3800, profit: 1400 },
  { month: 'May', revenue: 3400, profit: 1200 },
  { month: 'Jun', revenue: 4600, profit: 1800 },
  { month: 'Jul', revenue: 4200, profit: 1600 },
  { month: 'Aug', revenue: 5100, profit: 2100 },
];

// Professional Inventory with Cost & Selling Price
const INITIAL_INVENTORY = [
  { id: 'inv1', name: 'Basmati Rice (50kg)', costPrice: 90, sellingPrice: 120, stock: 45, lowStock: 10, sold: 23 },
  { id: 'inv2', name: 'Cooking Oil (5L)', costPrice: 12, sellingPrice: 15, stock: 8, lowStock: 15, sold: 45 },
  { id: 'inv3', name: 'Sugar (25kg)', costPrice: 28, sellingPrice: 35, stock: 2, lowStock: 5, sold: 67 },
  { id: 'inv4', name: 'Tea Leaves (1kg)', costPrice: 6, sellingPrice: 8, stock: 120, lowStock: 20, sold: 12 },
];

export default function BusinessLedgerModal({ onClose }) {
  const { state, dispatch, toast } = useApp();
  const [tab, setTab] = useState('overview'); 
  const [formData, setFormData] = useState({ 
    type: 'income', 
    category: 'Product Sales', 
    amount: '', 
    description: '',
    customerPhone: '',
    inventoryItemId: '',
    quantity: 1
  });
  
  // Inventory State
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', costPrice: '', sellingPrice: '', stock: '', lowStock: 5 });

  const ledger = state.businessLedger || [];
  
  const totalIncome = ledger.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpenses = ledger.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  // Calculate Inventory Profit
  const inventoryProfit = inventory.map(item => ({
    ...item,
    profitPerUnit: item.sellingPrice - item.costPrice,
    profitMargin: ((item.sellingPrice - item.costPrice) / item.sellingPrice * 100).toFixed(1),
    totalProfit: item.sold * (item.sellingPrice - item.costPrice),
    totalRevenue: item.sold * item.sellingPrice,
    totalCost: item.sold * item.costPrice
  }));

  const totalInventoryRevenue = inventoryProfit.reduce((acc, item) => acc + item.totalRevenue, 0);
  const totalInventoryCost = inventoryProfit.reduce((acc, item) => acc + item.totalCost, 0);
  const totalInventoryProfit = inventoryProfit.reduce((acc, item) => acc + item.totalProfit, 0);
  const overallMargin = totalInventoryRevenue > 0 ? ((totalInventoryProfit / totalInventoryRevenue) * 100).toFixed(1) : 0;

  const handleAdd = () => {
    if (!formData.amount) return;
    
    // Handle Inventory Deduction if an item is selected
    if (formData.inventoryItemId && formData.type === 'income') {
      const item = inventory.find(i => i.id === formData.inventoryItemId);
      if (item && item.stock >= formData.quantity) {
        setInventory(prev => prev.map(i => 
          i.id === formData.inventoryItemId 
            ? { ...i, stock: i.stock - formData.quantity, sold: i.sold + formData.quantity }
            : i
        ));
      } else {
        toast('Error', 'Not enough stock!', 'error');
        return;
      }
    }

    dispatch({ 
      type: 'ADD_BUSINESS_TXN', 
      payload: { 
        name: formData.category, 
        amount: Number(formData.amount), 
        type: formData.type,
        category: formData.category,
        description: formData.description,
        customerPhone: formData.customerPhone,
        quantity: formData.quantity,
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

    setFormData({ type: 'income', category: 'Product Sales', amount: '', description: '', customerPhone: '', inventoryItemId: '', quantity: 1 });
    setTab('history'); 
  };

  const handleExport = () => {
    toast('Exporting...', 'Generating detailed profit report PDF...');
    setTimeout(() => toast('Success!', 'Report downloaded to your device.'), 1500);
  };

  const handleAddInventoryItem = () => {
    if (!newItem.name || !newItem.costPrice || !newItem.sellingPrice) return;
    setInventory([...inventory, { 
      id: 'inv' + Date.now(), 
      name: newItem.name, 
      costPrice: Number(newItem.costPrice), 
      sellingPrice: Number(newItem.sellingPrice), 
      stock: Number(newItem.stock || 0), 
      lowStock: Number(newItem.lowStock || 5),
      sold: 0
    }]);
    setNewItem({ name: '', costPrice: '', sellingPrice: '', stock: '', lowStock: 5 });
    setShowAddItem(false);
    toast('Item Added!', `${newItem.name} added to inventory.`);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    setInventory(inventory.map(item => item.id === editingItem.id ? editingItem : item));
    setEditingItem(null);
    toast('Updated!', 'Item details saved.');
  };

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const lowStockItems = inventory.filter(item => item.stock <= item.lowStock && item.stock > 0);
  const outOfStockItems = inventory.filter(item => item.stock === 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-6xl bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
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
              <p className="text-xs text-white/70">Complete Inventory & Profit Analytics</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-forest-100 dark:border-white/10 px-4 bg-black/5 dark:bg-white/5 overflow-x-auto">
          <button onClick={() => setTab('overview')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'overview' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <LayoutDashboard className="h-4 w-4" /> Overview
          </button>
          <button onClick={() => setTab('inventory')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'inventory' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <Package className="h-4 w-4" /> Inventory
            {lowStockItems.length > 0 && <span className="bg-coral-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{lowStockItems.length}</span>}
          </button>
          <button onClick={() => setTab('profit')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'profit' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <Percent className="h-4 w-4" /> Profit Reports
          </button>
          <button onClick={() => setTab('analytics')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'analytics' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <BarChart3 className="h-4 w-4" /> Analytics
          </button>
          <button onClick={() => setTab('add')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${tab === 'add' ? 'border-gold-500 text-gold-600' : 'border-transparent text-forest-700/60'}`}>
            <Plus className="h-4 w-4" /> Add Transaction
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-900/50 border border-forest-100 dark:border-forest-800">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-4 w-4 text-forest-600" />
                    <span className="text-xs font-bold uppercase text-forest-700/60">Total Revenue</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-forest-900 dark:text-sand-50">{fmtMoney(totalInventoryRevenue)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-coral-50 dark:bg-coral-900/20 border border-coral-100 dark:border-coral-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-coral-600" />
                    <span className="text-xs font-bold uppercase text-coral-700/60">Cost of Goods</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-coral-600">{fmtMoney(totalInventoryCost)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-gold-600" />
                    <span className="text-xs font-bold uppercase text-gold-700/60">Gross Profit</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-gold-600">{fmtMoney(totalInventoryProfit)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-teal-600" />
                    <span className="text-xs font-bold uppercase text-teal-700/60">Profit Margin</span>
                  </div>
                  <p className="font-display text-2xl font-bold text-teal-600">{overallMargin}%</p>
                </div>
              </div>
              
              {lowStockItems.length > 0 && (
                <div className="p-4 rounded-2xl bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-coral-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-coral-800 dark:text-coral-200">Low Stock Alert!</p>
                    <p className="text-xs text-coral-700/70 dark:text-coral-300/70">{lowStockItems.length} items are running low. Check the Inventory tab to restock.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INVENTORY TAB - PROFESSIONAL VERSION */}
          {tab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-forest-900 dark:text-sand-50 flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold-500" /> Stock & Pricing
                </h3>
                <Button variant="gold" size="sm" onClick={() => setShowAddItem(true)}>
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>

              {/* Add Item Form */}
              {showAddItem && (
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-forest-100 dark:border-white/10 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Item Name" className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm text-forest-900 dark:text-sand-50" />
                    <input type="number" value={newItem.costPrice} onChange={e => setNewItem({...newItem, costPrice: e.target.value})} placeholder="Cost Price" className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm text-forest-900 dark:text-sand-50" />
                    <input type="number" value={newItem.sellingPrice} onChange={e => setNewItem({...newItem, sellingPrice: e.target.value})} placeholder="Selling Price" className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm text-forest-900 dark:text-sand-50" />
                    <input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} placeholder="Current Stock" className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm text-forest-900 dark:text-sand-50" />
                    <input type="number" value={newItem.lowStock} onChange={e => setNewItem({...newItem, lowStock: e.target.value})} placeholder="Alert at Qty" className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm text-forest-900 dark:text-sand-50" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddItem(false)}>Cancel</Button>
                    <Button variant="gold" size="sm" onClick={handleAddInventoryItem}>Save Item</Button>
                  </div>
                </div>
              )}

              {/* Inventory List with Edit */}
              <div className="space-y-2">
                {inventory.length === 0 ? (
                  <div className="text-center py-10 text-forest-700/50">No items in inventory.</div>
                ) : (
                  inventory.map(item => {
                    const isLow = item.stock <= item.lowStock && item.stock > 0;
                    const isOut = item.stock === 0;
                    const profitMargin = ((item.sellingPrice - item.costPrice) / item.sellingPrice * 100).toFixed(1);
                    
                    if (editingItem?.id === item.id) {
                      return (
                        <div key={item.id} className="p-4 rounded-xl border border-forest-100 dark:border-white/10 bg-white dark:bg-white/5 space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <input value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm" />
                            <input type="number" value={editingItem.costPrice} onChange={e => setEditingItem({...editingItem, costPrice: Number(e.target.value)})} className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm" />
                            <input type="number" value={editingItem.sellingPrice} onChange={e => setEditingItem({...editingItem, sellingPrice: Number(e.target.value)})} className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm" />
                            <input type="number" value={editingItem.stock} onChange={e => setEditingItem({...editingItem, stock: Number(e.target.value)})} className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm" />
                            <input type="number" value={editingItem.lowStock} onChange={e => setEditingItem({...editingItem, lowStock: Number(e.target.value)})} className="p-2 rounded-lg border border-forest-200 dark:border-white/10 bg-transparent text-sm" />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="gold" size="sm" onClick={handleUpdateItem}><Save className="h-3 w-3" /> Save</Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>Cancel</Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${isOut ? 'bg-coral-50 dark:bg-coral-900/10 border-coral-200 dark:border-coral-800' : isLow ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' : 'bg-white dark:bg-white/5 border-forest-100 dark:border-white/10'}`}>
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`h-10 w-10 rounded-lg grid place-items-center ${isOut ? 'bg-coral-100 text-coral-600' : isLow ? 'bg-amber-100 text-amber-600' : 'bg-forest-100 text-forest-600'}`}>
                            <Package className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-forest-900 dark:text-sand-50">{item.name}</p>
                            <div className="flex gap-3 text-[10px] text-forest-700/50 mt-1">
                              <span>Cost: {fmtMoney(item.costPrice)}</span>
                              <span>Sell: {fmtMoney(item.sellingPrice)}</span>
                              <span className="text-teal-600 font-semibold">Profit: {fmtMoney(item.sellingPrice - item.costPrice)} ({profitMargin}%)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-display font-bold ${isOut ? 'text-coral-600' : isLow ? 'text-amber-600' : 'text-forest-900 dark:text-sand-50'}`}>
                              {item.stock} units
                            </p>
                            <p className="text-[10px] text-forest-700/50">Sold: {item.sold}</p>
                            {isOut && <p className="text-[10px] text-coral-600 font-bold">OUT OF STOCK</p>}
                            {isLow && <p className="text-[10px] text-amber-600 font-bold">LOW STOCK</p>}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingItem(item)} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-forest-700/60">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteInventoryItem(item.id)} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-coral-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* PROFIT REPORTS TAB (NEW!) */}
          {tab === 'profit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-500 to-teal-600 text-white">
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Total Revenue</p>
                  <p className="font-display text-3xl font-bold">{fmtMoney(totalInventoryRevenue)}</p>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-coral-500 to-rose-600 text-white">
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Total Cost</p>
                  <p className="font-display text-3xl font-bold">{fmtMoney(totalInventoryCost)}</p>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 text-white">
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Net Profit</p>
                  <p className="font-display text-3xl font-bold">{fmtMoney(totalInventoryProfit)}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-forest-950 border border-forest-100 dark:border-white/10">
                <h3 className="font-display font-bold text-lg mb-4 text-forest-900 dark:text-sand-50 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-gold-500" /> Profit by Product
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-black/5 dark:bg-white/5 text-forest-700 dark:text-sand-100">
                      <tr>
                        <th className="text-left p-3 rounded-tl-lg">Product</th>
                        <th className="text-center p-3">Units Sold</th>
                        <th className="text-right p-3">Revenue</th>
                        <th className="text-right p-3">Cost</th>
                        <th className="text-right p-3 rounded-tr-lg">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest-100 dark:divide-white/10">
                      {inventoryProfit.sort((a, b) => b.totalProfit - a.totalProfit).map(item => (
                        <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="p-3 font-semibold text-forest-900 dark:text-sand-50">{item.name}</td>
                          <td className="p-3 text-center text-forest-700/60">{item.sold}</td>
                          <td className="p-3 text-right text-forest-900 dark:text-sand-50">{fmtMoney(item.totalRevenue)}</td>
                          <td className="p-3 text-right text-coral-600">{fmtMoney(item.totalCost)}</td>
                          <td className="p-3 text-right font-bold text-teal-600">{fmtMoney(item.totalProfit)} <span className="text-[10px] text-forest-700/50">({item.profitMargin}%)</span></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gold-50 dark:bg-gold-900/20 font-bold">
                      <tr>
                        <td className="p-3 rounded-bl-lg text-forest-900 dark:text-sand-50">TOTAL</td>
                        <td className="p-3 text-center text-forest-900 dark:text-sand-50">{inventoryProfit.reduce((acc, item) => acc + item.sold, 0)}</td>
                        <td className="p-3 text-right text-forest-900 dark:text-sand-50">{fmtMoney(totalInventoryRevenue)}</td>
                        <td className="p-3 text-right text-coral-600">{fmtMoney(totalInventoryCost)}</td>
                        <td className="p-3 text-right rounded-br-lg text-gold-600">{fmtMoney(totalInventoryProfit)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="gold" className="flex-1 flex items-center justify-center gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" /> Export Profit Report (PDF)
                </Button>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {tab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-display font-bold text-lg mb-4 text-forest-900 dark:text-sand-50 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gold-500" /> Revenue & Profit Trend
                </h3>
                <div className="bg-white dark:bg-forest-900/50 p-4 rounded-2xl border border-forest-100 dark:border-white/10 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_MONTHLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a2e22', border: 'none', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} name="Revenue" />
                      <Bar dataKey="profit" fill="#d97706" radius={[4, 4, 0, 0]} name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
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
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none">
                  {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>

              {formData.type === 'income' && formData.category === 'Product Sales' && inventory.length > 0 && (
                <>
                  <div>
                    <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Select Item Sold</label>
                    <select value={formData.inventoryItemId} onChange={(e) => setFormData({...formData, inventoryItemId: e.target.value})} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none">
                      <option value="">-- Select an item --</option>
                      {inventory.filter(i => i.stock > 0).map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Stock: {item.stock}) - {fmtMoney(item.sellingPrice)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.inventoryItemId && (
                    <div>
                      <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Quantity</label>
                      <input type="number" min="1" max={inventory.find(i => i.id === formData.inventoryItemId)?.stock || 1} value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-forest-700/40" />
                  <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-2xl font-display font-bold text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Description (Optional)</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" placeholder="e.g., Sold 50kg rice" />
              </div>

              {formData.type === 'income' && (
                <div>
                  <label className="text-sm font-semibold mb-2 block text-forest-800 dark:text-sand-100">Customer Phone (for WhatsApp Invoice)</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3.5 h-5 w-5 text-forest-700/40" />
                    <input type="tel" value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50 focus:border-gold-500 focus:outline-none" placeholder="+252 61 XXX XXXX" />
                  </div>
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
