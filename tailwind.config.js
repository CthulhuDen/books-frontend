/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts}'],
  content: [],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'base' // only generate global styles
    }),
    require('daisyui'),
    require('@headlessui/tailwindcss')
  ]
}
