export default {
  typography: {
    fontFamily: ['Open Sans', 'sans-serif'].join(','),
  },
  overrides: {
    MuiTypography: {
      h1: {
        fontWeight: 700,
        fontSize: 35,
        letterSpacing: '-0.24px'
      },
      h2: {
        fontWeight: 700,
        fontSize: 29,
        letterSpacing: '-0.24px'
      },
      h3: {
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: '-0.06px'
      },
      h4: {
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: '-0.06px'
      },
      h5: {
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: '-0.05px'
      },
      h6: {
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: '-0.05px'
      },
    }
  },
  overline: {
    fontWeight: 500
  },
  fontWeightRegular:{
    fontWeight: 300
  },
  fontWeightMedium:{
    fontWeight: 500
  }
};
