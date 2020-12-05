import React from 'react';
import {
  Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput, NumberInput,
} from 'react-admin';

const TopicCreate = (props) => (
  <Create {...props}>
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
  </Create>
);

export default TopicCreate;
