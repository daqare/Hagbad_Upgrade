import React from 'react';
import { Moon, Sun, RotateCcw, Globe2, Bell, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, Button, Field, inputCls } from '../components/ui';
import { LANGS } from '../utils/i18n';

export default function Settings() {
  const { state, dispatch, reset, toast } = useApp();
  const { theme, lang, profile, settings, meta } = state;

  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-forest-700' : 'bg-black/15 dark:bg-white/15'}`} aria-pressed={on}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="py-6 space-y-6 max-w-3xl">
      <div><h1 className="font-display text-3xl font-bold">Settings</h1><p className="mt-1 text-sm text-forest-700/60 dark:text-sand-100/50">Appearance, notifications & demo controls.</p></div>

      <Card className="p-6">
        <h3 className="font-display font-bold mb-4">Appearance & language</h3>
        <div className="flex items-center justify-between py-2.5 border-b border-forest-100 dark:border-white/10">
          <div className="flex items-center gap-3">{theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}<span className="text-sm font-medium">Dark mode</span></div>
          <Toggle on={theme === 'dark'} onClick={() => dispatch({ type: 'SET_THEME', theme: theme === 'dark' ? 'light' : 'dark' })} />
        </div>
        <div className="py-2.5">
          <p className="text-sm font-medium mb-2 flex items-center gap-2"><Globe2 className="h-4 w-4" /> Language</p>
          <div className="flex gap-2">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => dispatch({ type: 'SET_LANG', lang: l.code })} className={`px-4 py-2 rounded-2xl border text-sm font-medium ${lang === l.code ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' : 'border-forest-200 dark:border-white/15'}`}>{l.flag} {l.label}</button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h3>
        {[
          ['notifPayments', 'Payment alerts'],
          ['notifReminders', 'Payment reminders'],
          ['notifMembers', 'New member activity'],
          ['notifAnnouncements', 'Announcements'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center justify-between py-2.5 border-b border-forest-100 dark:border-white/10 last:border-0">
            <span className="text-sm">{label}</span>
            <Toggle on={settings[key]} onClick={() => dispatch({ type: 'SET_SETTINGS', payload: { [key]: !settings[key] } })} />
          </div>
        ))}
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-bold mb-4">Profile</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Name"><input value={profile.name} onChange={(e) => dispatch({ type: 'PROFILE', payload: { name: e.target.value } })} className={inputCls} /></Field>
          <Field label="Location"><input value={profile.location} onChange={(e) => dispatch({ type: 'PROFILE', payload: { location: e.target.value } })} className={inputCls} /></Field>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-bold mb-2">Demo controls</h3>
        <div className="flex items-center justify-between py-2.5 border-b border-forest-100 dark:border-white/10">
          <span className="text-sm">Investor Mode</span>
          <Toggle on={meta.investorMode} onClick={() => dispatch({ type: 'TOGGLE_INVESTOR' })} />
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-sm">Reset all demo data</span>
          <Button variant="danger" size="sm" onClick={() => { reset(); toast('Demo reset', 'Original seed data restored.'); }}><RotateCcw className="h-4 w-4" /> Reset</Button>
        </div>
      </Card>

      <Card className="p-5 flex items-start gap-3 bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20">
        <Info className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Demo disclaimer</p>
          <p className="mt-1 text-forest-700/70 dark:text-sand-100/60">Hagbad V3 is a simulated demonstration for Cilariti Consulting Services. No real money moves, and no official integrations with EVC Plus, Zaad, eDahab, Sahal, M-Pesa or Airtel Money are implied. Privacy & terms placeholders apply.</p>
        </div>
      </Card>
    </div>
  );
}
