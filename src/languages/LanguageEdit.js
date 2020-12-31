import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';

const LanguageTitle = ({ record }) => (record ? <span>{record.name}</span> : null);

const LanguageEdit = (props) => (
  <Edit {...props} title={<LanguageTitle />} actions={<CustomTopToolbar />}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="code" validate={required()} />
      <TextInput source="welcomeText" validate={required()} />
      <TextInput source="welcomeButton" validate={required()} />
    </SimpleForm>
  </Edit>
);

export default LanguageEdit;
