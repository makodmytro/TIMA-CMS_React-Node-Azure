import React from 'react';
import {
  Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';

const AnswerCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="text" validate={required()} />
      <ReferenceInput
        source="fk_languageId"
        reference="languages"
        validate={required()}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <ReferenceInput
        source="fk_topicId"
        reference="topics"
        validate={required()}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default AnswerCreate;
