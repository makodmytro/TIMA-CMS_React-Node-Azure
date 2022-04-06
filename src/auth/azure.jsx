import React from 'react';
import {
  useAuthProvider,
  useDataProvider,
  useRedirect,
  useNotify,
  useTranslate,
} from 'react-admin';
import { useStore } from 'react-redux';
import {
  AuthenticatedTemplate, useMsal,
  useIsAuthenticated,
} from '@azure/msal-react';
import { Typography, Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { loginRequest } from '../azure-auth-config';
import Logo from '../assets/TIMA_logo.png';

const AZURE_LOGOUT_REDIRECT_URI = process.env.REACT_APP_AZURE_LOGOUT_REDIRECT_URI;

const Authenticated = () => {
  const [error, setError] = React.useState(false);
  const { instance, accounts } = useMsal();
  const dataProvider = useDataProvider();
  const store = useStore();
  const isAuthenticated = useIsAuthenticated();
  const authProvider = useAuthProvider();
  const redirect = useRedirect();
  const notify = useNotify();
  const translate = useTranslate();

  const requestProfileData = async () => {
    try {
      // Silently acquires an access token which is then attached to a request for MS Graph data
      console.log('requestProfileData called');
      const { accessToken } = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      console.log('accessToken', accessToken);

      const success = await authProvider.exhangeToken({ token: accessToken });
      console.log('requestProfileData - exchangeToken success=', success);

      if (success) {
        redirect('/');

        try {
          const [roles, status] = await Promise.all([
            dataProvider.workflowRoles(),
            dataProvider.workflowStatus(),
          ]);
          store.dispatch({ type: 'CUSTOM_WORKFLOW_ROLES_FETCH_SUCCESS', payload: roles.data });
          store.dispatch({ type: 'CUSTOM_WORKFLOW_STATUS_FETCH_SUCCESS', payload: status.data });
        } catch (e) {} // eslint-disable-line
      }
    } catch (err) {
      console.log('Failed to obtain MS token - error details:', JSON.stringify(err));
      console.error(err);
      if (err?.subError === 'consent_required') {
        const url = `${process.env.REACT_APP_AZURE_AUTHORITY}/adminconsent?client_id=${process.env.REACT_APP_AZURE_CLIENT_ID}&state=1&redirect_uri=${process.env.REACT_APP_AZURE_REDIRECT_URI}`;
        window.location.href = url;
      } else {
        setError(true);
        notify('Azure authentication failed', 'error');
      }
    }
  };

  const onClick = () => {
    instance.logoutRedirect({
      account: accounts[0],
      postLogoutRedirectUri: AZURE_LOGOUT_REDIRECT_URI,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
          <Box textAlign="center" mt={15} display="flex" justifyContent="center">
            <Box p={2} width="40vw">
              <Alert severity="info" elevation={3}>
                {translate('misc.azure_403')}
              </Alert>
              <Box mt={2}>
                <Typography onClick={onClick} variant="body2" style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
                  {translate('ra.auth.logout')}
                </Typography>
              </Box>
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
