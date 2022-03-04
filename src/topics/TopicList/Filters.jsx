import React from 'react';
import { Form } from 'react-final-form';
import {
  ReferenceInput,
  SelectInput,
  TextInput,
  useTranslate,
} from 'react-admin';
import Box from '@material-ui/core/Box';

const Filters = ({ onSubmit, initialValues }) => {
  const translate = useTranslate();
  const preSubmit = (values) => {
    return onSubmit(values);
  };

  return (
    <Form
      onSubmit={preSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box display="inline-block" px={1}>
              <TextInput
                label="misc.text"
                source="q"
                alwaysOn
                onChange={() => handleSubmit()}
              />
            </Box>
            <Box display="inline-block" px={1}>
              <ReferenceInput
                label="resources.topics.fields.language"
                source="fk_languageId"
                reference="languages"
                alwaysOn
                onChange={() => handleSubmit()}
                allowEmpty
                emptyText={translate('misc.none')}
              >
                <SelectInput optionText="name" allowEmpty emptyText={translate('misc.none')} />
              </ReferenceInput>
            </Box>
          </form>
        );
      }}
    />
  );
};

export default Filters;
