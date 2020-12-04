import React from 'react';
import {
  Datagrid,
  List,
  TextField,
  DateField,
  ReferenceField,
} from 'react-admin';

const TopicList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="fallbackTopicLevel" />
      <DateField source="updatedAt" />
      <ReferenceField label="resources.topics.fields.language" source="fk_languageId" reference="languages"><TextField source="name" /></ReferenceField>
      <ReferenceField label="resources.topics.fields.editor" source="fk_editorId" reference="editors"><TextField source="name" /></ReferenceField>
    </Datagrid>
  </List>
);

export default TopicList;
