import React from 'react';
import './App.css';
import {
  Admin, Resource, ListGuesser, EditGuesser,
} from 'react-admin';
import theme from './common/theme';
import authProvider from './common/providers/authProvider';
import i18nProvider from './common/i18nProvider';
import resDataProvider from './common/providers/resDataProvider';

import topic from './topics';
import language from './languages';
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
    >
      <Resource
        name="topics"
        {...topic}
      />
      <Resource
        name="editors"
      />
      <Resource
        name="languages"
        {...language}
      />
      <Resource
        name="questions"
        list={ListGuesser}
        edit={EditGuesser}
      />
    </Admin>
  );
}

export default App;
