import React from 'react';
import {
  Datagrid, DateField, List, ReferenceField, TextField,
} from 'react-admin';

const SourceList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="text" />
      <ReferenceField source="fk_languageId" reference="languages">
        <TextField
          source="name"
        />
      </ReferenceField>
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default SourceList;
