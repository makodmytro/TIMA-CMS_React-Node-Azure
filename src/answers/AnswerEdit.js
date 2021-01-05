import React from 'react';
import {
  Edit, SimpleForm,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';

const AnswerEdit = (props) => (
  <Edit {...props} actions={<CustomTopToolbar />}>
    <SimpleForm>
      <Form />
    </SimpleForm>
  </Edit>
);

export default AnswerEdit;
