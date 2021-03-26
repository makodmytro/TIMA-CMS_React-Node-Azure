import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  DateInput,
} from 'react-admin';

const EditDemo = (props) => (
  <Edit {...props} undoable={false}>
    <SimpleForm>
      <TextInput source="contact" fullWidth validate={required()} />
      <TextInput source="link" fullWidth validate={required()} />
      <DateInput source="expiryDate" label="Expiricy date" validate={required()} fullWidth />
      <TextInput source="demoUrl" fullWidth validate={required()} />
    </SimpleForm>
  </Edit>
);

export default EditDemo;
