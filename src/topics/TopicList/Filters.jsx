import React from 'react';
import { Form } from 'react-final-form';
import {
  ReferenceInput,
  SelectInput,
  TextInput,
} from 'react-admin';
import Box from '@material-ui/core/Box';

const Filters = ({ onSubmit, initialValues }) => {
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
              <TextInput label="Text" source="q" alwaysOn onChange={() => handleSubmit()} />
            </Box>
            <Box display="inline-block" px={1}>
              <ReferenceInput
                label="Language"
                source="fk_languageId"
                reference="languages"
                alwaysOn
                onChange={() => handleSubmit()}
                allowEmpty
                emptyText="None"
              >
                <SelectInput optionText="name" allowEmpty emptyText="None" />
              </ReferenceInput>
            </Box>
          </form>
        );
      }}
    />
  );
};

export default Filters;
