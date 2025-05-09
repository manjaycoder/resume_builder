module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          dark: '#0d1117',
          light: '#161b22'
        }
      }
    },
  },
  plugins: [require("daisyui")],
}