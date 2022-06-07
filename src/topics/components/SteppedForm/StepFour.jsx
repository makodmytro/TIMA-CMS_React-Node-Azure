import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  TextInput,
  useTranslate,
  BooleanInput,
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
      validate={async (values) => {
        const errors = {};

        if (values.hasParent && !values.fk_parentTopicId) {
          errors.fk_parentTopicId = 'Required';
        }

        return errors;
      }}
      render={({ handleSubmit, submitting, values, valid }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <TextInput
                source="qnaMetadataKey"
                label="resources.topics.fields.qnaMetadataKey"
                fullWidth
              />
              <TextInput
                source="qnaMetadataValue"
                label="resources.topics.fields.qnaMetadataValue"
                fullWidth
              />
              <TextInput
                source="qnaApiEndpoint"
                label="resources.topics.fields.qnaApiEndpoint"
                fullWidth
              />
              <TextInput
                source="qnaApiVersion"
                label="resources.topics.fields.qnaApiVersion"
                fullWidth
              />
              <TextInput
                source="qnaSubscriptionKey"
                label="resources.topics.fields.qnaSubscriptionKey"
                autoComplete="new-password"
                type="password"
                fullWidth
              />
              <TextInput
                source="qnaKnowledgeBaseId"
                label="resources.topics.fields.qnaKnowledgeBaseId"
                autoComplete="new-password"
                fullWidth
              />
              <BooleanInput source="startSync" label="resources.topics.fields.startSync" />
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
