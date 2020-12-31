import React from 'react';
import {
  Edit,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { ShowQuestions } from './TopicList';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);
const Actions = ({ data, ...rest }) => {
  if (!data) {
    return null;
  }

  return (
    <CustomTopToolbar>
      <ShowQuestions record={data} />
    </CustomTopToolbar>
  );
};

const TopicEdit = (props) => (
  <Edit {...props} title={<TopicTitle />} actions={<Actions />}>
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
    </SimpleForm>
  </Edit>
);

export default TopicEdit;
