import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
} from 'react-admin';
import Button from '@material-ui/core/Button';

const LinkField = ({ record }) => (
  <div>
    <Button
      component="a"
      color="primary"
      href={record.link}
      target="_blank"
      rel="noreferrer"
      size="small"
      onClick={(e) => e.stopPropagation()}
      style={{ textTransform: 'none' }}
    >
      {record.contact}
    </Button>
  </div>
);

const DemosList = (props) => (
  <List {...props} bulkActionButtons={false}>
    <Datagrid rowClick="edit">
      <LinkField label="Link" />
      <TextField source="demoUrl" label="Demo URL" />
      <TextField source="code" />
      <DateField source="expiryDate" />
      <EditButton />
      <DeleteButton undoable={false} />
    </Datagrid>
  </List>
);

export default DemosList;
