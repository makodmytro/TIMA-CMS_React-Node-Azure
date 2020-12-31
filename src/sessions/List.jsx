import React from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import {
  Datagrid,
  DateField,
  List,
  TextField,
  Filter,
  TextInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectArrayInput,
  SelectInput,
  ShowButton,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(() => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
}));

const Filters = (props) => {
  const classes = styles();

  return (
    <Filter {...props} className={classes.padded}>
      <TextInput label="IP" source="clientIP" alwaysOn />
      <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectInput optionText="name" className={classes.select} />
      </ReferenceInput>
      <ReferenceArrayInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
    </Filter>
  );
};

const ConditionalShow = ({ record, basePath }) => {
  if (record.questionsCount === 0 && record.answersCount === 0) {
    return null;
  }

  return (
    <ShowButton record={record} basePath={basePath} />
  );
};

const QuestionList = (props) => (
  <List {...props} filters={<Filters />} bulkActionButtons={false}>
    <Datagrid rowClick={null}>
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="duration" label="duration" />
      <TextField source="questionsCount" label="# of questions" />
      <TextField source="answersCount" label="# of answers" />
      <DateField source="updatedAt" showTime />
      <ConditionalShow />
    </Datagrid>
  </List>
);

export default QuestionList;
