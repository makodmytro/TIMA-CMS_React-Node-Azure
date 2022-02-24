import React from 'react';
import {
  Create,
  SimpleForm,
} from 'react-admin';
import FormFields from './components/FormFields';

const TopicCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <FormFields {...props} />
    </SimpleForm>
  </Create>
);

export default TopicCreate;
