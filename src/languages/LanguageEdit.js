import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
  SaveButton,
  DeleteButton,
  Toolbar,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';
import { useIsAdmin } from '../hooks';

const LanguageTitle = ({ record }) => (record ? <span>{record.name}</span> : null);

const CustomToolbar = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="Save"
        redirect="list"
        submitOnEnter
        disabled={disabled}
      />
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={disabled}
      />
    </Toolbar>
  );
};

const LanguageEdit = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Edit
      {...props}
      title={<LanguageTitle />}
      actions={<CustomTopToolbar />}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled={disabled} />
        <TextInput source="code" validate={required()} fullWidth disabled={disabled} />
        <PlayableTextInput
          source="welcomeText"
          validate={required()}
          lang={(r) => r.code}
          fullWidth
          disabled={disabled}
        />
        <PlayableTextInput
          source="welcomeButton"
          validate={required()}
          lang={(r) => r.code}
          fullWidth
          disabled={disabled}
        />
      </SimpleForm>
    </Edit>
  );
};

export default LanguageEdit;
