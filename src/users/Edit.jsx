import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
  SaveButton,
  DeleteButton,
  Toolbar,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
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
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={disabled}
      />
    </Toolbar>
  );
};

const UsersEdit = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Edit
      {...props}
      actions={<CustomTopToolbar />}
      undoable={false}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled />
        <TextInput source="email" validate={required()} fullWidth disabled />
        <BooleanInput source="isActive" label="Active" disabled={disabled} />
        <BooleanInput source="isAdmin" label="Admin" disabled={disabled} />
        <ReferenceArrayInput source="groups" reference="groups" fullWidth>
          <SelectArrayInput source="name" />
        </ReferenceArrayInput>
      </SimpleForm>
    </Edit>
  );
};

export default UsersEdit;
