export const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'so', label: 'Soomaali', flag: '🇸🇴' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

const dict = {
  en: {},
  so: { dashboard: 'Bogga Hore', wallet: 'Boorsada', groups: 'Kooxaha', savings: 'Kaydka' },
  ar: { dashboard: 'الرئيسية', wallet: 'المحفظة', groups: 'المجموعات', savings: 'المدخرات' },
};

export function t(lang, key) {
  return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
}
