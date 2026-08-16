import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HeartHandshake, ThumbsUp, ThumbsDown, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEMBERS } from '../data/seedData';
import { Card, Button, Badge, Field, inputCls, Modal, Bar, EmptyState, DemoBadge } from '../components/ui';
import { fmtMoney, fmtDate, initials } from '../utils/format';
import { uid } from '../utils/ids';

const CATS = ['Medical', 'Funeral', 'Education', 'Family support', 'Business emergency', 'Other'];
const schema = z.object({
  category: z.string(), amount: z.coerce.number().min(10, 'Too small'),
  urgency: z.string(), text: z.string().min(10, 'Please explain the request'),
});

export default function Emergency() {
  const { state, dispatch, toast } = useApp();
  const { emergencyRequests, profile } = state;
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema), defaultValues: { category: 'Medical', urgency: 'Medium', amount: 200, text: '' },
  });

  const memberName = (id) => MEMBERS.find((m) => m.id === id)?.name || 'Member';

  const submit = (d) => {
    dispatch({ type: 'ADD_EMERGENCY', item: { id: uid('er'), member: 'm1', category: d.category, amount: d.amount, urgency: d.urgency, date: new Date().toISOString(), text: d.text, docs: ['support_doc.pdf'], approvals: [], declines: [], threshold: 3, status: 'open', allocated: 0, messages: [] } });
    dispatch({ type: 'ADD_NOTIFICATION', item: { id: uid('nt'), kind: 'emergency', title: 'Emergency vote started', body: `New ${d.category} request for ${fmtMoney(d.amount)}`, date: new Date().toISOString(), read: false } });
    toast('Request submitted', 'The community will now vote.');
    reset(); setOpen(false);
  };

  const vote = (req, approve) => {
    const patch = approve ? { approvals: [...req.approvals, 'm1'] } : { declines: [...req.declines, 'm1'] };
    dispatch({ type: 'UPDATE_EMERGENCY', id: req.id, patch });
    toast(approve ? 'Support recorded' : 'Decline recorded', 'Thank you for participating.');
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">Emergency Fund</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Compassionate, transparent, community-led support.</p></div>
        <div className="flex gap-2"><DemoBadge /><Button variant="coral" onClick={() => setOpen(true)}><HeartHandshake className="h-4 w-4" /> New request</Button></div>
      </div>

      {emergencyRequests.length === 0 ? (
        <Card><EmptyState icon={HeartHandshake} title="No emergency requests" body="When a member needs support, their request will appear here for the community to vote on." /></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {emergencyRequests.map((r) => {
            const progress = (r.approvals.length / r.threshold) * 100;
            return (
              <Card key={r.id} className="p-6 border-l-4 !border-l-coral-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-coral-500 grid place-items-center text-white font-bold">{initials(memberName(r.member))}</div>
                    <div><p className="font-semibold text-sm">{memberName(r.member)}</p><p className="text-xs text-forest-700/50 dark:text-sand-100/40">{fmtDate(r.date)}</p></div>
                  </div>
                  <Badge tone={r.urgency === 'High' ? 'coral' : 'gold'}>{r.urgency} urgency</Badge>
                </div>
                <div className="mt-4 flex items-center gap-2"><Badge tone="coral">{r.category}</Badge><p className="font-display text-2xl font-bold">{fmtMoney(r.amount, profile.currency)}</p></div>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-sand-100/60">{r.text}</p>
                {r.docs.length > 0 && <p className="mt-2 flex items-center gap-1.5 text-xs text-forest-700/50 dark:text-sand-100/40"><Paperclip className="h-3 w-3" /> {r.docs.join(', ')} (simulated)</p>}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5"><span>Approvals ({r.approvals.length}/{r.threshold})</span><span>{Math.round(progress)}%</span></div>
                  <Bar value={progress} color="bg-gradient-to-r from-coral-500 to-gold-500" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => vote(r, true)}><ThumbsUp className="h-3.5 w-3.5" /> Approve</Button>
                  <Button size="sm" variant="ghost" className="flex-1" onClick={() => vote(r, false)}><ThumbsDown className="h-3.5 w-3.5" /> Decline</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="font-display text-xl font-bold">New emergency request</h3>
        <p className="text-sm text-forest-700/60 dark:text-sand-100/50 mt-1">Your community will review and vote.</p>
        <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-3">
          <Field label="Category"><select {...register('category')} className={inputCls}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount" error={errors.amount?.message}><input type="number" {...register('amount')} className={inputCls} /></Field>
            <Field label="Urgency"><select {...register('urgency')} className={inputCls}>{['Low', 'Medium', 'High'].map((u) => <option key={u}>{u}</option>)}</select></Field>
          </div>
          <Field label="Explain your request" error={errors.text?.message}><textarea {...register('text')} rows={3} className={inputCls} /></Field>
          <Button type="submit" variant="coral" className="w-full">Submit request</Button>
        </form>
      </Modal>
    </div>
  );
}
