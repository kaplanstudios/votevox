module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        // Black background color
        'black-background': '#000000',
        'black-card': '#000000',
        'gray-text': '#ffffff',
        // New custom colors
        'charcoal-gray': '#2E2E2E',  // Charcoal gray for card background
        'light-gray': '#D3D3D3',     // Light gray for borders
        'light-blue': '#A0D3E0',     // Light blue for buttons and votes
      },
      backgroundColor: {
        // Black background color
        'black-background': '#000000',
        'black-card': '#000000',
        // New custom background color
        'charcoal-gray': '#2E2E2E',  // Charcoal gray for card background
      },
      textColor: {
        // White text color on black background
        'gray-text': '#ffffff',
        // New custom text color
        'light-blue': '#A0D3E0',      // Light blue text for votes and buttons
      },
      borderColor: {
        // Black borders
        'black-border': '#000000',
        // New custom borders
        'light-gray': '#D3D3D3',       // Light gray for borders
      },
      spacing: {
        // Adjust the padding if necessary for the uniform look
        'spacing-standard': '16px',
      },
    },
  },
  plugins: [],
}
