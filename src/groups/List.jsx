import React, { cloneElement, useState } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import {
  Datagrid,
  DateField,
  List,
  TextField,
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

const GroupsList = (props) => {
  const columns = [
    {
      key: 'name',
      el: (<TextField source="name" />),
    },
    {
      key: 'createdAt',
      el: (<DateField source="createdAt" />),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'groups'));

  return (
    <>
      <AppBar position="static" color="secondary">
        <Tabs
          variant="fullWidth"
          value={1}
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
              onColumnsChange={handleColumnsChange('groups', setVisibleColumns)}
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

export default GroupsList;
