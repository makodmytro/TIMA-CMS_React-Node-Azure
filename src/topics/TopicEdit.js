import React from 'react';
import {
  Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';

const TopicEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="fallbackTopicLevel" />
      <ReferenceInput
        validate={required()}
        source="fk_languageId"
        reference="languages"
        label="resources.topics.fields.language"
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default TopicEdit;
