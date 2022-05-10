import React from 'react';
import './App.css';
import { useStore } from 'react-redux';
import { Route, useLocation } from 'react-router-dom'; // eslint-disable-line
import { createBrowserHistory } from 'history'; // eslint-disable-line
import {
  Resource,
  AdminContext,
  AdminUI,
  useDataProvider,
  LoginComponent
} from 'react-admin';
import IdleTracker from 'idle-tracker';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import authProvider from './common/providers/authProvider';
import i18nProvider from './i18n';
import resDataProvider from './common/providers/resDataProvider';
import topic from './topics';
import language from './languages';
import question from './questions';
import answer from './answers';
import sessions from './sessions';
import dashboard from './dashboard';
import TestAsk from './answers/test';
import demos from './demos';
import users from './users';
import groups from './groups';
import audit from './audit';
import MyLayout from './common/components/Layout';
import lngReducer from './common/reducer/lngReducer';
import customReducer from './common/reducer/custom';
import 'react-markdown-editor-lite/lib/index.css';
import Logo from './assets/TIMA_logo.png';
import theme from './common/theme';
import Login from './auth/login';

const HIDE_MENU_ITEMS = process.env.REACT_APP_HIDE_MENU_ITEMS ? process.env.REACT_APP_HIDE_MENU_ITEMS.split(',') : [];
const DEFAULT_HOMEPAGE = process.env.REACT_APP_DEFAULT_HOMEPAGE;
const IDLE_TIMEOUT_SECONDS = process.env.REACT_APP_IDLE_TIMEOUT_SECONDS;
const IDLE_TIMEOUT_URL = process.env.REACT_APP_IDLE_TIMEOUT_URL;

const delay = (ms) => new Promise((r) => { // eslint-disable-line
  setTimeout(() => {
    return r();
  }, ms);
});
let idleTracker;

if (IDLE_TIMEOUT_SECONDS && IDLE_TIMEOUT_URL) {
  idleTracker = new IdleTracker({
    timeout: parseInt(IDLE_TIMEOUT_SECONDS, 10) * 1000,
    onIdleCallback: () => {
      sessionStorage.clear();
      window.location.href = IDLE_TIMEOUT_URL;
    },
  });
}

const AsyncResources = () => {
  const store = useStore();
  const dataProvider = useDataProvider();
  const location = useLocation();
  const [ready, setReady] = React.useState(false);
  const [tic, setTic] = React.useState(false);
  const [tac, setTac] = React.useState(false);
  const timeout = React.useRef(null);
  const topicsStatusTimeout = React.useRef(null);

  const isLoginScreen = () => location.pathname.includes('/login') || location.pathname.includes('/backdoor-login');
  const refreshSession = async () => {
    setTic(false);

    await dataProvider.refreshSession();

    setTic(true);
  };

  const refreshTopicStatus = async () => {
    setTac(false);

    try {
      const { data } = await dataProvider.topicStatus();

      store.dispatch({ type: 'CUSTOM_TOPICS_SYNC_STATUS', payload: data?.syncedTopics || 0 });
    } catch (e) { // eslint-disable-line
    }

    setTac(true);
  };

  const fetchWorkflow = async () => {
    if (sessionStorage.getItem('token') && process.env.REACT_APP_USE_WORKFLOW === '1') {
      try {
        const [roles, status] = await Promise.all([
          dataProvider.workflowRoles(),
          dataProvider.workflowStatus(),
        ]);
        store.dispatch({ type: 'CUSTOM_WORKFLOW_ROLES_FETCH_SUCCESS', payload: roles.data });
        store.dispatch({ type: 'CUSTOM_WORKFLOW_STATUS_FETCH_SUCCESS', payload: status.data });
      } catch (e) {} // eslint-disable-line
    }
  };

  const check = async () => {
    const a = async () => (isLoginScreen() || window.location.href.includes('code=') ? Promise.resolve() : dataProvider.activeSessions());

    try {
      await Promise.all([
        await a(),
        await delay(250),
      ]);
    } catch (err) { // eslint-disable-line
    }

    setReady(true);
    const languages = await dataProvider.getList('languages', {
      pagination: { perPage: 100, page: 1 },
    });
    const topics = await dataProvider.getList('topics', {
      pagination: { perPage: 200, page: 1 },
    });

    store.dispatch({ type: 'CUSTOM_LANGUAGES_FETCH_SUCCESS', payload: languages.data });
    store.dispatch({ type: 'CUSTOM_TOPICS_FETCH_SUCCESS', payload: topics.data });

    fetchWorkflow();

    await delay(500);
    setTac(true);
  };

  React.useEffect(() => {
    check();
  }, []);

  React.useEffect(() => {
    if (!isLoginScreen() && tac) {
      topicsStatusTimeout.current = setTimeout(() => {
        refreshTopicStatus();
      }, 1000 * 60 * 5);
    }

    if (isLoginScreen()) {
      clearTimeout(topicsStatusTimeout.current);
      topicsStatusTimeout.current = null;
    }
  }, [location.pathname, tac]);

  React.useEffect(() => {
    if (!isLoginScreen() && tic) {
      timeout.current = setTimeout(() => {
        refreshSession();
      }, 1000 * 60 * 10);
    }

    if (isLoginScreen()) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, [location.pathname, tic]);

  if (!ready) {
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
        <Box py={2}>
          <img src={Logo} alt="logo" width="135" />
        </Box>
        <Typography variant="body2" component="div" style={{ color: 'white' }}>
          LOADING
        </Typography>
      </Box>
    );
  }

  let customRoutes = [
    <Route
      exact
      key={0}
      path="/"
      component={dashboard}
    />,
    <Route
      exact
      key={1}
      path="/test-ask"
      component={TestAsk}
    />
  ];

  if (HIDE_MENU_ITEMS.includes('dashboard')) {
    customRoutes = [customRoutes[1]];
  }

  if (IDLE_TIMEOUT_SECONDS && IDLE_TIMEOUT_URL) {
    if (!isLoginScreen()) {
      idleTracker.start();
    } else {
      idleTracker.end();
    }
  }

  return (
    <AdminUI
      title="TIMA Management"
      theme={theme}
      layout={MyLayout}
      loginPage={Login}
      customRoutes={customRoutes}
    >
      {
        (permissions) => {
          const demo = permissions && permissions.allowDemo !== true
            ? null
            : (
              <Resource
                name="demos"
                key="demos"
                {...demos}
              />
            );

          const languages = (
            <Resource
              key="languages"
              name="languages"
              {...language}
            />
          );

          return ([
            <Resource
              key="answers"
              name="answers"
              {...answer}
            />,
            <Resource
              key="questions"
              name="questions"
              {...question}
            />,
            <Resource
              key="topics"
              name="topics"
              {...topic}
            />,
            languages,
            <Resource
              key="stats/sessions"
              name="stats/sessions"
              {...sessions}
            />,
            <Resource
              key="users"
              name="users"
              {...users}
            />,
            <Resource
              key="groups"
              name="groups"
              {...groups}
            />,
            demo,
            <Resource
              key="audit"
              name="audit"
              {...audit}
            />,
          ].sort((a, b) => {
            if (!DEFAULT_HOMEPAGE || !a) {
              return 0;
            }

            return a?.key.toLowerCase() === DEFAULT_HOMEPAGE ? -1 : 0;
          }));
        }
      }

    </AdminUI>
  );
};

const history = createBrowserHistory({
  forceRefresh: true,
  basename: '#/'
});

function App() {
  return (
    <AdminContext
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      dataProvider={resDataProvider}
      customReducers={{ lng: lngReducer, custom: customReducer }}
      history={history}
    >
      <AsyncResources />
    </AdminContext>
  );
}

export default App;
