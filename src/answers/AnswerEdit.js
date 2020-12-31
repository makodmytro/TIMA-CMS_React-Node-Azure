import React from 'react';
import {
  Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';

const AnswerEdit = (props) => (
  <Edit {...props}>
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
  </Edit>
);

export default AnswerEdit;
