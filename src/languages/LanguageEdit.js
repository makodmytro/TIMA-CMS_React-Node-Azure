import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';

const LanguageTitle = ({ record }) => (record ? <span>{record.name}</span> : null);

const LanguageEdit = (props) => (
  <Edit {...props} title={<LanguageTitle />} actions={<CustomTopToolbar />}>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="code" validate={required()} fullWidth />
      <PlayableTextInput
        source="welcomeText"
        validate={required()}
        lang={(r) => r.code}
        fullWidth
      />
      <PlayableTextInput
        source="welcomeButton"
        validate={required()}
        lang={(r) => r.code}
        fullWidth
      />
    </SimpleForm>
  </Edit>
);

export default LanguageEdit;
