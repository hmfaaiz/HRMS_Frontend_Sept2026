/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-200%)' },
        },
      },
      colors: {
        tsecondary: "#E6F8FF",
        tlight: "#F5F5F5",
        tprimary: "#0093DD",
        tprimarydark: "#006294",
        tgreen : "#34b9a3",
        tred : "#e23f35",
        torange : "#dd8941",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
  corePlugins: {
    preflight: false,
  },
};
