import React from 'react';
import { Form } from 'react-final-form';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import arrayMutators from 'final-form-arrays'; // eslint-disable-line
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  ArrayInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
  BooleanInput,
  useDataProvider,
  required,
} from 'react-admin';
import TopicSelect from '../TopicSelect';

const StepTwo = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={({ fk_parentTopicId }) => {
        return onSubmit({ fk_parentTopicId });
      }}
      initialValues={{
        ...initialValues,
        hasParent: !!initialValues.fk_parentTopicId,
      }}
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
              <BooleanInput source="hasParent" label="resources.topics.fields.has_fk_parentTopicId" />
              {
                values.hasParent && (
                  <TopicSelect
                    source="fk_parentTopicId"
                    label="resources.topics.fields.fk_parentTopicId"
                    allowEmpty
                    depth={2}
                    anyLevelSelectable
                    filterFunction={(t) => t.name.toLowerCase() !== values.name.toLowerCase()}
                  />
                )
              }
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

export default StepTwo;
