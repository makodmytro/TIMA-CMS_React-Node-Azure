import React from 'react';
import {
  Datagrid, DateField, List, ReferenceField, TextField,
} from 'react-admin';

const AnswerList = (props) => (
  <List {...props} perPage={50} pagination={false}>
    <Datagrid rowClick="edit">
      <TextField source="text" />
      <ReferenceField source="fk_languageId" reference="languages">
        <TextField
          source="name"
        />
      </ReferenceField>
      <ReferenceField source="fk_editorId" reference="editors">
        <TextField
          source="name"
        />
      </ReferenceField>
      <ReferenceField source="fk_topicId" reference="topics">
        <TextField
          source="name"
        />
      </ReferenceField>
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default AnswerList;
