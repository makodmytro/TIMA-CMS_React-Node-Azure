import React from 'react';
import {
  Create,
  SimpleForm,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';

const AnswerCreate = (props) => (
  <Create {...props} actions={<CustomTopToolbar />}>
    <SimpleForm>
      <Form />
    </SimpleForm>
  </Create>
);

export default AnswerCreate;
