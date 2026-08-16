const NAMES = ['Amina Hassan','Yusuf Abdi','Fadumo Ali','Mohamed Ibrahim','Khadija Warsame','Hodan Yusuf','Omar Sheikh','Abdullahi Farah'];
const GROUPS = ['Banaadir Women’s Circle','Hargeisha Traders Circle','Hormuud Cooperative SACCO'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const amt = (min, max) => Math.round((min + Math.random() * (max - min)) / 5) * 5;

export function nextEvent() {
  const r = Math.random();
  const name = pick(NAMES);
  const group = pick(GROUPS);
  if (r < 0.28) {
    const amount = amt(50, 200);
    return { type: 'contribution', title: `${name} paid a contribution`, body: `$${amount} to ${group}`, amount, name, group };
  }
  if (r < 0.46) return { type: 'member', title: `${name} joined a group`, body: `Welcomed into ${group}`, name, group };
  if (r < 0.62) {
    const amount = amt(300, 900);
    return { type: 'payout', title: 'Payout completed', body: `$${amount} delivered to ${name}`, amount, name };
  }
  if (r < 0.78) return { type: 'trust', title: 'Trust score increased', body: `${name} reached a new milestone`, name };
  return { type: 'deposit', title: 'Deposit received', body: `${name} added $${amt(40, 260)} to savings`, amount: amt(40, 260), name };
}
