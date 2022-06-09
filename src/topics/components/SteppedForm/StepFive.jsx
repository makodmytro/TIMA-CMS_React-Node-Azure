import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  SelectInput,
  useTranslate,
  required,
} from 'react-admin';

const StepFive = ({
  initialValues,
  onSubmit,
  onBack,
  groups,
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={({ fk_managedByGroupId }) => {
        return onSubmit({ fk_managedByGroupId });
      }}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, values, valid }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <SelectInput
                source="fk_managedByGroupId"
                label="resources.topics.fields.fk_managedByGroupId"
                choices={groups}
                validate={required()}
                optionText="name"
                optionValue="id"
                margin="dense"
                fullWidth
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

export default StepFive;
