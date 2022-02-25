import React from 'react';
import {
  Create, required, SimpleForm, TextInput,
  BooleanInput,
  email,
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

const UsersCreate = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Create {...props} actions={<CustomTopToolbar />}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled={disabled} autoComplete="no" />
        <TextInput source="email" validate={[required(), email()]} fullWidth disabled={disabled} autoComplete="no" />
        <TextInput
          source="password"
          type="password"
          validate={required()}
          fullWidth
          disabled={disabled}
          helperText="Must be changed after first login"
          autoComplete="new-password"
        />
        <TextInput
          type="password"
          source="password_confirm"
          validate={(value, allValues) => {
            if (value !== allValues?.password) {
              return 'Password does not match';
            }

            return undefined;
          }}
          fullWidth
          disabled={disabled}
          helperText="Must be changed after first login"
          autoComplete="new-password"
        />
        <BooleanInput source="isActive" label="Active" disabled={disabled} />
        <BooleanInput source="isAdmin" label="Admin" disabled={disabled} />
      </SimpleForm>
    </Create>
  );
};

export default UsersCreate;
