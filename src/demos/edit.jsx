import React from 'react';
import { connect } from 'react-redux';
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  DateInput,
  SelectInput,
} from 'react-admin';

const EditDemo = ({ dispatch, topics, ...props }) => (
  <Edit {...props} undoable={false}>
    <SimpleForm>
      <TextInput source="contact" fullWidth validate={required()} />
      <TextInput source="code" fullWidth disabled />
      <TextInput source="link" fullWidth validate={required()} />
      <DateInput source="expiryDate" label="Expiry date" validate={required()} fullWidth />
      <TextInput source="demoUrl" fullWidth validate={required()} disabled />
      <SelectInput
        source="defaultTopicKey"
        optionValue="topicKey"
        optionText="name"
        choices={Object.values(topics).filter((t) => t.topicKey)}
        allowEmpty
        emptyText="None"
        fullWidth
      />
    </SimpleForm>
  </Edit>
);

const mapStateToProps = (state) => {
  const topics = state.custom.topics
    ? state.custom.topics
    : [];

  return { topics };
};

export default connect(mapStateToProps)(EditDemo);
