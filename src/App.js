import React from 'react';
import './App.css';
import { useStore } from 'react-redux';
import { Route, useLocation } from 'react-router-dom'; // eslint-disable-line
import {
  Resource,
  AdminContext,
  AdminUI,
  useDataProvider,
} from 'react-admin';
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
import MyLayout from './common/components/Layout';
import lngReducer from './common/reducer/lngReducer';
import customReducer from './common/reducer/custom';
import 'react-markdown-editor-lite/lib/index.css';
import Logo from './assets/TIMA_logo.png';
import theme from './common/theme';

const delay = (ms) => new Promise((r) => { // eslint-disable-line
  setTimeout(() => {
    return r();
  }, ms);
});

const AsyncResources = () => {
  const store = useStore();
  const dataProvider = useDataProvider();
  const location = useLocation();
  const [ready, setReady] = React.useState(false);
  const timeout = React.useRef(null);

  const check = async () => {
    try {
      await Promise.all([
        await dataProvider.activeSessions(),
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
  };

  const refreshSession = async () => {
    clearTimeout(timeout.current);
    timeout.current = null;

    await dataProvider.refreshSession();
  };

  const shouldRefreshSession = () => !timeout || !timeout.current;

  React.useEffect(() => {
    check();
  }, []);

  React.useEffect(() => {
    if (shouldRefreshSession() && location.pathname !== '/login') {
      timeout.current = setTimeout(() => {
        refreshSession();
      }, 1000 * 60 * 10);
    }

    if (location.pathname === '/login') {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, [location.pathname, timeout]);

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

  return (
    <AdminUI
      title="TIMA Management"
      theme={theme}
      layout={MyLayout}
      customRoutes={[
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
        />,
      ]}
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
              key="topics"
              name="topics"
              {...topic}
            />,
            languages,
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
          ]);
        }
      }

    </AdminUI>
  );
};

function App() {
  return (
    <AdminContext
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      dataProvider={resDataProvider}
      customReducers={{ lng: lngReducer, custom: customReducer }}
    >
      <AsyncResources />
    </AdminContext>
  );
}

export default App;
