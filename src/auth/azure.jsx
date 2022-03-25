import React from 'react';
import { useAuthProvider, useRedirect, useNotify } from 'react-admin';
import {
  AuthenticatedTemplate, useMsal,
  useIsAuthenticated,
} from '@azure/msal-react';
import { CircularProgress, Box } from '@material-ui/core';
import { loginRequest } from '../azure-auth-config';

const Authenticated = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const authProvider = useAuthProvider();
  const redirect = useRedirect();
  const notify = useNotify();

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
      notify('There was an error authenticating', 'error');
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      requestProfileData();
    }
  }, [isAuthenticated]);

  return (
    <Box height="100vh">
      <Box textAlign="center" mt={10}>
        <CircularProgress color="primary" />
      </Box>
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
