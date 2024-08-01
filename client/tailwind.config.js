/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': { 'min': '1191px', 'max': '1250px' },
      'md': { 'min': '1251px', 'max': '1360px' },
      'lg': { 'min': '1361px', 'max': '1440px' },
      'xl': { 'min': '1441px', 'max': '1620px' },
      '2xl': { 'min': '1621px' },
    },
    extend: {
      colors: {
        customOrange1: '#fc9d21',
      },
      screens: {
        'mdMobile': { 'min': '50px', 'max': '376px' },
        'lgMobile': { 'min': '376px', 'max': '426px' },
        'xlMobile': { 'min': '426px', 'max': '525px' },
        'tablet': { 'min': '525px', 'max': '768px' },
        'smLaptop': { 'min': '769px', 'max': '950px' },
        'laptop': { 'min': '951px', 'max': '1024px' },
        'xxsm': { 'min': '1025px', 'max': '1110px' },
        'xsm': { 'min': '1111px', 'max': '1190px' },
        print: { raw: 'print' },
      },
      fontFamily: {
        ruda: ['Ruda', 'sans-serif'],
        shanti: ['Shanti', 'sans-serif'],
        hind: ['Hind Vadodara', 'sans-serif']
      }
    },
  },
  plugins: [],
}

