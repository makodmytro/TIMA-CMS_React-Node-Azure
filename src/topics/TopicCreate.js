import React from 'react';
import {
  Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';

const TopicCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="topicKey" fullWidth />
      <TextInput source="topicImageUrl" fullWidth />
      <ReferenceInput
        validate={required()}
        source="fk_languageId"
        reference="languages"
        label="resources.topics.fields.language"
        fullWidth
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <TextInput source="welcomeText" fullWidth />
    </SimpleForm>
  </Create>
);

export default TopicCreate;
