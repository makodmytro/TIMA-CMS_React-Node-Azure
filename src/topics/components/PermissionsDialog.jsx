import React from 'react';
import {
  Dialog,
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { Form } from 'react-final-form'; // eslint-disable-line
import {
  useDataProvider,
  useNotify,
  SelectInput,
  BooleanInput,
  Confirm,
  useTranslate,
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
  initialValues, onSubmit, groups, isEdit, loading,
}) => {
  const translate = useTranslate();

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
      render={({ handleSubmit, valid, reset, values, form }) => {
        const t = (name) => (_v) => {
          if (name === 'manage' && _v) {
            form.change('view', true);
            form.change('edit', true);
            form.change('delete', true);
          }

          if (name === 'delete' && _v) {
            form.change('view', true);
            form.change('edit', true);
          }

          if (name === 'edit' && _v) {
            form.change('view', true);
          }
        };

        return (
          <form
            onSubmit={(event) => {
              handleSubmit(event)?.then(reset);
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box px={1} flex="4">
                <SelectInput
                  source="group_id"
                  label={translate('resources.topics.permissions.group')}
                  choices={groups}
                  optionText="name"
                  optionValue="id"
                  margin="dense"
                  disabled={isEdit}
                  fullWidth
                />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="view" label={translate('resources.topics.permissions.view')} />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="edit" label={translate('resources.topics.permissions.edit')} onChange={t('edit')} />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="delete" label={translate('resources.topics.permissions.delete')} onChange={t('delete')} />
              </Box>
              <Box px={1} flex="1">
                <BooleanInput source="manage" label={translate('resources.topics.permissions.manage')} onChange={t('manage')} />
              </Box>

              <Box px={1} flex="1">
                <Button
                  style={{ marginTop: '-25px' }}
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={!valid || loading}
                  size="small"
                >
                  { isEdit ? translate('misc.save') : translate('misc.create') }
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
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [loading, setLoading] = React.useState(false);
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
      setLoading(true);

      const { data } = await dataProvider.getOne('topics', {
        id,
      });

      setTopic(data);
    } catch (err) {
      notify('Failed to get permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async ({ group_id, ...values }) => {
    try {
      setLoading(true);

      await dataProvider.topicCreatePermission('topics', {
        group_id,
        topic_id: topic?.id,
        data: values,
      });

      notify('Saved successfully');
      init();
    } catch (err) {
      notify('Failed to get groups', 'error');
      setLoading(false);
    }
  };

  const onDeleteCancel = () => setDeleting(null);
  const onDelete = async () => {
    try {
      setLoading(true);

      await dataProvider.topicDeletePermission('topics', {
        topic_id: topic?.id,
        group_id: deleting,
      });

      init();
    } catch (err) {
      notify('Failed to delete', 'error');
      setLoading(false);
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
          <Typography>{translate('resources.topics.permissions.manage_permissions')}: <b>{topic?.name}</b></Typography>
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
              title={translate('misc.delete')}
              content={translate('Are you sure you want to delete the permission?')}
              onConfirm={onDelete}
              onClose={onDeleteCancel}
              confirm={translate('misc.delete')}
              cancel={translate('misc.cancel')}
            />
          )
        }
        {
          !topic && (<Box textAlign="text-center"><Typography variant="body2">{translate('misc.loading')}...</Typography></Box>)
        }
        {
          !!topic && !topic?.PermissionSets?.length && !loading && (
            <Box py={2}><Typography variant="body2">{translate('resources.topics.permissions.no_permissions')}</Typography></Box>
          )
        }
        {
          loading && (
            <Box textAlign="center">
              <CircularProgress color="secondary" />
            </Box>
          )
        }
        {
          !!topic && !!topic?.PermissionSets?.length && !loading && (
            <Box pt={2} pb={4} mb={2} boxShadow={3} px={2}>
              <Box display="flex" mb={2} borderBottom="1px solid #D5D5D5" pb={1}>
                <Box flex="1">{translate('resources.topics.permissions.group')}</Box>
                <Box textAlign="center" flex="1">{translate('resources.topics.permissions.view')}</Box>
                <Box textAlign="center" flex="1">{translate('resources.topics.permissions.edit')}</Box>
                <Box textAlign="center" flex="1">{translate('resources.topics.permissions.manage')}</Box>
                <Box textAlign="center" flex="1">{translate('resources.topics.permissions.delete')}</Box>
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
          !groups.length && !loading && (
            <Box>
              <Typography variant="body2">
                {translate('resources.topics.permissions.all_assigned')}
              </Typography>
            </Box>
          )
        }
        {
          !!groups.length && !loading && (
            <>
              <Box borderBottom="1px solid #D5D5D5" mb={2}>
                <Typography>{translate('resources.topics.permissions.create_new')}</Typography>
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
                  loading={loading}
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
