import React from 'react';
import {
  useAuthProvider,
  useRedirect,
  useNotify,
  useTranslate,
} from 'react-admin';
import {
  AuthenticatedTemplate, useMsal,
  useIsAuthenticated,
} from '@azure/msal-react';
import { Typography, Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { loginRequest } from '../azure-auth-config';
import Logo from '../assets/TIMA_logo.png';

const Authenticated = () => {
  const [error, setError] = React.useState(false);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const authProvider = useAuthProvider();
  const redirect = useRedirect();
  const notify = useNotify();
  const translate = useTranslate();

  const requestProfileData = async () => {
    try {
      // Silently acquires an access token which is then attached to a request for MS Graph data
      const { accessToken } = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      const success = await authProvider.exhangeToken({ token: accessToken });

      if (success) {
        redirect('/');
      }
    } catch (err) {
      if (err && err.status && err.status === 403) {
        setError(true);
      }

      notify('There was an error authenticating', 'error');
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      requestProfileData();
    }
  }, [isAuthenticated]);

  return (
    <Box
      textAlign="center"
      alignContent="center"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '30vh',
        boxSizing: 'border-box',
        backgroundImage: 'radial-gradient(circle at 50% 14em, #313264 0%, #00023b 60%, #00023b 100%)',
      }}
    >
      {
        !error && (
          <>
            <Box py={2}>
              <img src={Logo} alt="logo" width="135" />
            </Box>
            <Typography variant="body2" component="div" style={{ color: 'white' }}>
              LOADING
            </Typography>
          </>
        )
      }
      {
        error && (
          <Box textAlign="center" mt={15} px={20}>
            <Box p={2}>
              <Alert severity="info" elevation={3}>
                {translate('misc.azure_403')}
              </Alert>
            </Box>
          </Box>
        )
      }
    </Box>
  );
};

export default () => {
  return (
    <AuthenticatedTemplate>
      <Authenticated />
    </AuthenticatedTemplate>
  );
};
