import React from 'react';
import {
  Datagrid, DateField, List, ReferenceField, TextField,
} from 'react-admin';

const TopicList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="fallbackTopicLevel" />
      <ReferenceField
        label="resources.topics.fields.language"
        source="fk_languageId"
        reference="languages"
      >
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField
        label="resources.topics.fields.editor"
        source="fk_editorId"
        reference="editors"
      >
        <TextField
          source="name"
        />
      </ReferenceField>
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default TopicList;
