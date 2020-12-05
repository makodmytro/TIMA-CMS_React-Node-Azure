import React from 'react';
import {
  Create, required, SimpleForm, TextInput,
} from 'react-admin';

const LanguageCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="code" validate={required()} />
      <TextInput source="welcomeText" validate={required()} />
      <TextInput source="welcomeButton" validate={required()} />
    </SimpleForm>
  </Create>
);

export default LanguageCreate;
