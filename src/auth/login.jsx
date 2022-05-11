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
} from '@material-ui/core';
import Azure from './azure';
import Logo from '../assets/TIMA_logo.png';

const AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN === '1';

export default () => {
  const redirect = useRedirect();
  const translate = useTranslate();
  const [azureLoading, setAzureLoading] = React.useState(false);
  const { loading, authenticated } = useAuthState();

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
              <Box mt={10} p={2} boxShadow={3} bgcolor="white" borderRadius={3} textAlign="center">
                <Box py={2} textAlign="center">
                  <img src={Logo} alt="logo" width="135" />
                </Box>
                <Box py={2} textAlign="center">
                  <CircularProgress color="primary" />
                </Box>
              </Box>
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
            <Box mt={10} p={2} boxShadow={3} bgcolor="white" borderRadius={3} textAlign="center">
              <Box py={2} textAlign="center">
                <img src={Logo} alt="logo" width="135" />
              </Box>
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
                    <TextInput source="username" label={translate('resources.users.fields.email')} validate={required()} fullWidth />
                    <TextInput source="password" label={translate('resources.users.fields.password')} type="password" validate={required()} fullWidth />
                    <Button
                      type="submit"
                      variant="outlined"
                      fullWidth
                      color="primary"
                      disabled={submitting || loading || azureLoading}
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
              {
                AZURE_LOGIN && (
                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" style={{ textTransform: 'uppercase' }}>{translate('misc.or')}</Typography>
                    <Box textAlign="center" pt={2}>
                      <Azure setLoading={setAzureLoading} />
                    </Box>
                  </Box>
                )
              }
            </Box>
          </Grid>
        </Grid>
      </div>
      <Notification />
    </ThemeProvider>
  );
};
