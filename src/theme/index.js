import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

//console.log(typography)
const theme = createMuiTheme({
  ...typography,
  ...shadows,
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white, 
      black: '#000'
    },
    primary: {
      main: '#22AAA1',
      dark: '#136F63',
      light: '#44DAD0'
    },
    secondary: {
      main: '#84CAE7',
      dark: '#33A5D7',
      light: '#99D2EB'
    },
    text: {
      primary: '#000',
      secondary: "#fff"
    }
  }
});

export default theme;