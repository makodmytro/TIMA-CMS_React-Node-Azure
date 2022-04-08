import React, { cloneElement, useState } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import { useSelector } from 'react-redux';
import {
  Datagrid,
  DateField,
  List,
  FunctionField,
  TextField,
  BooleanField,
  useTranslate,
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

const AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN === '1';

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      {...props}
    />
  );
}

const UsersList = (props) => {
  const roles = useSelector((state) => state.custom.workflowRoles);
  const translate = useTranslate();
  const columns = [
    {
      key: 'name',
      el: (<TextField source="name" />),
    },
    { key: 'email', el: (<TextField source="email" />) },
    {
      key: 'roles',
      el: (
        <FunctionField
          source="userRoles"
          render={(record) => {
            return roles
              .filter((r) => (record.userRoles || []).includes(r.value))
              .map((r) => translate(`resources.users.workflow.roles.${r.name}`))
              .join(', ');
          }}
        />
      ),
    },
    {
      key: 'lastLogin',
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
          <LinkTab label={translate('misc.users')} to="/users" />
          <LinkTab label={translate('misc.groups')} to="/groups" />
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
              createButtonLabel={AZURE_LOGIN ? translate('resources.users.add') : null}
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
