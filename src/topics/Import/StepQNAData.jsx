import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  TextInput,
  useTranslate,
  required,
} from 'react-admin';

const StepFour = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, values, valid }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <TextInput
                source="qnaApiEndpoint"
                label="resources.topics.fields.qnaApiEndpoint"
                fullWidth
                validate={required()}
              />
              <TextInput
                source="qnaSubscriptionKey"
                label="resources.topics.fields.qnaSubscriptionKey"
                autoComplete="new-password"
                type="password"
                fullWidth
                validate={required()}
              />
              <TextInput
                source="qnaKnowledgeBaseId"
                label="resources.topics.fields.qnaKnowledgeBaseId"
                autoComplete="new-password"
                fullWidth
                validate={required()}
              />
              <TextInput
                source="qnaApiVersion"
                label="resources.topics.fields.qnaApiVersion"
                fullWidth
                validate={required()}
              />
            </Box>
            <Box textAlign="right">
              <Button type="button" variant="outlined" color="primary" size="small" onClick={() => onBack(values)}>
                {translate('misc.back')}
              </Button>
              &nbsp;
              <Button type="submit" disabled={!valid || submitting} variant="contained" color="secondary" size="small">
                {translate('misc.next')}
              </Button>
            </Box>
          </form>
        );
      }}
    />
  );
};

export default StepFour;
