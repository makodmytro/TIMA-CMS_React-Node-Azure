import React from 'react';
import {
  Title
} from 'react-admin';
import Box from '@material-ui/core/Box';
import SteppedForm from './components/SteppedForm';

const AnswerCreate = (props) => {
  return (
    <Box>
      <Title title="Create answer" />
      <SteppedForm onSubmit={() => {}} />
    </Box>
  );
};

export default AnswerCreate;
