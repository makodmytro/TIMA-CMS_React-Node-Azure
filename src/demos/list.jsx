import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
} from 'react-admin';

const DemosList = (props) => (
  <List {...props} bulkActionButtons={false}>
    <Datagrid rowClick="edit">
      <TextField source="contact" />
      <TextField source="link" />
      <DateField source="expiryDate" />
      <TextField source="demoUrl" label="Demo URL" />
      <EditButton />
      <DeleteButton undoable={false} />
    </Datagrid>
  </List>
);

export default DemosList;
