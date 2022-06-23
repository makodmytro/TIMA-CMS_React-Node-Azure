import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Create,
  SimpleForm,
} from 'react-admin';
import { Box } from '@material-ui/core';
import SteppedForm from './components/SteppedForm';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import FormFields from './components/FormFields';
import NonAdminFormFields from './components/NonAdminFormFields';
import { useIsAdmin } from '../hooks';

const TopicCreate = (props) => {
  const isAdmin = useIsAdmin();
  const { search } = useLocation();
  const querystring = new URLSearchParams(search);
  const fk_parentTopicId = parseInt(querystring.get('fk_parentTopicId'), 10);

  if (fk_parentTopicId) {
    if (!isAdmin) {
      return (
        <Create {...props} actions={<CustomTopToolbar />}>
          <SimpleForm initialValues={{ fk_parentTopicId }}>
            <NonAdminFormFields {...props} disableTopicSelection />
          </SimpleForm>
        </Create>
      );
    }

    return (
      <Create {...props} actions={<CustomTopToolbar />}>
        <SimpleForm initialValues={{ fk_parentTopicId }}>
          <FormFields {...props} disableTopicSelection />
        </SimpleForm>
      </Create>
    );
  }

  return (
    <Box>
      <SteppedForm />
    </Box>
  );
};

export default TopicCreate;
