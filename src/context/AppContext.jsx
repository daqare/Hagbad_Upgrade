import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback, useRef } from 'react';
import { seedState } from '../data/seedData';
import { loadState, saveState, clearState } from '../services/storage';
import { nextEvent } from '../services/simulator';
import { uid, txnRef } from '../utils/ids';

const AppContext = createContext(null);

function trustLevel(score) {
  if (score >= 800) return 'Exceptional';
  if (score >= 700) return 'Trusted';
  if (score >= 550) return 'Established';
  return 'Building';
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET': return seedState();
    case 'SET_THEME': return { ...state, theme: action.theme };
    case 'SET_LANG': return { ...state, lang: action.lang };
    case 'AUTH': return { ...state, auth: { ...state.auth, ...action.payload } };
    case 'PROFILE': return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'TOGGLE_INVESTOR': return { ...state, meta: { ...state.meta, investorMode: !state.meta.investorMode } };
    case 'WALLET': return { ...state, wallet: { ...state.wallet, ...action.payload } };
    case 'ADD_TXN': return { ...state, transactions: [action.txn, ...state.transactions] };
    case 'ADD_NOTIFICATION': return { ...state, notifications: [action.item, ...state.notifications].slice(0, 60) };
    case 'MARK_NOTIFS_READ': return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case 'TRUST': {
      const score = Math.max(0, Math.min(900, state.trust.score + action.delta));
      return { ...state, trust: { ...state.trust, score, level: trustLevel(score), history: [...state.trust.history, { date: new Date().toISOString(), score }].slice(-24) } };
    }
    case 'ADD_SAVINGS': return { ...state, savingsAccounts: [action.account, ...state.savingsAccounts] };
    case 'UPDATE_SAVINGS': return { ...state, savingsAccounts: state.savingsAccounts.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)) };
       case 'ADD_GROUP': {
      const newGroup = {
        ...action.group,
        health: 100,
        activity: [],
        currentIndex: 0,
        rotation: action.group.members || [],
        nextPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      return { ...state, groups: [newGroup, ...state.groups] };
    }
    case 'UPDATE_GROUP': return { ...state, groups: state.groups.map((g) => (g.id === action.id ? { ...g, ...action.patch } : g)) };
    
    // --- NEW: Add a brand new group to the list ---
    case 'ADD_GROUP': {
      return { ...state, groups: [action.group, ...state.groups] };
    }
    
    case 'ADD_GROUP_ACTIVITY': return { ...state, groups: state.groups.map((g) => (g.id === action.id ? { ...g, activity: [{ date: new Date().toISOString(), text: action.text }, ...g.activity] } : g)) };
    case 'ADVANCE_ROTATION': return { ...state, groups: state.groups.map((g) => (g.id === action.id ? { ...g, currentIndex: (g.currentIndex + 1) % g.rotation.length } : g)) };
    case 'ADD_EMERGENCY': return { ...state, emergencyRequests: [action.item, ...state.emergencyRequests] };
    case 'UPDATE_EMERGENCY': return { ...state, emergencyRequests: state.emergencyRequests.map((e) => (e.id === action.id ? { ...e, ...action.patch } : e)) };
    case 'ADD_INVITATION': return { ...state, invitations: [action.item, ...state.invitations] };
    case 'ADD_CHAT': return { ...state, chat: [...state.chat, action.item] };
    case 'VOTE_POLL': return { ...state, polls: state.polls.map((p) => (p.id === action.id ? { ...p, options: p.options.map((o) => (o.id === action.opt ? { ...o, votes: o.votes + 1 } : o)) } : p)) };
    case 'INVEST': return { ...state, investments: state.investments.map((iv) => (iv.id === action.id ? { ...iv, raised: iv.raised + action.amount, investors: iv.investors + 1 } : iv)) };
    case 'SET_DASHBOARD_TAB': return { ...state, dashboardTab: action.tab };
    case 'SET_PRO': return { ...state, isPro: action.payload };
    case 'ADD_BUSINESS_TXN': const newBizTxn = { id: uid('biz'), ...action.payload, date: new Date().toISOString() };
      return { ...state, businessLedger: [newBizTxn, ...(state.businessLedger || [])] };  
    case 'SET_SETTINGS': return { ...state, settings: { ...state.settings, ...action.payload } };
    
    // --- NEW: Handle Sending Money (Deduct balance + fee) ---
    case 'SEND_MONEY': {
      const { amount, fee, recipient, provider, purpose, isSmartSend, smartCategory } = action.payload;
      const totalDeduction = +(amount + fee).toFixed(2);
      const newBalance = Math.max(0, +(state.wallet.balance - totalDeduction).toFixed(2));
      
      const newTxn = { 
        id: uid('tx'), type: 'send', amount: -totalDeduction, 
        recipient, provider, purpose, isSmartSend, smartCategory,
        date: new Date().toISOString(), ref: txnRef(), status: 'success' 
      };
      
      return {
        ...state,
        wallet: { ...state.wallet, balance: newBalance, totalSent: (state.wallet.totalSent || 0) + totalDeduction },
        transactions: [newTxn, ...state.transactions],
        trust: { ...state.trust, score: Math.min(900, state.trust.score + 2) }
      };
    }

    // --- NEW: Handle Paying Bills (Deduct balance) ---
    case 'PAY_BILL': {
      const { amount, provider, category } = action.payload;
      const newBalance = Math.max(0, +(state.wallet.balance - amount).toFixed(2));
      
      const newTxn = { 
        id: uid('tx'), type: 'bill_pay', amount: -amount, 
        provider, category, date: new Date().toISOString(), ref: txnRef(), status: 'success' 
      };
      
      return {
        ...state,
        wallet: { ...state.wallet, balance: newBalance },
        transactions: [newTxn, ...state.transactions]
      };
    }

    case 'APPLY_EVENT': {
      const ev = action.event;
      let s = state;
      if (ev.type === 'contribution' || ev.type === 'deposit' || ev.type === 'payout') {
        s = { ...s, wallet: { ...s.wallet, balance: +(s.wallet.balance + (ev.amount || 0)).toFixed(2) } };
        if (ev.type !== 'payout') {
          s = { ...s, transactions: [{ id: uid('tx'), type: ev.type, amount: ev.amount, group: ev.group, provider: 'Simulated', date: new Date().toISOString(), ref: txnRef(), status: 'success' }, ...s.transactions] };
        }
      }
      s = { ...s, notifications: [{ id: uid('nt'), kind: ev.type, title: ev.title, body: ev.body, date: new Date().toISOString(), read: false }, ...s.notifications].slice(0, 60) };
      return s;
    }
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState() || seedState());
  const investorTimer = useRef(null);

  useEffect(() => { saveState(state); }, [state]);
  useEffect(() => { document.documentElement.classList.toggle('dark', state.theme === 'dark'); }, [state.theme]);

  useEffect(() => {
    if (state.meta.investorMode) {
      investorTimer.current = setInterval(() => dispatch({ type: 'APPLY_EVENT', event: nextEvent() }), 3800);
    }
    return () => clearInterval(investorTimer.current);
  }, [state.meta.investorMode]);

  const toast = useCallback((title, body = '', tone = 'success') => {
    dispatch({ type: 'ADD_NOTIFICATION', item: { id: uid('nt'), kind: 'toast', title, body, date: new Date().toISOString(), read: false, tone } });
  }, []);

  const reset = useCallback(() => { clearState(); dispatch({ type: 'RESET' }); }, []);

  const value = useMemo(() => ({ state, dispatch, toast, reset }), [state, toast, reset]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
