import React from 'react';
import {
  Create,
  SimpleForm,
} from 'react-admin';
import FormFields from './components/FormFields';
import CustomTopToolbar from '../common/components/custom-top-toolbar';

const TopicCreate = (props) => {
  return (
    <Create {...props} actions={<CustomTopToolbar />}>
      <SimpleForm>
        <FormFields {...props} />
      </SimpleForm>
    </Create>
  );
};

export default TopicCreate;
