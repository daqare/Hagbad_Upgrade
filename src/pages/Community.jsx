import React, { useState } from 'react';
import { Send, Pin, Megaphone, UserPlus, QrCode, Vote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEMBERS } from '../data/seedData';
import { Card, Button, Badge, inputCls, Modal, DemoBadge } from '../components/ui';
import { fmtDate, relTime, initials } from '../utils/format';
import { uid } from '../utils/ids';

export default function Community() {
  const { state, dispatch, toast } = useApp();
  const { announcements, chat, polls, invitations } = state;
  const [tab, setTab] = useState('announcements');
  const [msg, setMsg] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');

  const memberName = (id) => MEMBERS.find((m) => m.id === id)?.name || 'You';
  const isSelf = (id) => id === 'm1';

  const sendChat = () => {
    if (!msg.trim()) return;
    dispatch({ type: 'ADD_CHAT', item: { id: uid('ch'), by: 'm1', text: msg, date: new Date().toISOString() } });
    setMsg('');
  };

  const sendInvite = () => {
    if (invitePhone.length < 8) return;
    dispatch({ type: 'ADD_INVITATION', item: { id: uid('in'), name: 'New member', phone: invitePhone, status: 'sent', date: new Date().toISOString() } });
    toast('Invitation sent', `Demo invite sent to ${invitePhone}`);
    setInvitePhone(''); setInviteOpen(false);
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="font-display text-3xl font-bold">Community</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Announcements, chat, voting & invitations.</p></div>
        <div className="flex gap-2"><DemoBadge /><Button size="sm" onClick={() => setInviteOpen(true)}><UserPlus className="h-4 w-4" /> Invite</Button></div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[['announcements', 'Announcements'], ['chat', 'Group chat'], ['polls', 'Voting & polls'], ['invites', 'Invitations']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-2xl text-sm font-semibold ${tab === k ? 'bg-forest-900 text-sand-50' : 'bg-white/70 dark:bg-white/5 border border-forest-100 dark:border-white/10'}`}>{l}</button>
        ))}
      </div>

      {tab === 'announcements' && (
        <div className="space-y-3">
          {[...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex items-center gap-2">{a.pinned && <Pin className="h-4 w-4 text-gold-500" />}<Megaphone className="h-4 w-4 text-teal-600" /><h3 className="font-semibold">{a.title}</h3>{a.pinned && <Badge tone="gold">Pinned</Badge>}</div>
              <p className="mt-2 text-sm text-forest-700/70 dark:text-sand-100/60">{a.body}</p>
              <p className="mt-2 text-xs text-forest-700/40 dark:text-sand-100/30">{a.by} · {fmtDate(a.date)}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'chat' && (
        <Card className="p-6 flex flex-col h-[480px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {chat.map((c) => (
              <div key={c.id} className={`flex gap-2.5 ${isSelf(c.by) ? 'flex-row-reverse' : ''}`}>
                <div className="h-8 w-8 rounded-full bg-teal-600 grid place-items-center text-white text-[10px] font-bold shrink-0">{initials(memberName(c.by))}</div>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${isSelf(c.by) ? 'bg-forest-900 text-sand-50' : 'bg-black/5 dark:bg-white/10'}`}>
                  {!isSelf(c.by) && <p className="text-[11px] font-bold text-teal-600 dark:text-teal-300">{memberName(c.by)}</p>}
                  <p className="text-sm">{c.text}</p>
                  <p className={`text-[10px] mt-0.5 ${isSelf(c.by) ? 'text-sand-100/50' : 'text-forest-700/40 dark:text-sand-100/30'}`}>{relTime(c.date)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()} placeholder="Type a message…" className={inputCls} />
            <Button onClick={sendChat}><Send className="h-4 w-4" /></Button>
          </div>
        </Card>
      )}

      {tab === 'polls' && (
        <div className="space-y-4">
          {polls.map((p) => {
            const total = p.options.reduce((a, o) => a + o.votes, 0);
            return (
              <Card key={p.id} className="p-6">
                <div className="flex items-center gap-2"><Vote className="h-4 w-4 text-plum-600" /><h3 className="font-semibold">{p.question}</h3></div>
                <p className="text-xs text-forest-700/50 dark:text-sand-100/40 mt-1">Closes {fmtDate(p.closes)} · {total} votes</p>
                <div className="mt-4 space-y-2">
                  {p.options.map((o) => (
                    <button key={o.id} onClick={() => dispatch({ type: 'VOTE_POLL', id: p.id, opt: o.id })} className="w-full text-left rounded-2xl border border-forest-100 dark:border-white/10 p-3 hover:border-gold-400 transition">
                      <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold">{o.label}</span><span className="text-forest-700/50 dark:text-sand-100/40">{total ? Math.round((o.votes / total) * 100) : 0}%</span></div>
                      <div className="h-2 rounded-full bg-black/10 dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-plum-500 to-gold-500" style={{ width: `${total ? (o.votes / total) * 100 : 0}%` }} /></div>
                    </button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'invites' && (
        <Card className="p-6">
          <h3 className="font-display font-bold">Invitations</h3>
          <div className="mt-4 space-y-2">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div><p className="text-sm font-semibold">{inv.name}</p><p className="text-xs text-forest-700/50 dark:text-sand-100/40">{inv.phone}</p></div>
                <Badge tone={inv.status === 'joined' ? 'forest' : inv.status === 'viewed' ? 'teal' : inv.status === 'sent' ? 'gold' : 'gray'}>{inv.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)}>
        <h3 className="font-display text-xl font-bold">Invite a member</h3>
        <p className="text-sm text-forest-700/60 dark:text-sand-100/50 mt-1">Send a demo invite by phone or shareable link.</p>
        <input value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} placeholder="+252 6x xxx xxxx" className={inputCls + ' mt-4'} />
        <div className="mt-4 rounded-2xl border border-dashed border-forest-300 dark:border-white/20 p-4 flex items-center gap-3">
          <QrCode className="h-10 w-10 text-forest-700 dark:text-sand-200" />
          <div><p className="text-sm font-semibold">QR invitation preview</p><p className="text-xs text-forest-700/50 dark:text-sand-100/40">hagbad.app/i/demo-code</p></div>
        </div>
        <Button className="w-full mt-4" onClick={sendInvite}>Send invitation</Button>
      </Modal>
    </div>
  );
}
