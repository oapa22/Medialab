/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors:{
        'blue-utpl': '#06446f',
        'yellow-utpl': '#FCBD31'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',  // Cambiado a 0.5 segundos
      },
    },
  },
  plugins: [
    function({ addUtilities }){
      addUtilities({
        '.text-title-1':{
          fontSize: '1rem',
          '@screen sm': {
            fontSize: '1.2rem',
          },
          '@screen md': {
            fontSize: '1.7rem',
          },
          '@screen lg': {
            fontSize: '2rem',
          },
          '@screen xl': {
            fontSize: '2.5rem',
          },
        },

        '.text-title-2':{
          fontSize: '0.6rem',
          '@screen sm': {
            fontSize: '0.7rem',
          },
          '@screen md': {
            fontSize: '0.8rem',
          },
          '@screen lg': {
            fontSize: '1rem',
          },
          '@screen xl': {
            fontSize: '1.2rem',
          },
        },

        '.text-content-1':{
          fontSize: '0.5rem',
          '@screen sm': {
            fontSize: '0.7rem',
          },
          '@screen md': {
            fontSize: '0.9rem',
          },
          '@screen lg': {
            fontSize: '1rem',
          },
          '@screen xl': {
            fontSize: '1.1rem',
          },
        },

        '.text-content-2':{
          fontSize: '0.4rem',
          '@screen sm': {
            fontSize: '0.7rem',
          },
          '@screen md': {
            fontSize: '0.8rem',
          },
          '@screen lg': {
            fontSize: '0.9rem',
          },
          '@screen xl': {
            fontSize: '1rem',
          },
        },

        '.text-content-3':{
          fontSize: '0.4rem',
          '@screen sm': {
            fontSize: '0.5rem',
          },
          '@screen md': {
            fontSize: '0.6rem',
          },
          '@screen lg': {
            fontSize: '0.7rem',
          },
          '@screen xl': {
            fontSize: '0.8rem',
          },
        },
      })
    }
  ],
}

