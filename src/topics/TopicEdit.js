import React from 'react';
import {
  Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput, NumberInput,
} from 'react-admin';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);

const TopicEdit = (props) => (
  <Edit {...props} title={<TopicTitle />}>
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
