import React from 'react';
import {
  Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput, NumberInput,
} from 'react-admin';

const TopicEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <NumberInput source="fallbackTopicLevel" />
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
