import evc from './evcPlus';
import zaad from './zaad';
import edahab from './edahab';
import sahal from './sahal';
import premier from './premier';
import mpesa from './mpesa';
import airtel from './airtel';
import bank from './bank';
import card from './card';

export const PROVIDERS = [evc, zaad, edahab, sahal, premier, mpesa, airtel, bank, card];
export const byId = (id) => PROVIDERS.find((p) => p.id === id);

export const PROVIDER_GROUPS = [
  { label: 'Somalia / Somaliland', ids: ['evc', 'zaad', 'edahab', 'sahal', 'premier'] },
  { label: 'Kenya & Diaspora', ids: ['mpesa', 'airtel', 'bank', 'card'] },
];
