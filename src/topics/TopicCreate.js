import React from 'react';
import {
  Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';
import { Advanced } from './TopicEdit';

const TopicCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="welcomeText" multiline rows="5" fullWidth />
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
      <TextInput source="topicImageUrl" fullWidth />
      <Advanced source="topicKey" />
    </SimpleForm>
  </Create>
);

export default TopicCreate;
