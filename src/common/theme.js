import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const USE_ALT_THEME = process.env.REACT_APP_USE_ALT_THEME === '1';

let palette = {
  primary: {
    main: '#3F4349',
  },
  secondary: {
    main: '#246974',
    dark: '#456B91',
  },
};

if (USE_ALT_THEME) {
  palette = {
    primary: {
      main: '#3F4349',
    },
    secondary: {
      main: '#246974',
      // dark: '#456B91',
    },
  };
}

const theme = createMuiTheme({
  palette: {
    ...palette,
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
