import React, { cloneElement, useState } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import {
  Datagrid,
  DateField,
  List,
  TextField,
  BooleanField,
} from 'react-admin';
import {
  Tab,
  AppBar,
  Tabs,
  Box,
} from '@material-ui/core';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      {...props}
    />
  );
}

const UsersList = (props) => {
  const columns = [
    {
      key: 'name',
      el: (<TextField source="name" />),
    },
    { key: 'email', el: (<TextField source="email" />) },
    {
      key: 'last_login',
      el: (<DateField source="lastLogin" />),
    },
    {
      key: 'createdAt',
      el: (<DateField source="createdAt" />),
    },
    { key: 'created_by', el: (<TextField source="created_by" />) },
    { key: 'isActive', el: (<BooleanField source="isActive" label="is active" />) },
    { key: 'isAdmin', el: (<BooleanField source="isAdmin" label="is admin" />) },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'users'));

  return (
    <>
      <AppBar position="static" color="secondary">
        <Tabs
          variant="fullWidth"
          value={0}
          aria-label="nav tabs example"
          TabIndicatorProps={{ style: { background: 'white' } }}
        >
          <LinkTab label="Users" to="/users" />
          <LinkTab label="Groups" to="/groups" />
        </Tabs>
      </AppBar>
      <Box p={2} boxShadow={3}>
        <List
          {...props}
          bulkActionButtons={false}
          actions={(
            <ListActions
              visibleColumns={visibleColumns}
              onColumnsChange={handleColumnsChange('users', setVisibleColumns)}
              columns={columns}
            />
          )}
        >
          <Datagrid rowClick="edit">
            {columns.filter((col) => visibleColumns.includes(col.key))
              .map((col) => cloneElement(col.el, { key: col.key }))}
          </Datagrid>
        </List>
      </Box>
    </>
  );
};

export default UsersList;
