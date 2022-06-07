import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#50E6FF',
    },
    secondary: {
      main: '#0078D4',
      // dark: '#456B91',
    },
    text: {
      primary: '#000000DE',
      secondary: '#000000DE',
    },
  },
  overrides: {
    RaLayout: {
      appFrame: {
        marginTop: '70px !important',
      },
    },
  },
  typography: {
    fontSize: 16,
  },
});

export default theme;
