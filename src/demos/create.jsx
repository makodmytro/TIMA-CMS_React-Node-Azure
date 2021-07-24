import React from 'react';
import { connect } from 'react-redux';
import { useField } from 'react-final-form'; // eslint-disable-line
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  DateInput,
  SelectInput,
} from 'react-admin';

const CreateDemo = ({ dispatch, topics, ...props }) => (
  <Create {...props}>
    <SimpleForm initialValues={{ baseDemoUrl: 'https://demo1.tima-online.com' }}>
      <TextInput source="contact" fullWidth validate={required()} />
      <TextInput source="link" fullWidth validate={required()} />
      <DateInput source="expiryDate" label="Expiry date" validate={required()} fullWidth />
      <TextInput source="baseDemoUrl" fullWidth validate={required()} />
      <SelectInput
        source="defaultTopic"
        optionValue="topicKey"
        optionText="name"
        choices={topics.filter((t) => t.topicKey)}
        allowEmpty
        emptyText="None"
        fullWidth
      />
      <TextInput source="totalSessionsCount" label="Total sessions count" fullWidth type="number" />
    </SimpleForm>
  </Create>
);

const mapStateToProps = (state) => {
  const topics = state.custom.topics
    ? state.custom.topics
    : [];

  return { topics };
};

export default connect(mapStateToProps)(CreateDemo);
