import React from 'react';
import {
  Create, required, SimpleForm, TextInput,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';

const LanguageCreate = (props) => (
  <Create {...props} actions={<CustomTopToolbar />}>
    <SimpleForm warnWhenUnsavedChanges>
      <TextInput source="name" validate={required()} />
      <TextInput source="code" validate={required()} />
      <TextInput source="welcomeText" validate={required()} />
      <TextInput source="welcomeButton" validate={required()} />
    </SimpleForm>
  </Create>
);

export default LanguageCreate;
