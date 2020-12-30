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
  SelectArrayInput,
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
      <ReferenceArrayInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
    </Filter>
  );
};

const QuestionList = (props) => (
  <List {...props} filters={<Filters />} bulkActionButtons={false}>
    <Datagrid rowClick="show">
      <TextField source="clientIP" label="IP" />
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="Topic.name" label="Topic" sortBy="fk_topicId" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default QuestionList;
