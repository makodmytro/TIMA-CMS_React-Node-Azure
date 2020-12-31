import React from 'react';
import {
  Datagrid,
  List,
  TextField,
  DateField,
} from 'react-admin';

const LanguageList = (props) => (
  <List {...props} bulkActionButtons={false}>
    <Datagrid rowClick="edit">
      <TextField source="code" />
      <TextField source="name" />
      <TextField source="welcomeText" />
      <TextField source="welcomeButton" />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default LanguageList;
