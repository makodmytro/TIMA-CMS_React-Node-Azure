import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
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
      <ReferenceArrayInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Editor" source="fk_editorId" reference="editors" alwaysOn perPage={100}>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
    </Filter>
  );
};

const AnswerList = (props) => (
  <List {...props} filters={<Filters />}>
    <Datagrid rowClick="edit">
      <TextField source="text" />
      <ReferenceField source="fk_languageId" reference="languages">
        <TextField
          source="name"
        />
      </ReferenceField>
      <TextField source="Editor.name" label="Editor" sortBy="fk_editorId" />
      <TextField source="Topic.name" label="Topic" sortBy="fk_topicId" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default AnswerList;
