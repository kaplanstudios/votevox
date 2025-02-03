module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        // Black and white color scheme
        'black-background': '#000000',
        'white-text': '#FFFFFF',
        'white-border': '#FFFFFF',
      },
      backgroundColor: {
        'black-background': '#000000',
        'black-card': '#000000',
        'white-hover': '#1A1A1A', // Slightly lighter for hover effect
      },
      textColor: {
        'white-text': '#FFFFFF',
      },
      borderColor: {
        'white-border': '#FFFFFF',
      },
      spacing: {
        'standard-padding': '16px',
      },
    },
  },
  plugins: [],
};
