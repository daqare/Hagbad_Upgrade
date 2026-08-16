export const uid = (p = 'id') =>
  `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const txnRef = () =>
  'HGB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
