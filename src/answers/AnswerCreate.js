import React from 'react';
import {
  Create,
  SimpleForm,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './components/form';
import SteppedForm from './components/SteppedForm';

const AnswerCreate = (props) => {
  return (
    <Box>
      <SteppedForm onSubmit={() => {}} />
    </Box>
  );

  return (
    <Create {...props} actions={<CustomTopToolbar />}>
      <SimpleForm>
        <Form />
      </SimpleForm>
    </Create>
  );
};

export default AnswerCreate;
