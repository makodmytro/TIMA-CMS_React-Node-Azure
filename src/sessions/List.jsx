import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  TextField,
  Filter,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
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
      <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
      <ReferenceInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
      <DateTimeInput source="from" alwaysOn />
      <DateTimeInput source="until" alwaysOn />
    </Filter>
  );
};

const QuestionList = (props) => (
  <List {...props} filters={<Filters />} bulkActionButtons={false}>
    <Datagrid rowClick="show">
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="duration" label="duration" />
      <TextField source="questionsCount" label="# of questions" />
      <TextField source="answersCount" label="# of answers" />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default QuestionList;
