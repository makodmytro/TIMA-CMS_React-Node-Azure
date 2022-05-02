import React from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays'; // eslint-disable-line
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  ArrayInput,
  SimpleFormIterator,
  TextInput,
  useTranslate,
  required,
} from 'react-admin';

const StepTwo = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators
      }}
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};

        (values.questions || []).forEach((q, i) => {
          if (!q || !q.text) {
            errors[`questions.${i}.text`] = translate('Required');
          }
        });

        return errors;
      }}
      render={({ handleSubmit, valid, values }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <ArrayInput source="questions" label="">
              <SimpleFormIterator disableRemove={(values.questions.length === 3)}>
                <TextInput label="resources.questions.fields.text" source="text" validate={required()} />
              </SimpleFormIterator>
            </ArrayInput>
            <Box textAlign="right">
              <Button type="button" variant="outlined" color="primary" size="small" onClick={() => onBack(values)}>
                {translate('misc.back')}
              </Button>
              &nbsp;
              <Button type="submit" disabled={!valid} variant="contained" color="secondary" size="small">
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
