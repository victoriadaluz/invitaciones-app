/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal
        'rose-powder': '#F4A2C6',
        'sky-soft': '#7EC8E3',
        'warm-yellow': '#F9D56E',
        'mint': '#A3D9A5',
        
        // Neutros
        'off-white': '#FDFBF7',
        'gray-soft': '#F5F3F0',
        'gray-light': '#E5E0D8',
        'gray-mid': '#6B6B6B',
        'gray-dark': '#2C2C2C',
    
        'rosa': '#EC268F',
        'amarillo': '#FFF212',
        'cielo': '#00AFEF',
        'verde-esmeralda': '#00A859',
        'rojo': '#ED2F59',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
