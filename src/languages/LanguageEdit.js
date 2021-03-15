import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
  usePermissions,
  SaveButton,
  DeleteButton,
  Toolbar,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';

const LanguageTitle = ({ record }) => (record ? <span>{record.name}</span> : null);

const CustomToolbar = (props) => (
  <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
    <SaveButton
      label="Save"
      redirect="list"
      submitOnEnter
      disabled={props.pristine || (props.permissions && !props.permissions.allowEdit)}
    />
    <DeleteButton
      basePath={props.basePath}
      record={props.record}
      undoable={false}
      disabled={props.permissions && !props.permissions.allowDelete}
    />
  </Toolbar>
);

const LanguageEdit = (props) => {
  const { permissions } = usePermissions();

  return (
    <Edit
      {...props}
      title={<LanguageTitle />}
      actions={<CustomTopToolbar />}
    >
      <SimpleForm toolbar={<CustomToolbar permissions={permissions} />}>
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
};

export default LanguageEdit;
