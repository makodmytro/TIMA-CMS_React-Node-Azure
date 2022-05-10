import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
  SaveButton,
  DeleteButton,
  Toolbar,
  useTranslate,
  useDataProvider,
  useRefresh,
} from 'react-admin';
import {
  Box,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import ConfirmButton from '../common/components/ConfirmButton';
import WorkflowRole from './components/WorkflowRole';
import AddUsersDialog from './components/AddUsersDialog';
import { useIsAdmin } from '../hooks';

const CustomToolbar = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="ra.action.save"
        redirect="list"
        submitOnEnter
        disabled={props.pristine || disabled}
      />
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={disabled}
      />
    </Toolbar>
  );
};

const UsersList = ({ record }) => {
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const translate = useTranslate();

  const onConfirm = async (id) => {
    await dataProvider.removeUserFromGroup(null, {
      id: record?.id,
      user_id: id,
    });
    refresh();
  };

  if (!record?.Users || !record?.Users?.length) {
    return null;
  }

  return (
    <Box mt={2}>
      <Box borderBottom="1px solid #d5d5d5" mb={2}>
        <Typography variant="body2">
          {translate('resources.groups.users')}
        </Typography>
      </Box>
      <Box px={1}>
        <Box textAlign="right">
          <AddUsersDialog record={record} />
        </Box>
        {
          record?.Users?.map((user) => {
            return (
              <Box key={user.id} display="flex" pt={1}>
                <Box flex={3} borderBottom="1px dotted #e5e5e5">{user.name}</Box>
                <Box flex={1}>
                  <ConfirmButton
                    onConfirm={() => onConfirm(user.id)}
                    title={translate('misc.remove')}
                    content={translate('resources.groups.remove_user')}
                    component={(
                      <IconButton
                        type="button"
                        size="small"
                        color="primary"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  />
                </Box>
              </Box>
            );
          })
        }
      </Box>
    </Box>
  );
};

const LanguageEdit = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Edit
      {...props}
      actions={<CustomTopToolbar />}
      undoable={false}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled={disabled} />
        <WorkflowRole source="workflowRole" fullWidth disabled={disabled} />
        <UsersList />
      </SimpleForm>
    </Edit>
  );
};

export default LanguageEdit;
