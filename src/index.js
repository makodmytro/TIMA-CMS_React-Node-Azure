import React from 'react';
import ReactDOM from 'react-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import {
  MsalProvider,
} from '@azure/msal-react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { ClearBrowserCacheBoundary } from 'react-clear-browser-cache';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { msalConfig } from './azure-auth-config';

const USE_AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN;

const msalInstance = new PublicClientApplication(msalConfig);

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

const Wrapper = ({ children }) => {
  if (USE_AZURE_LOGIN === '1') {
    return (
      <MsalProvider instance={msalInstance}>
        {children}
      </MsalProvider>
    );
  }

  return (
    <div>{children}</div>
  );
};

ReactDOM.render(
  <Sentry.ErrorBoundary fallback="An error has occurred">
  <ClearBrowserCacheBoundary auto fallback="Loading..." duration={2000}>
    <Wrapper>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </Wrapper>
  </ClearBrowserCacheBoundary>
  </Sentry.ErrorBoundary>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
