import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#e4eaf4',
      main: '#4EC2A8',
    },
    secondary: {
      dark: '#456B91',
      main: '#498CA7',
    },
    text: {
      primary: '#000000DE',
      secondary: '#4EC2A8',
    },
  },
});

export default theme;
