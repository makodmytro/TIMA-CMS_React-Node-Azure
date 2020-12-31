import React from 'react';
import {
  Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';

const AnswerCreate = (props) => (
  <Create {...props} actions={<CustomTopToolbar />}>
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
