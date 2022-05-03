import React, { Children, cloneElement } from 'react';
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
  useDataProvider,
  required,
} from 'react-admin';

const StepTwo = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  const tryToValidate = async (value) => {
    if (!value) {
      return 'Required';
    }

    if (value.length < 3) {
      return null;
    }

    const { data } = await dataProvider.getList('questions', {
      pagination: { perPage: 1, page: 1 },
      filter: {
        text: value,
        fk_topicId: initialValues.fk_topicId,
        fk_languageId: initialValues.fk_languageId,
      },
    });

    if (data && data.length) {
      if (data[0].text.toLowerCase() === value.toLowerCase()) {
        return translate('resources.questions.duplicated');
      }
    }

    return null;
  };

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators
      }}
      initialValues={initialValues}
      validate={async (values) => {
        const errors = {};

        (values.questions || []).forEach((q, i) => {
          if (!q || !q.text) {
            errors[`questions.${i}.text`] = translate('Required');
          }
        });

        return errors;
      }}
      render={({ handleSubmit, submitting, values, valid }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <ArrayInput source="questions" label="">
              <SimpleFormIterator disableRemove={(values.questions.length === 3)}>
                <TextInput label="resources.questions.fields.text" source="text" validate={tryToValidate} fullWidth />
              </SimpleFormIterator>
            </ArrayInput>
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
