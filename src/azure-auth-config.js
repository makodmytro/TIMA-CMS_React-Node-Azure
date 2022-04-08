/* eslint-disable */
import { LogLevel } from '@azure/msal-browser';

const AZURE_CLIENT_ID = process.env.REACT_APP_AZURE_CLIENT_ID;
const AZURE_AUTHORITY = process.env.REACT_APP_AZURE_AUTHORITY;
const AZURE_REDIRECT_URI = process.env.REACT_APP_AZURE_REDIRECT_URI;
const AZURE_LOGOUT_REDIRECT_URI = process.env.REACT_APP_AZURE_LOGOUT_REDIRECT_URI;
/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: AZURE_AUTHORITY,
    redirectUri: AZURE_REDIRECT_URI, // eslint-disable-line
    postLogoutRedirectUri: AZURE_LOGOUT_REDIRECT_URI, // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to 'true' if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message); // eslint-disable-line
            return;
          case LogLevel.Info:
            console.info(message); // eslint-disable-line
            return;
          case LogLevel.Verbose:
            console.debug(message); // eslint-disable-line
            return;
          case LogLevel.Warning:
            console.warn(message); // eslint-disable-line
            return;
        }
      }
    }
  }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ['User.Read']
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken
 */
 export async function callMsGraph(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
}
