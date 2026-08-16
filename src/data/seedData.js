import { daysFromNow } from '../utils/format';
import { uid } from '../utils/ids';

const now = Date.now();
const iso = (offsetDays) => new Date(now - offsetDays * 86400000).toISOString();

export const MEMBERS = [
  { id: 'm1', name: 'Amina Hassan', phone: '+252 61 234 5671', trust: 742 },
  { id: 'm2', name: 'Yusuf Abdi', phone: '+252 63 555 1020', trust: 688 },
  { id: 'm3', name: 'Fadumo Ali', phone: '+252 61 887 4321', trust: 801 },
  { id: 'm4', name: 'Mohamed Ibrahim', phone: '+254 712 004 551', trust: 655 },
  { id: 'm5', name: 'Khadija Warsame', phone: '+252 62 118 9034', trust: 719 },
  { id: 'm6', name: 'Abdullahi Farah', phone: '+252 61 660 7788', trust: 590 },
  { id: 'm7', name: 'Hodan Yusuf', phone: '+254 733 908 112', trust: 764 },
  { id: 'm8', name: 'Omar Sheikh', phone: '+252 63 220 4590', trust: 705 },
];

export function seedState() {
  return {
    meta: { version: 3, seededAt: new Date().toISOString(), investorMode: false },
    theme: 'light',
    lang: 'en',
    auth: { isAuthenticated: false, onboarded: false },
    profile: {
      name: 'Amina Hassan', phone: '+252 61 234 5671', location: 'Mogadishu, Somalia',
      currency: 'USD', employment: 'Small business owner', kyc: 'pending', avatarSeed: 'amina',
    },
    trust: {
      score: 718, level: 'Established',
      history: [
        { date: iso(150), score: 512 }, { date: iso(120), score: 561 },
        { date: iso(90), score: 602 }, { date: iso(60), score: 648 },
        { date: iso(30), score: 690 }, { date: iso(7), score: 718 },
      ],
      factors: [
        { label: 'On-time contributions', impact: +40, icon: 'clock' },
        { label: 'Verified phone number', impact: +20, icon: 'phone' },
        { label: 'Completed payout cycle', impact: +35, icon: 'rotate' },
        { label: 'Positive member rating', impact: +15, icon: 'star' },
        { label: 'One late contribution (Mar)', impact: -12, icon: 'alert' },
      ],
    },
    wallet: { balance: 486.5, totalDeposited: 2140, totalContributions: 1560, totalPayouts: 1875, pending: 0 },
    savingsAccounts: [
      { id: 'sv1', name: 'Emergency Savings', icon: 'shield', color: 'coral', goal: 1200, balance: 760, monthly: 80, targetDate: daysFromNow(160),
        history: [{ date: iso(60), amount: 80 }, { date: iso(30), amount: 80 }, { date: iso(2), amount: 80 }] },
      { id: 'sv2', name: 'Hajj Fund', icon: 'kaaba', color: 'forest', goal: 4500, balance: 1350, monthly: 150, targetDate: daysFromNow(560),
        history: [{ date: iso(45), amount: 150 }, { date: iso(10), amount: 150 }] },
      { id: 'sv3', name: 'Business Growth', icon: 'briefcase', color: 'plum', goal: 2500, balance: 940, monthly: 120, targetDate: daysFromNow(300),
        history: [{ date: iso(20), amount: 120 }] },
    ],
    groups: [
      {
        id: 'g1', name: 'Banaadir Women’s Circle',
        description: 'Monthly rotating hagbad for women traders in Bakaara Market.',
        leader: 'Fadumo Ali', treasurer: 'Khadija Warsame',
        contribution: 100, frequency: 'Monthly', memberLimit: 10,
        members: ['m1', 'm3', 'm5', 'm7', 'm2'], pool: 500, feePct: 2,
        rotation: ['m3', 'm1', 'm5', 'm7', 'm2'], currentIndex: 1,
        startDate: iso(120), nextPayout: daysFromNow(9), method: 'Rotation (queue)', payPref: 'EVC Plus',
        rules: ['Contribute by the 5th of each month.', 'Late fee of 5% after 7 days.', 'Two guarantors required for new members.'],
        health: 92,
        activity: [
          { date: iso(3), text: 'Fadumo Ali received payout of $500' },
          { date: iso(30), text: 'All 5 members contributed on time' },
        ],
      },
      {
        id: 'g2', name: 'Hargeisha Traders Circle',
        description: 'Weekly circle for shop owners in Hargeisa central market.',
        leader: 'Yusuf Abdi', treasurer: 'Omar Sheikh',
        contribution: 50, frequency: 'Weekly', memberLimit: 8,
        members: ['m2', 'm4', 'm6', 'm8'], pool: 200, feePct: 2,
        rotation: ['m2', 'm4', 'm6', 'm8'], currentIndex: 0,
        startDate: iso(60), nextPayout: daysFromNow(3), method: 'Rotation (queue)', payPref: 'Zaad',
        rules: ['Contribute every Friday before 6pm.'], health: 88,
        activity: [{ date: iso(7), text: 'Circle formed and first round completed' }],
      },
    ],
    saccos: [
      {
        id: 'sc1', name: 'Hormuud Cooperative SACCO',
        members: MEMBERS.slice(0, 7).map((m) => m.id),
        shareValue: 50, mandatoryMonthly: 40, capital: 12480, voluntary: 2140,
        investments: [
          { name: 'Grain wholesale', amount: 4200, status: 'Active' },
          { name: 'Minibus route lease', amount: 3600, status: 'Active' },
        ],
        emergencyReserve: 1500, participation: 91,
        meetings: [{ date: iso(14), title: 'Monthly general meeting', attendance: '6/7', minutes: 'Approved Q3 investment allocation. Voted to raise mandatory savings by $5.' }],
        leaderboard: [
          { id: 'm3', contributed: 620 }, { id: 'm1', contributed: 580 },
          { id: 'm7', contributed: 540 }, { id: 'm5', contributed: 505 },
        ],
      },
    ],
    emergencyRequests: [
      {
        id: 'er1', member: 'm6', category: 'Medical', amount: 350, urgency: 'High', date: iso(2),
        text: 'Urgent hospital costs for my mother. Requesting community support.',
        docs: ['hospital_referral.pdf'], approvals: ['m3', 'm5'], declines: [], threshold: 3,
        status: 'open', allocated: 0, messages: [{ by: 'm3', text: 'May Allah heal her. Supporting.' }],
      },
    ],
    investments: [
      { id: 'iv1', name: 'Shabelle Farm Collective', category: 'Agriculture', target: 8000, raised: 5150, investors: 14, minContribution: 100, risk: 'Medium', horizon: '18 months',
        disclaimer: 'Projected scenarios for demonstration only. Investment outcomes are not guaranteed.',
        updates: [{ date: iso(9), text: 'Land preparation complete; planting begins next week.' }] },
      { id: 'iv2', name: 'Lido Beach Apartments', category: 'Real estate', target: 25000, raised: 9800, investors: 22, minContribution: 250, risk: 'Low', horizon: '36 months',
        disclaimer: 'Projected scenarios for demonstration only. Investment outcomes are not guaranteed.',
        updates: [{ date: iso(15), text: 'Foundations approved by municipality.' }] },
      { id: 'iv3', name: 'Livestock Export Co-op', category: 'Livestock', target: 6000, raised: 2400, investors: 9, minContribution: 150, risk: 'High', horizon: '12 months',
        disclaimer: 'Projected scenarios for demonstration only. Investment outcomes are not guaranteed.', updates: [] },
    ],
    transactions: [
      { id: uid('tx'), type: 'contribution', group: 'Banaadir Women’s Circle', amount: 100, provider: 'EVC Plus', date: iso(2), ref: 'HGB-8FK2LQ', status: 'success' },
      { id: uid('tx'), type: 'deposit', amount: 150, provider: 'Zaad', date: iso(5), ref: 'HGB-2MA9XN', status: 'success' },
      { id: uid('tx'), type: 'payout', group: 'Banaadir Women’s Circle', amount: 500, date: iso(33), ref: 'HGB-9TT4RC', status: 'success' },
      { id: uid('tx'), type: 'savings', account: 'Emergency Savings', amount: 80, provider: 'EVC Plus', date: iso(2), ref: 'HGB-5PL0AZ', status: 'success' },
      { id: uid('tx'), type: 'contribution', group: 'Hargeisha Traders Circle', amount: 50, provider: 'Zaad', date: iso(9), ref: 'HGB-7JQ3MV', status: 'success' },
      { id: uid('tx'), type: 'withdraw', account: 'Business Growth', amount: -60, date: iso(12), ref: 'HGB-1KX8BD', status: 'success' },
    ],
    notifications: [
      { id: uid('nt'), kind: 'payment', title: 'Contribution received', body: 'Your $100 to Banaadir Women’s Circle was confirmed.', date: iso(2), read: false },
      { id: uid('nt'), kind: 'reminder', title: 'Payment due tomorrow', body: 'Hargeisha Traders Circle contribution of $50 is due.', date: iso(0.3), read: false },
      { id: uid('nt'), kind: 'member', title: 'New member joined', body: 'Hodan Yusuf joined Hormuud Cooperative SACCO.', date: iso(4), read: true },
      { id: uid('nt'), kind: 'trust', title: 'Trust score updated', body: 'Your score rose to 718 after an on-time payout cycle.', date: iso(7), read: true },
    ],
    invitations: [
      { id: uid('in'), name: 'Sahra Noor', phone: '+252 61 555 0101', status: 'joined', date: iso(6) },
      { id: uid('in'), name: 'Ali Mohamed', phone: '+252 63 700 2211', status: 'viewed', date: iso(1) },
      { id: uid('in'), name: 'Nimco Aden', phone: '+254 720 118 334', status: 'sent', date: iso(0.5) },
    ],
    announcements: [
      { id: uid('an'), pinned: true, title: 'Eid payout schedule', body: 'All circle payouts scheduled during Eid will shift by 2 days. Treasurers have been notified.', date: iso(1), by: 'Platform' },
      { id: uid('an'), pinned: false, title: 'New SACCO voting open', body: 'Vote on the proposed 5-dollar increase to mandatory monthly savings.', date: iso(3), by: 'Hormuud SACCO' },
    ],
    chat: [
      { id: uid('ch'), by: 'm3', text: 'Salaam! Reminder that contributions close Friday.', date: iso(1.2) },
      { id: uid('ch'), by: 'm1', text: 'Noted, I already sent mine via EVC Plus ✅', date: iso(1) },
      { id: uid('ch'), by: 'm5', text: 'May the payout reach Hodan this round, inshAllah.', date: iso(0.4) },
    ],
    polls: [
      { id: uid('pl'), question: 'Move monthly payout day to the 7th?',
        options: [ { id: 'yes', label: 'Yes', votes: 4 }, { id: 'no', label: 'No', votes: 2 }, { id: 'abs', label: 'Abstain', votes: 1 } ],
        closes: daysFromNow(3) },
    ],
    settings: { notifPayments: true, notifReminders: true, notifMembers: true, notifAnnouncements: true },
    admin: {
      users: 1284, activeGroups: 176, saccoGroups: 38, savingsAccounts: 642,
      volume: 218400, revenue: 4368, pendingKyc: 27, riskAlerts: 3, openEmergencies: 5, disputes: 2,
      growth: [
        { m: 'Mar', users: 640, volume: 92000 }, { m: 'Apr', users: 782, volume: 118000 },
        { m: 'May', users: 903, volume: 151000 }, { m: 'Jun', users: 1051, volume: 178000 },
        { m: 'Jul', users: 1180, volume: 201000 }, { m: 'Aug', users: 1284, volume: 218400 },
      ],
      ledger: [
        { time: '09:41', desc: 'Contribution · Banaadir Circle', amount: 100 },
        { time: '09:38', desc: 'Deposit · Zaad', amount: 150 },
        { time: '09:22', desc: 'Payout · Hargeisha Circle', amount: 200 },
      ],
    },
  };
}
