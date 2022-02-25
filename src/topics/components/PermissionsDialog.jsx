import React from 'react';
import {
  Dialog,
  Box,
  Button,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Form } from 'react-final-form'; // eslint-disable-line
import {
  useDataProvider,
  useNotify,
  SelectInput,
  BooleanInput,
  Confirm,
} from 'react-admin';
import CloseIcon from '@material-ui/icons/Close';
import TrashIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import PencilIcon from '@material-ui/icons/Edit';

const Bool = ({ v }) => {
  if (v) {
    return <CheckIcon fontSize="small" color="primary" />;
  }

  return <CloseIcon fontSize="small" />;
};

const PermissionForm = ({
  initialValues, onSubmit, groups, isEdit,
}) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};

        ['group_id'].forEach((field) => {
          if (!values[field]) {
            errors[field] = 'Required';
          }
        });

        return errors;
      }}
      render={({ handleSubmit, valid, reset }) => {
        return (
          <form
            onSubmit={(event) => {
              handleSubmit(event).then(reset);
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box px={1} flex="4">
                <SelectInput
                  source="group_id"
                  label="Group"
                  choices={groups}
                  optionText="name"
                  optionValue="id"
                  margin="dense"
                  disabled={isEdit}
                  fullWidth
                />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="view" label="View" />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="edit" label="Edit" />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="manage" label="Manage" />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="delete" label="Delete" />
              </Box>

              <Box px={1} flex="1">
                <Button
                  style={{ marginTop: '-25px' }}
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={!valid}
                  size="small"
                >
                  { isEdit ? 'Save' : 'Create' }
                </Button>
              </Box>
            </Box>
          </form>
        );
      }}
    />
  );
};

const PermissionsDialog = ({
  id,
  onClose,
  open,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [topic, setTopic] = React.useState(null);
  const [allGroups, setGroups] = React.useState([]);
  const [editting, setEditting] = React.useState(null);
  const [deleting, setDeleting] = React.useState(null);

  const fetchGroups = async () => {
    try {
      const { data } = await dataProvider.getList('groups', {
        pagination: { page: 1, perPage: 1000 },
      });

      setGroups(data);
    } catch (err) {
      notify('Failed to get groups', 'error');
    }
  };

  const init = async () => {
    try {
      setEditting(null);
      setDeleting(null);

      const { data } = await dataProvider.getOne('topics', {
        id,
      });

      setTopic(data);
    } catch (err) {
      notify('Failed to get permissions', 'error');
    }
  };

  const onSubmit = async ({ group_id, ...values }) => {
    try {
      const { data } = await dataProvider.topicCreatePermission('topics', {
        group_id,
        topic_id: topic?.id,
        data: values,
      });

      notify('Saved successfully');
      init();
    } catch (err) {
      notify('Failed to get groups', 'error');
    }
  };

  const onDeleteCancel = () => setDeleting(null);
  const onDelete = async () => {
    try {
      await dataProvider.topicDeletePermission('topics', {
        topic_id: topic?.id,
        group_id: deleting,
      });

      init();
    } catch (err) {
      notify('Failed to delete', 'error');
    }
  };

  React.useEffect(() => {
    if (open) {
      init();
      fetchGroups();
    }
  }, [open]);

  const withPermission = (topic?.PermissionSets || []).map((ps) => ps.fk_groupId);
  const groups = allGroups.filter((group) => {
    return !withPermission.includes(group.id);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableBackdropClick>
      <Box p={2} display="flex" borderBottom="1px solid #D5D5D5">
        <Box flex="2">
          <Typography>Manage permissions: <b>{topic?.name}</b></Typography>
        </Box>
        <Box flex="1" textAlign="right">
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box p={2}>
        {
          !!deleting && (
            <Confirm
              isOpen={!!deleting}
              loading={false}
              title="Delete"
              content="Are you sure you want to delete the permission?"
              onConfirm={onDelete}
              onClose={onDeleteCancel}
              confirm="Delete"
              cancel="Cancel"
            />
          )
        }
        {
          !topic && (<Box textAlign="text-center"><Typography variant="body2">Loading...</Typography></Box>)
        }
        {
          !!topic && !topic?.PermissionSets?.length && (
            <Box py={2}><Typography variant="body2">This topic has no permissions yet</Typography></Box>
          )
        }
        {
          !!topic && !!topic?.PermissionSets?.length && (
            <Box pt={2} pb={4} mb={2} boxShadow={3} px={2}>
              <Box display="flex" mb={2} borderBottom="1px solid #D5D5D5" pb={1}>
                <Box flex="1">Group</Box>
                <Box textAlign="center" flex="1">View</Box>
                <Box textAlign="center" flex="1">Edit</Box>
                <Box textAlign="center" flex="1">Manage</Box>
                <Box textAlign="center" flex="1">Delete</Box>
                <Box flex="1">&nbsp;</Box>
              </Box>
              {
                topic.PermissionSets.map((ps, i) => {
                  if (editting === i) {
                    return (
                      <PermissionForm
                        key={i}
                        initialValues={{
                          group_id: ps.fk_groupId,
                          edit: ps.edit,
                          delete: ps.delete,
                          view: ps.view,
                          manage: ps.manage,
                        }}
                        onSubmit={onSubmit}
                        groups={allGroups}
                        isEdit
                      />
                    );
                  }

                  return (
                    <Box display="flex" key={i} mb={1}>
                      <Box flex="1">{ps.Group.name}</Box>
                      <Box flex="1" textAlign="center"><Bool v={ps.view} /></Box>
                      <Box flex="1" textAlign="center"><Bool v={ps.edit} /></Box>
                      <Box flex="1" textAlign="center"><Bool v={ps.manage} /></Box>
                      <Box flex="1" textAlign="center"><Bool v={ps.delete} /></Box>
                      <Box flex="1" textAlign="center">
                        <IconButton size="small" color="secondary" onClick={() => setEditting(i)}>
                          <PencilIcon fontSize="small" />
                        </IconButton>
                        &nbsp;
                        <IconButton size="small" onClick={() => setDeleting(ps.fk_groupId)}>
                          <TrashIcon fontSize="small" style={{ color: '#7e0404' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })
              }
            </Box>
          )
        }
        {
          !groups.length && (
            <Box>
              <Typography variant="body2">
                All the groups are already assigned
              </Typography>
            </Box>
          )
        }
        {
          !!groups.length && (
            <>
              <Box borderBottom="1px solid #D5D5D5" mb={2}>
                <Typography>Create new permission</Typography>
              </Box>
              <Box boxShadow={3}>
                <PermissionForm
                  initialValues={{
                    group_id: null,
                    edit: false,
                    delete: false,
                    view: false,
                    manage: false,
                  }}
                  onSubmit={onSubmit}
                  groups={groups}
                />
              </Box>
            </>
          )
        }

      </Box>
    </Dialog>
  );
};

export default PermissionsDialog;
