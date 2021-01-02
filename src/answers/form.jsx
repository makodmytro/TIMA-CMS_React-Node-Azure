import React from 'react';
import {
  ReferenceInput, required, SelectInput, TextInput,
} from 'react-admin';

const Form = () => (
  <>
    <TextInput source="text" validate={required()} fullWidth />
    <ReferenceInput
      source="fk_languageId"
      reference="languages"
      validate={required()}
      fullWidth
    >
      <SelectInput
        optionText="name"
      />
    </ReferenceInput>
    <ReferenceInput
      source="fk_topicId"
      reference="topics"
      validate={required()}
      fullWidth
    >
      <SelectInput
        optionText="name"
      />
    </ReferenceInput>
  </>
);

export default Form;
