import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useTranslate } from 'react-admin';
import MarkdownInput from '../MarkdownInput';
import TagsInput from '../tags-input';

const StepThree = ({ initialValues, onSubmit, onBack }) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};

        if (!values?.text) {
          errors.text = translate('Required');
        }

        return errors;
      }}
      render={({ handleSubmit, valid, values, submitting }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <MarkdownInput label="resources.answers.fields.text" source="text" />
            <TagsInput source="tags" label="resources.answers.fields.tags" />
            <Box textAlign="right">
              <Button type="button" variant="outlined" color="primary" size="small" onClick={() => onBack(values)}>
                {translate('misc.back')}
              </Button>
              &nbsp;
              <Button type="submit" disabled={!valid || submitting} variant="contained" color="secondary" size="small">
                {translate('misc.create')}
              </Button>
            </Box>
          </form>
        );
      }}
    />
  );
};

export default StepThree;
