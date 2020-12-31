import React from 'react';
import {
  Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';

const AnswerEdit = (props) => (
  <Edit {...props} actions={<CustomTopToolbar />}>
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
