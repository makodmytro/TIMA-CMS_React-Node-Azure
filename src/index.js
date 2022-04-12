import React from 'react';
import ReactDOM from 'react-dom';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import {
  MsalProvider,
  MsalAuthenticationTemplate,
} from '@azure/msal-react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { msalConfig } from './azure-auth-config';

const USE_AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN;
const BACKDOOR_LOGIN = process.env.REACT_APP_USE_BACKDOOR_LOGIN === '1';

const msalInstance = new PublicClientApplication(msalConfig);

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

const Wrapper = ({ children }) => {
  if (window.location.href.includes('/backdoor-login') && BACKDOOR_LOGIN) {
    return (<div>{children}</div>);
  }

  if (USE_AZURE_LOGIN === '1') {
    return (
      <MsalProvider instance={msalInstance}>
        <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
          {children}
        </MsalAuthenticationTemplate>
      </MsalProvider>
    );
  }

  return (
    <div>{children}</div>
  );
};

ReactDOM.render(
  <Sentry.ErrorBoundary fallback="An error has occurred">
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </Wrapper>
  </Sentry.ErrorBoundary>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
