import React, { useState } from 'react';
import {
  AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, MsalProvider,
  useIsAuthenticated,
} from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from '../azure-auth-config';

const msalInstance = new PublicClientApplication(msalConfig);

const L = () => {
  const { instance, accounts } = useMsal();

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    }).then((response) => {
      console.log(response);
      // callMsGraph(response.accessToken).then(response => setGraphData(response));
    });
  }

  return (
    <div>
      {JSON.stringify(accounts)}
      <button type="button" onClick={RequestProfileData}>Click</button>
    </div>
  );
};

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = (loginType) => {
      if (loginType === 'popup') {
          instance.loginPopup(loginRequest).catch(e => {
              console.log(e);
          });
      } else if (loginType === 'redirect') {
          instance.loginRedirect(loginRequest).catch(e => {
              console.log(e);
          });
      }
  };

  return (
    <div>
      <button type="button" onClick={() => handleLogin('popup')}>
        Popup
      </button>
      <button type="button" onClick={() => handleLogin('redirect')}>
        Redirect
      </button>
    </div>
  );
};

export default () => {
  return (
    <MsalProvider instance={msalInstance}>
      <SignInButton />
    </MsalProvider>
  );
};
