import React from 'react';
import {
  Create,
  SimpleForm,
} from 'react-admin';
import { Box } from '@material-ui/core';
import FormFields from './components/FormFields';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import SteppedForm from './components/SteppedForm';

/*const TopicCreate = (props) => {
  return (
    <Create {...props} actions={<CustomTopToolbar />}>
      <SimpleForm>
        <FormFields {...props} />
      </SimpleForm>
    </Create>
  );
};*/

const TopicCreate = () => {
  return (
    <Box>
      <SteppedForm />
    </Box>
  );
};

export default TopicCreate;
