import React from 'react';
import './App.css';
import { Admin, ListGuesser, Resource } from 'react-admin';
import theme from './common/theme';
import authProvider from './common/providers/authProvider';
import i18nProvider from './common/i18nProvider';
import resDataProvider from './common/providers/resDataProvider';

import topic from './topics';

function App() {
  return (
    <Admin
      title="TIMA Management"
      theme={theme}
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      dataProvider={resDataProvider}
    >
      <Resource
        name="topics"
        list={ListGuesser}
        {...topic}
      />
    </Admin>
  );
}

export default App;
