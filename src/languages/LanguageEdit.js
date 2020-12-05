import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
} from 'react-admin';

const LanguageEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="code" validate={required()} />
      <TextInput source="welcomeText" validate={required()} />
      <TextInput source="welcomeButton" validate={required()} />
    </SimpleForm>
  </Edit>
);

export default LanguageEdit;
