import React from 'react';
import './App.css';
import { Route } from 'react-router-dom'; // eslint-disable-line
import { Admin, Resource } from 'react-admin';
import theme from './common/theme';
import authProvider from './common/providers/authProvider';
import i18nProvider from './common/i18nProvider';
import resDataProvider from './common/providers/resDataProvider';

import topic from './topics';
import language from './languages';
import question from './questions';
import answer from './answers';
import source from './sources';
import sessions from './sessions';
import dashboard from './dashboard';

import MyLayout from './common/components/Layout';
import lngReducer from './common/reducer/lngReducer';

function App() {
  return (
    <Admin
      title="TIMA Management"
      theme={theme}
      layout={MyLayout}
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      dataProvider={resDataProvider}
      customReducers={{ lng: lngReducer }}
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
    </Admin>
  );
}

export default App;
