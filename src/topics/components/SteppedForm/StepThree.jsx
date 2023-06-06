import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useTranslate, SelectInput, required } from 'react-admin';

const StepThree = ({ initialValues, onSubmit, onBack }) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        kbIntegration: '1',
      }}
      render={({ handleSubmit, valid, values, submitting }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <SelectInput
                source="kbIntegration"
                label="resources.topics.fields.kbIntegration"
                choices={[
                  { name: translate('resources.topics.kbIntegration.microsoft_language_studio'), id: '1' },
                  { name: translate('resources.topics.kbIntegration.microsoft_qna_maker'), id: '0' },
                  { name: translate('resources.topics.kbIntegration.amazon_lex'), id: '2', disabled: true },
                  { name: translate('resources.topics.kbIntegration.gpt3'), id: '3', disabled: true },
                ]}
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

export default StepThree;
