// tailwind.config.js

module.exports = {
  content: [
    './resources/**/*.{edge,js,ts,vue,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}