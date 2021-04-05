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
/*
  import InputLabel from '@material-ui/core/InputLabel';
  import MenuItem from '@material-ui/core/MenuItem';
  import FormControl from '@material-ui/core/FormControl';
  import Select from '@material-ui/core/Select';

  const TopicKeySelect = ({ topics, ...props }) => {
    const { input: { value, onChange } } = useField(props.source);

    return (
      <FormControl>
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={onChange}
        >
          <MenuItem value="">None</MenuItem>
          {
            Object.values(topics).map((topic, i) => (
              <MenuItem value={topic.topicKey} key={i}>{topic.name}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    );
  };
*/

const CreateDemo = ({ dispatch, topics, ...props }) => (
  <Create {...props}>
    <SimpleForm initialValues={{ baseDemoUrl: 'https://demo1.tima-online.com' }}>
      <TextInput source="contact" fullWidth validate={required()} />
      <TextInput source="link" fullWidth validate={required()} />
      <DateInput source="expiryDate" label="Expiry date" validate={required()} fullWidth />
      <TextInput source="baseDemoUrl" fullWidth validate={required()} />
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
  </Create>
);

const mapStateToProps = (state) => {
  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : {};

  return { topics };
};

export default connect(mapStateToProps)(CreateDemo);
