import React from 'react';
import {
  Create, required, SimpleForm, TextInput,
  Toolbar,
  SaveButton,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { useIsAdmin } from '../hooks';

const CustomToolbar = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="Save"
        redirect="list"
        submitOnEnter
        disabled={props.pristine || disabled}
      />
    </Toolbar>
  );
};

const GroupsCreate = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Create {...props} actions={<CustomTopToolbar />}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled={disabled} />
      </SimpleForm>
    </Create>
  );
};

export default GroupsCreate;
