import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  DateInput,
} from 'react-admin';

const CreateDemo = (props) => (
  <Create {...props}>
    <SimpleForm initialValues={{ baseDemoUrl: 'https://demo1.tima-online.com' }}>
      <TextInput source="contact" fullWidth validate={required()} />
      <TextInput source="link" fullWidth validate={required()} />
      <DateInput source="expiryDate" label="Expiricy date" validate={required()} fullWidth />
      <TextInput source="baseDemoUrl" fullWidth validate={required()} />
    </SimpleForm>
  </Create>
);

export default CreateDemo;
