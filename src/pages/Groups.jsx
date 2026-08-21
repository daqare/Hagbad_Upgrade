import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CalendarDays, ShieldCheck, ArrowUpRight, ArrowDownLeft,
  Zap, HeartHandshake, Target, Flame, ChevronRight, Edit3, Play, Crown,
  MessageCircle, Smartphone, X, AlertCircle, CheckCircle2, Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmtMoney, fmtDate } from '../utils/format';
import { uid } from '../utils/ids';
import { Card, Badge, Button, Field, DemoBadge } from '../components/ui';

// Mock data for the demo
const MEMBERS = [
  { id: 'm1', name: 'Abdiweli Elmi', phone: '+252611234567' },
  { id: 'm2', name: 'Hodan Ahmed', phone: '+252612345678' },
  { id: 'm3', name: 'Mohamed Yusuf', phone: '+252613456789' },
  { id: 'm4', name: 'Sahra Ali', phone: '+252614567890' },
];

const LATE_PAYERS = [
  { id: 'm2', name: 'Hodan Ahmed', phone: '+252612345678', daysLate: 3, amount: 100 },
  { id: 'm4', name: 'Sahra Ali', phone: '+252614567890', daysLate: 1, amount: 100 },
];

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function Groups() {
  const { state, dispatch, toast } = useApp();
  const nav = useNavigate();
  const { groups, profile } = state;
  const [selected, setSelected] = useState(groups[0]?.id);
  const [editOpen, setEditOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  
  // NEW: Reminder States
  const [showReminders, setShowReminders] = useState(false);
  const [sending, setSending] = useState(null);
  const [autoReminders, setAutoReminders] = useState(true);

  const group = groups.find((g) => g.id === selected) || groups[0];
  const memberName = (id) => MEMBERS.find((m) => m.id === id)?.name || 'Member';

  const pool = group ? group.contribution * group.members.length : 0;
  const fee = +(pool * (group?.feePct || 0) / 100).toFixed(2);
  const payout = +(pool - fee).toFixed(2);

  const saveEdit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    dispatch({ type: 'UPDATE_GROUP', id: group.id, patch: {
      name: f.get('name'), description: f.get('description'),
      contribution: Number(f.get('contribution')), frequency: f.get('frequency'), memberLimit: Number(f.get('memberLimit')),
      nextPayout: f.get('nextPayout') || group.nextPayout,
    }});
    toast('Group updated', 'Changes saved successfully.');
    setEditOpen(false);
  };

  const runRotation = () => {
    setRunning(true);
    setTimeout(() => {
      const recipient = memberName(group.rotation[group.currentIndex]);
      dispatch({ type: 'ADVANCE_ROTATION', id: group.id });
      dispatch({ type: 'ADD_GROUP_ACTIVITY', id: group.id, text: `${recipient} received payout of ${fmtMoney(payout)}` });
      dispatch({ type: 'ADD_TXN', txn: { id: uid('tx'), type: 'payout', group: group.name, amount: payout, provider: 'Circle pool', date: new Date().toISOString(), ref: 'HGB-ROT' + Math.floor(Math.random() * 999), status: 'success' } });
      setRunning(false);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000);
    }, 1600);
  };

  // NEW: Simulate sending a reminder
  const sendReminder = (method, member) => {
    setSending(member.id);
    setTimeout(() => {
      setSending(null);
      toast('Reminder Sent!', `${method} invoice sent to ${member.name}.`);
    }, 1500);
  };

  if (!group) return null;

  return (
    <div className="py-6 space-y-6">
      {celebrate && <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"><div className="text-6xl">🎉</div></div>}
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900 dark:text-sand-50">Hagbad Circles</h1>
          <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Traditional rotating savings, made transparent.</p>
        </div>
        <div className="flex gap-2">
          <DemoBadge />
          {/* NEW: Send Reminders Button */}
          <Button variant="gold" onClick={() => setShowReminders(true)}>
            <Bell className="h-4 w-4" /> Send Reminders
          </Button>
        </div>
      </div>

      <Card className="p-6 relative overflow-hidden bg-white dark:bg-forest-950">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />
        <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-forest-900 dark:text-sand-50">{group.name}</h2>
              <Badge tone="forest"><ShieldCheck className="h-3 w-3" /> Health {group.health}</Badge>
            </div>
            <p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50 max-w-lg">{group.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Badge tone="teal"><Crown className="h-3 w-3" /> Leader: {group.leader}</Badge>
              <Badge tone="plum">Treasurer: {group.treasurer}</Badge>
              <Badge tone="gold">{group.payPref}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}><Edit3 className="h-4 w-4" /> Edit circle</Button>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: 'Contribution', v: fmtMoney(group.contribution, profile.currency) },
            { l: 'Frequency', v: group.frequency },
            { l: 'Total pool', v: fmtMoney(pool, profile.currency) },
            { l: 'Next payout', v: fmtDate(group.nextPayout) },
          ].map((s) => <div key={s.l} className="rounded-2xl bg-black/5 dark:bg-white/5 p-4"><p className="text-xs text-forest-700/60 dark:text-sand-100/50">{s.l}</p><p className="mt-1 font-display font-bold text-forest-900 dark:text-sand-50">{s.v}</p></div>)}
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-forest-950">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-display font-bold text-forest-900 dark:text-sand-50">Rotation queue</h3>
          <Button variant="gold" onClick={runRotation} disabled={running}><Play className="h-4 w-4" /> {running ? 'Rotating…' : 'Run rotation'}</Button>
        </div>
        <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
          {group.rotation.map((mid, i) => {
            const isNext = i === group.currentIndex;
            return (
              <motion.div key={mid} layout animate={isNext ? { scale: 1.08, y: -6 } : { scale: 1, y: 0 }} className={`shrink-0 text-center ${isNext ? '' : 'opacity-70'}`}>
                <div className={`h-14 w-14 rounded-full grid place-items-center font-bold text-white shadow-soft ${isNext ? 'bg-gradient-to-br from-gold-400 to-coral-500 ring-4 ring-gold-300/50' : 'bg-forest-700'}`}>
                  {initials(memberName(mid))}
                </div>
                <p className="mt-1.5 text-[11px] font-semibold max-w-[70px] truncate text-forest-900 dark:text-sand-50">{memberName(mid).split(' ')[0]}</p>
                {isNext && <Badge tone="gold" className="mt-1">Next payout</Badge>}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 p-4 text-sm">
          <p className="text-forest-900 dark:text-sand-50"><b>This round payout:</b> {fmtMoney(payout, profile.currency)} <span className="text-forest-700/60 dark:text-sand-100/50">(pool {fmtMoney(pool, profile.currency)} − platform fee {fmtMoney(fee, profile.currency)})</span></p>
        </div>
      </Card>

      {/* Edit Modal (Existing) */}
      <AnimatePresence>
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md bg-white dark:bg-forest-950 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-xl text-forest-900 dark:text-sand-50">Edit Circle</h3>
                <button onClick={() => setEditOpen(false)}><X className="h-5 w-5 text-forest-700/60" /></button>
              </div>
              <form onSubmit={saveEdit} className="space-y-4">
                <Field label="Circle Name"><input name="name" defaultValue={group.name} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50" /></Field>
                <Field label="Description"><textarea name="description" defaultValue={group.description} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50" /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Contribution"><input name="contribution" type="number" defaultValue={group.contribution} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50" /></Field>
                  <Field label="Frequency">
                    <select name="frequency" defaultValue={group.frequency} className="w-full p-3 rounded-xl border border-forest-200 dark:border-white/10 bg-transparent text-forest-900 dark:text-sand-50">
                      <option>Weekly</option><option>Bi-weekly</option><option>Monthly</option>
                    </select>
                  </Field>
                </div>
                <Button type="submit" variant="gold" className="w-full">Save Changes</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: Automated Reminders Modal */}
      <AnimatePresence>
        {showReminders && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-lg bg-white dark:bg-forest-950 rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-plum-900 to-forest-900 p-6 text-white relative">
                <button onClick={() => setShowReminders(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition">
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center">
                    <Bell className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">Payment Reminders</h2>
                    <p className="text-xs text-white/70">Chase late payers automatically</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Auto-Reminder Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-gold-500" />
                    <div>
                      <p className="font-bold text-sm text-forest-900 dark:text-sand-50">Auto-Reminders</p>
                      <p className="text-[10px] text-forest-700/60">Send WhatsApp every 3 days</p>
                    </div>
                  </div>
                  <button onClick={() => setAutoReminders(!autoReminders)} className={`relative h-6 w-11 rounded-full transition ${autoReminders ? 'bg-gold-500' : 'bg-black/20'}`}>
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${autoReminders ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {/* Late Payers List */}
                <div>
                  <h3 className="font-bold text-sm mb-3 text-forest-900 dark:text-sand-50 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-coral-500" /> 2 Members Late on Payment
                  </h3>
                  <div className="space-y-3">
                    {LATE_PAYERS.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-coral-100 dark:border-coral-900/30 bg-coral-50/50 dark:bg-coral-900/10">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-coral-100 dark:bg-coral-800/40 grid place-items-center font-bold text-coral-600 text-xs">
                            {initials(member.name)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-forest-900 dark:text-sand-50">{member.name}</p>
                            <p className="text-[10px] text-coral-600 font-semibold">{member.daysLate} days late · {fmtMoney(member.amount)} due</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => sendReminder('WhatsApp', member)} 
                            disabled={sending === member.id}
                            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-50"
                            title="Send WhatsApp"
                          >
                            {sending === member.id ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => sendReminder('SMS', member)} 
                            disabled={sending === member.id}
                            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50"
                            title="Send SMS"
                          >
                            {sending === member.id ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Smartphone className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setShowReminders(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
