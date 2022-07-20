import * as React from 'react';
import { Form } from 'react-final-form';
import {
  useLogin,
  useNotify,
  Notification,
  defaultTheme,
  TextInput,
  required,
  useAuthState,
  useRedirect,
  useTranslate,
} from 'react-admin';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import Azure from './azure';
import Logo from '../assets/TIMA_logo.png';
import AltLogo from '../assets/QnA Manager Logo.png';

const AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN === '1';
const USE_ALT_THEME = process.env.REACT_APP_USE_ALT_THEME === '1';

const styles = makeStyles(() => ({
  input: {
    '& input': {
      backgroundColor: '#f1f1f1',
    },
  },
}));

const Wrapper = ({ children }) => {
  if (USE_ALT_THEME) {
    return (
      <Box
        mt={10}
        p={2}
        boxShadow={3}
        bgcolor="white"
        borderRadius={3}
        textAlign="center"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)', color: 'white' }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box mt={10} p={2} boxShadow={3} bgcolor="white" borderRadius={3} textAlign="center">
      {children}
    </Box>
  );
}

export default () => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const [azureLoading, setAzureLoading] = React.useState(false);
  const { loading, authenticated } = useAuthState();
  const classes = styles();

  React.useEffect(() => {
    if (authenticated && !loading) {
      redirect('/');
    }
  }, [authenticated, loading]);

  const login = useLogin();
  const notify = useNotify();

  const onSubmit = async (values) => {
    return login(values).then(() => redirect('/')).catch((e) => {
      notify(e?.body?.message || 'Authentication failed', 'error');
    });
  };

  const l = loading || azureLoading;

  if (azureLoading) {
    return (
      <ThemeProvider theme={createMuiTheme(defaultTheme)}>
        <div style={{ minHeight: '100vh', minWidth: '100vw' }}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <Wrapper>
                <Box py={2} textAlign="center">
                  <img src={USE_ALT_THEME ? AltLogo : Logo} alt="logo" width="135" />
                </Box>
                <Box py={2} textAlign="center">
                  <CircularProgress color="primary" />
                </Box>
              </Wrapper>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={createMuiTheme(defaultTheme)}>
      <div style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <Wrapper>
              <Box py={2} textAlign="center">
                <img src={USE_ALT_THEME ? AltLogo : Logo} alt="logo" width="135" />
              </Box>
              {
                AZURE_LOGIN && (
                  <Box textAlign="center" mb={2}>
                    <Box textAlign="center" py={2}>
                      <Azure setLoading={setAzureLoading} />
                    </Box>
                    <Typography variant="body2" style={{ textTransform: 'uppercase', color: USE_ALT_THEME ? 'white' : 'default' }}>
                      {translate('misc.or')}
                    </Typography>
                  </Box>
                )
              }
              <Form
                autoComplete="off"
                autoFill="off"
                onSubmit={onSubmit}
                initialValues={{
                  username: '',
                  password: '',
                }}
                render={({ handleSubmit, submitting }) => (
                  <form onSubmit={handleSubmit}>
                    <TextInput
                      source="username"
                      label={translate('resources.users.fields.email')}
                      validate={required()}
                      fullWidth
                      className={USE_ALT_THEME ? classes.input : null}
                    />
                    <TextInput
                      source="password"
                      label={translate('resources.users.fields.password')}
                      type="password"
                      validate={required()}
                      fullWidth
                      className={USE_ALT_THEME ? classes.input : null}
                    />
                    <Button
                      type="submit"
                      variant="outlined"
                      fullWidth
                      color={USE_ALT_THEME ? 'secondary' : 'primary'}
                      disabled={submitting || loading || azureLoading}
                      style={{ color: USE_ALT_THEME ? 'white' : 'default' }}
                    >
                      {
                        l && (
                          <CircularProgress color="primary" />
                        )
                      }
                      {
                        !l && (
                          <>{translate('misc.login')}</>
                        )
                      }
                    </Button>
                  </form>
                )}
              />
            </Wrapper>
          </Grid>
        </Grid>
      </div>
      <Notification />
    </ThemeProvider>
  );
};
