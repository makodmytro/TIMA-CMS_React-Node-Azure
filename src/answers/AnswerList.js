import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  ReferenceInput,
  SelectInput,
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
      <TextInput label="Text" source="q" alwaysOn />
      <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectInput optionText="name" className={classes.select} />
      </ReferenceInput>
      <ReferenceArrayInput label="Editor" source="fk_editorId" reference="editors" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
    </Filter>
  );
};

const AnswerList = (props) => (
  <List {...props} filters={<Filters />}>
    <Datagrid rowClick="edit">
      <TextField source="text" />
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="Editor.name" label="Editor" sortBy="fk_editorId" />
      <TextField source="Topic.name" label="Topic" sortBy="fk_topicId" />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default AnswerList;
