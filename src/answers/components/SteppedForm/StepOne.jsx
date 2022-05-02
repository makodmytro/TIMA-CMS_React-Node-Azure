import React from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  SelectInput,
  useTranslate,
  required,
} from 'react-admin';
import TopicSelect from '../../../topics/components/TopicSelect';

const StepOne = ({
  initialValues,
  onSubmit,
}) => {
  const translate = useTranslate();
  const languages = useSelector((s) => s.custom.languages);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};
        ['fk_languageId', 'fk_topicId'].forEach((field) => {
          if (!values[field]) {
            errors[field] = translate('Required');
          }
        });

        return errors;
      }}
      render={({ handleSubmit, valid, values }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <SelectInput
              source="fk_languageId"
              label="resources.answers.fields.fk_languageId"
              choices={languages}
              validate={required()}
              optionText="name"
              optionValue="id"
              margin="dense"
              fullWidth
              disabled={languages.length < 2}
            />
            <TopicSelect
              source="fk_topicId"
              label="resources.answers.fields.fk_topicId"
              disabled={!values.fk_languageId}
              filter={{ fk_languageId: values.fk_languageId }}
              isRequired
            />
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
