import React from 'react';
import {
  Create, required, SimpleForm, TextInput,
  BooleanInput,
  usePermissions,
  Toolbar,
  SaveButton,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import TagsInputs from '../answers/components/tags-input';
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

const UsersCreate = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Create {...props} actions={<CustomTopToolbar />}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled={disabled} />
        <TextInput source="email" validate={required()} fullWidth disabled={disabled} />
        <TextInput source="password" validate={required()} fullWidth disabled={disabled} inputProps={{ helperText: 'as' }} helperText="asd" />
        <BooleanInput source="is_users_manager" label="Is users manager" disabled={disabled} />
        <BooleanInput source="is_topics_manager" label="Is topics manager" disabled={disabled} />
        <TagsInputs source="related_groups" label="Groups" disabled={disabled} />
      </SimpleForm>
    </Create>
  );
};

export default UsersCreate;
