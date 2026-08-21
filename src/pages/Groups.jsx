import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Edit3, Play, Trophy, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEMBERS } from '../data/seedData';
import { Card, Button, Badge, Field, inputCls, Modal, DemoBadge } from '../components/ui';
import { fmtMoney, fmtDate, initials } from '../utils/format';
import { uid } from '../utils/ids';
import { Confetti } from '../components/Confetti';
import CreateCircleWizard from '../components/CreateCircleWizard';
const FREQ = ['Weekly', 'Bi-weekly', 'Monthly'];

export default function Groups() {
  const [showWizard, setShowWizard] = useState(false);
  const { state, dispatch, toast } = useApp();
  const { groups, profile } = state;
  const [selected, setSelected] = useState(groups[0]?.id);
  const [editOpen, setEditOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const group = groups.find((g) => g.id === selected) || groups[0];

  const memberName = (id) => MEMBERS.find((m) => m.id === id)?.name || 'Member';

  const pool = group ? group.contribution * group.members.length : 0;
  const fee = +(pool * (group?.feePct || 0) / 100).toFixed(2);
  const payout = +(pool - fee).toFixed(2);
  const roundsPerYear = group?.frequency === 'Weekly' ? 52 : group?.frequency === 'Bi-weekly' ? 26 : 12;
  const annual = group ? group.contribution * roundsPerYear : 0;

  const saveEdit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const contribution = Number(f.get('contribution'));
    const memberLimit = Number(f.get('memberLimit'));
    dispatch({ type: 'UPDATE_GROUP', id: group.id, patch: {
      name: f.get('name'), description: f.get('description'),
      contribution, frequency: f.get('frequency'), memberLimit,
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
      dispatch({ type: 'ADD_NOTIFICATION', item: { id: uid('nt'), kind: 'payout', title: 'Payout completed', body: `${recipient} received ${fmtMoney(payout)} from ${group.name}`, date: new Date().toISOString(), read: false } });
      setRunning(false);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000);
    }, 1600);
  };

  if (!group) return null;

  return (
    <div className="py-6 space-y-6">
      {celebrate && <Confetti />}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">Hagbad Circles</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Traditional rotating savings, made transparent.</p></div>
        <DemoBadge />    <Button variant="gold" onClick={() => setShowWizard(true)}> Create Circle
   </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {groups.map((g) => (
          <button key={g.id} onClick={() => setSelected(g.id)} className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition ${selected === g.id ? 'bg-forest-900 text-sand-50 shadow-soft' : 'bg-white/70 dark:bg-white/5 border border-forest-100 dark:border-white/10'}`}>
            {g.name}
          </button>
        ))}
      </div>

      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold">{group.name}</h2>
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
          ].map((s) => <div key={s.l} className="rounded-2xl bg-black/5 dark:bg-white/5 p-4"><p className="text-xs text-forest-700/60 dark:text-sand-100/50">{s.l}</p><p className="mt-1 font-display font-bold">{s.v}</p></div>)}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-display font-bold">Rotation queue</h3>
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
                <p className="mt-1.5 text-[11px] font-semibold max-w-[70px] truncate">{memberName(mid).split(' ')[0]}</p>
                {isNext && <Badge tone="gold" className="mt-1">Next payout</Badge>}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 p-4 text-sm">
          <p><b>This round payout:</b> {fmtMoney(payout, profile.currency)} <span className="text-forest-700/60 dark:text-sand-100/50">(pool {fmtMoney(pool, profile.currency)} − platform fee {fmtMoney(fee, profile.currency)})</span></p>
          <p className="mt-1 text-forest-700/60 dark:text-sand-100/50">Annual contribution projection: <b>{fmtMoney(annual, profile.currency)}</b> · {roundsPerYear} rounds/year</p>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-display font-bold">Members ({group.members.length}/{group.memberLimit})</h3>
          <div className="mt-4 space-y-2">
            {group.members.map((mid) => {
              const m = MEMBERS.find((x) => x.id === mid);
              return (
                <div key={mid} className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-teal-600 grid place-items-center text-white text-xs font-bold">{initials(m?.name)}</div>
                    <div><p className="text-sm font-semibold">{m?.name}</p><p className="text-xs text-forest-700/50 dark:text-sand-100/40">Trust {m?.trust}</p></div>
                  </div>
                  <Badge tone="forest">Paid</Badge>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-display font-bold">Activity feed</h3>
          <div className="mt-4 space-y-3">
            {group.activity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gold-500 shrink-0" />
                <div><p className="text-sm">{a.text}</p><p className="text-xs text-forest-700/50 dark:text-sand-100/40">{fmtDate(a.date)}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-5"><p className="text-xs font-semibold uppercase tracking-wide text-forest-700/50 dark:text-sand-100/40 mb-2">Group rules</p>
            <ul className="space-y-1.5 text-sm">{group.rules.map((r, i) => <li key={i} className="flex gap-2"><Trophy className="h-4 w-4 text-gold-500 shrink-0" /> {r}</li>)}</ul>
          </div>
        </Card>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} wide>
        <h3 className="font-display text-xl font-bold">Edit circle</h3>
        <p className="text-sm text-forest-700/60 dark:text-sand-100/50 mt-1">Pool, fee and payout recalculate automatically.</p>
        <form onSubmit={saveEdit} className="mt-4 grid md:grid-cols-2 gap-4">
          <Field label="Circle name"><input name="name" defaultValue={group.name} className={inputCls} /></Field>
          <Field label="Contribution amount"><input name="contribution" type="number" defaultValue={group.contribution} className={inputCls} /></Field>
          <Field label="Frequency"><select name="frequency" defaultValue={group.frequency} className={inputCls}>{FREQ.map((f) => <option key={f}>{f}</option>)}</select></Field>
          <Field label="Member limit"><input name="memberLimit" type="number" defaultValue={group.memberLimit} className={inputCls} /></Field>
          <Field label="Next payout date"><input name="nextPayout" type="date" className={inputCls} /></Field>
          <div className="md:col-span-2"><Field label="Description"><textarea name="description" defaultValue={group.description} rows={2} className={inputCls} /></Field></div>
          <div className="md:col-span-2 flex gap-3"><Button type="button" variant="ghost" className="flex-1" onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit" className="flex-1">Save changes</Button></div>
        </form>
      </Modal>
         {showWizard && <CreateCircleWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
