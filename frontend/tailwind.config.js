/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #f6a1fff5, #e886edf6, #AC9DFB, #7685FD, #4b6cfcec)',
        'box1-gradient': 'linear-gradient(105deg, rgb(216, 158, 255),#955cff)',
        'box2-gradient': 'linear-gradient(105deg, #d392ff,#c26afd)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        suse: ['SUSE', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },   
    },
  },
  plugins: [],
}