import React from 'react';
import './App.css';
import { Route } from 'react-router-dom'; // eslint-disable-line
import {
  Resource,
  AdminContext,
  AdminUI,
  useDataProvider,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import authProvider from './common/providers/authProvider';
import i18nProvider from './common/i18nProvider';
import resDataProvider from './common/providers/resDataProvider';
import topic from './topics';
import language from './languages';
import question from './questions';
import answer from './answers';
import sessions from './sessions';
import dashboard from './dashboard';
import MyLayout from './common/components/Layout';
import lngReducer from './common/reducer/lngReducer';
import 'react-markdown-editor-lite/lib/index.css';
import Logo from './assets/TIMA_logo.png';
import theme from './common/theme';

const delay = (ms) => new Promise((r) => { // eslint-disable-line
  setTimeout(() => {
    return r();
  }, ms);
});

const AsyncResources = () => {
  const dataProvider = useDataProvider();
  const [ready, setReady] = React.useState(false);

  const check = async () => {
    try {
      await Promise.all([
        await dataProvider.activeSessions(),
        await delay(250),
      ]);
    } catch (err) { // eslint-disable-line
    }

    setReady(true);
  };

  React.useEffect(() => {
    check();
  }, []);

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
      ]}
    >
      <Resource
        name="topics"
        {...topic}
      />
      <Resource
        name="languages"
        {...language}
      />
      <Resource
        name="questions"
        {...question}
      />
      <Resource
        name="answers"
        {...answer}
      />
      <Resource
        name="stats/sessions"
        {...sessions}
      />
      <Resource
        name="editors"
      />
    </AdminUI>
  );
};

function App() {
  return (
    <AdminContext
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      dataProvider={resDataProvider}
      customReducers={{ lng: lngReducer }}
    >
      <AsyncResources />
    </AdminContext>
  );
}

export default App;
