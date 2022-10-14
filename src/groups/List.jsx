import React, { cloneElement, useState } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import { useSelector } from 'react-redux';
import {
  Datagrid,
  DateField,
  List,
  TextField,
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

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      style={{ textDecoration: 'underline', border: '2px solid white' }}
      {...props}
    />
  );
}

const WorkflowRole = ({ record }) => {
  const roles = useSelector((state) => state.custom.workflowRoles);
  const translate = useTranslate();

  const match = roles.find((r) => r.value === record?.workflowRole);

  if (!match) {
    return '-';
  }

  return (
    <TextField
      source="role"
      record={{ role: translate(`resources.users.workflow.roles.${match.name}`) }}
    />
  );
};

const GroupsList = (props) => {
  const translate = useTranslate();
  const columns = [
    {
      key: 'name',
      el: (<TextField source="name" />),
    },
    {
      key: 'workflowRole',
      el: (<WorkflowRole label="resources.users.workflow.role" />),
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
          <LinkTab label={translate('misc.users')} to="/users" />
          <LinkTab label={translate('misc.groups')} to="/groups" disabled />
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
          sort={{ field: 'updatedAt', order: 'DESC' }}
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
