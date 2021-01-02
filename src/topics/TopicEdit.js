import React from 'react';
import {
  Edit,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  SaveButton,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { ShowQuestions } from './TopicList';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);
const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton
      label="Save"
      redirect="list"
      submitOnEnter
    />
    <ShowQuestions size="medium" />
  </Toolbar>
);
const Img = ({ record }) => {
  if (!record.topicImageUrl) {
    return null;
  }

  return (
    <div>
      <img style={{ maxWidth: '200px' }} src={record.topicImageUrl} alt="topic" />
    </div>
  );
};

const TopicEdit = (props) => (
  <Edit {...props} title={<TopicTitle />} actions={<CustomTopToolbar />}>
    <SimpleForm toolbar={<CustomToolbar />}>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput source="topicKey" fullWidth />
      <TextInput source="topicImageUrl" fullWidth />
      <Img />
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
