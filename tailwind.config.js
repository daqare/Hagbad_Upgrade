/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { 50:'#f0f7f2',100:'#dcece0',200:'#b9d9c4',300:'#8dbfa1',400:'#5c9f7b',500:'#3d8160',600:'#2c664b',700:'#24523e',800:'#1e4233',900:'#0F3D2E',950:'#08281e' },
        teal: { 50:'#effaf9',100:'#d7f2f0',200:'#b0e4e2',300:'#7dd0cf',400:'#43b3b3',500:'#279697',600:'#1f787c',700:'#1d6064',800:'#1d4d51',900:'#0D4F4A',950:'#063432' },
        gold: { 50:'#fdf9ec',100:'#f9efcd',200:'#f2dd96',300:'#eac65f',400:'#e3b13a',500:'#D4A017',600:'#b97f11',700:'#945e12',800:'#7a4b16',900:'#673e17',950:'#3b200a' },
        coral: { 50:'#fdf3f0',100:'#fbe4dd',200:'#f8cbbb',300:'#f2a78d',400:'#ea7856',500:'#E76F51',600:'#d04a26',700:'#ae3c1e',800:'#90341d',900:'#78301d',950:'#41160c' },
        plum: { 50:'#faf5fa',100:'#f6ecf6',200:'#efdbf0',300:'#e3bfe5',400:'#d297d5',500:'#b96fc0',600:'#9d4f9f',700:'#833f81',800:'#6d366a',900:'#4A2545',950:'#331136' },
        sand: { 50:'#FDFBF6',100:'#FAF6EF',200:'#F5EFE3',300:'#EDE3CE',400:'#E0D0B0',500:'#CBb184',600:'#B29260',700:'#94754c',800:'#7a6041',900:'#645038',950:'#362a1d' },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"','system-ui','sans-serif'],
        body: ['Inter','system-ui','sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15,61,46,0.08)',
        lift: '0 16px 44px rgba(15,61,46,0.14)',
        glow: '0 0 40px rgba(212,160,23,0.25)',
      },
      keyframes: {
        floaty: { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-16px)'} },
        shimmer: { '0%':{backgroundPosition:'-600px 0'}, '100%':{backgroundPosition:'600px 0'} },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};
