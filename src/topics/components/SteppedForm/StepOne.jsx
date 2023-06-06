import React from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { SelectInput, TextInput, useTranslate, required } from 'react-admin';

const StepOne = ({ initialValues, onSubmit }) => {
  const translate = useTranslate();
  const languages = useSelector((s) => s.custom.languages);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};
        ['fk_languageId', 'name'].forEach((field) => {
          if (!values[field]) {
            errors[field] = translate('Required');
          }
        });

        return errors;
      }}
      render={({ handleSubmit, valid, values }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextInput source="name" fullWidth label="resources.topics.fields.name" autoComplete="no" />
            {languages && languages.length > 1 && (
              <SelectInput
                source="fk_languageId"
                label="resources.topics.fields.fk_languageId"
                choices={languages}
                validate={required()}
                optionText="name"
                optionValue="id"
                margin="dense"
                fullWidth
                disabled={languages.length < 2}
              />
            )}
            <Box textAlign="right">
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

export default StepOne;
