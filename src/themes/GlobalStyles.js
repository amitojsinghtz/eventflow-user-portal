import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    html: {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      height: '100%',
      width: '100%',
      fontFamily: "'Open Sans', sans-serif"
    },
    body: {
      backgroundColor: '#f4f6f8',
      height: '100%',
      width: '100%'
    },
    a: {
      textDecoration: 'none',
      fontFamily: "'Open Sans', sans-serif",
      color: '#22AAA1',
      '&:hover':{
        color: '#136F63'
      },
      cursor:'pointer'
    },
    '#root': {
      height: '100%',
      width: '100%'
    },
    '.MuiButton-containedPrimary':{
      '& .MuiButton-label':{
        color:'#fff'
      }
    },
    
    
  }
}));

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
