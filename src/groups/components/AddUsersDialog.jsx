import React from 'react';
import debounce from 'lodash/debounce';
import { Form } from 'react-final-form';
import {
  useTranslate,
  TextInput,
  useNotify,
  useDataProvider,
  useRefresh,
  TextField,
} from 'react-admin';
import {
  Box,
  Button,
  Dialog,
  Typography,
  IconButton,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Checkbox,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useIsAdmin } from '../../hooks';

const Filters = ({
  onSubmit,
  selected,
  onSelectedSubmit,
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box display="flex">
              <Box flex={3}>
                <Typography variant="body2">
                  {translate('misc.search_users')}
                </Typography>
                <TextInput label="misc.text" source="q" fullWidth onChange={() => form.submit()} autoComplete="no" />
              </Box>
              <Box flex={1} px={2} pt={5}>
                {
                  !!selected.length && (
                    <Button
                      type="button"
                      onClick={onSelectedSubmit}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      {translate('resources.groups.add_users_action', { n: selected.length })}
                    </Button>
                  )
                }
              </Box>
            </Box>
          </form>
        );
      }}
    />
  );
};

const ResultsList = ({
  users,
  selected,
  toggleSelect,
}) => {
  const translate = useTranslate();

  const isSelected = (question) => selected.includes(question.id);

  if (!users) {
    return null;
  }

  if (!users.length) {
    return (
      <Alert severity="info">
        {translate('resources.users.no_results')}
      </Alert>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>&nbsp;</TableCell>
            <TableCell>{translate('resources.users.fields.name')}</TableCell>
            <TableCell>{translate('resources.users.fields.email')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            users.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox
                    checked={isSelected(user)}
                    value={isSelected(user)}
                    onClick={() => toggleSelect(user)}
                  />
                </TableCell>
                <TableCell>
                  <TextField source="name" record={user} />
                </TableCell>
                <TableCell>
                  <TextField source="email" record={user} />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </>
  );
};

const AddUsersDialog = ({
  record,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [users, setUsers] = React.useState(null);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const disabled = !useIsAdmin();

  const onFiltersSubmit = debounce(async (values) => {
    setSelected([]);

    if (!values.q) {
      setUsers(null);

      return;
    }

    try {
      const filter = { ...values };

      const { data } = await dataProvider.getList('users', {
        filter,
        pagination: { perPage: 50, page: 1 },
      });

      setUsers(data);
    } catch (err) {
      notify('Unexpected error', 'error');
    }
  }, 500);

  const toggleSelect = (user) => {
    if (selected.includes(user.id)) {
      setSelected(selected.filter((s) => s !== user.id));
    } else {
      setSelected(selected.concat([user.id]));
    }
  };

  const onSelectedSubmit = async () => {
    await dataProvider.addUsersToGroup(null, {
      id: record.id,
      data: { userIds: selected },
    });

    refresh();
    setOpen(false);
  };

  React.useEffect(() => {
    if (open) {
      setSelected([]);
      setUsers(null);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <Box display="flex" p={2}>
          <Box flex={5}>
            <Typography>
              {translate('resources.groups.users')}
            </Typography>
          </Box>
          <Box flex={1} textAlign="right">
            <IconButton
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box p={2}>
          <Filters
            onSubmit={onFiltersSubmit}
            selected={selected}
            onSelectedSubmit={onSelectedSubmit}
          />
          <hr />
          <ResultsList
            {...{
              users,
              selected,
              toggleSelect,
            }}
          />
        </Box>
      </Dialog>
      <Button variant="contained" size="small" color="secondary" onClick={() => setOpen(true)} disabled={disabled}>
        {translate('resources.groups.add_users')}
      </Button>
    </>
  );
};

export default AddUsersDialog;
