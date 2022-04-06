import React from 'react';
import { useField } from 'react-final-form'; // eslint-disable-line
import {
  Create,
  required,
  SimpleForm,
  TextInput,
  BooleanInput,
  Toolbar,
  SaveButton,
  useDataProvider,
  useRedirect,
  useTranslate,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import WorkflowRole from './components/WorkflowRole';
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
    </Toolbar>
  );
};

const UsersSelection = ({ users }) => {
  const translate = useTranslate();
  const { input: { onChange, value } } = useField('Users');

  const handleChange = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange(value.concat([id]));
    }
  };

  return (
    <Box>
      <Box borderBottom="1px solid #D5D5D5" mb={2}>
        <Typography variant="body2">
          {translate('resources.groups.select_users_bis')}
        </Typography>
      </Box>
      <Box display="flex" flexWrap="wrap">
        {
          users.map((user) => {
            return (
              <Box key={user.id} flex="0 0 50%">
                <BooleanInput
                  name={`u_${user.id}`}
                  label={user.name}
                  record={{ [`u_${user.id}`]: value.includes(user.id) }}
                  onChange={() => handleChange(user.id)}
                />
              </Box>
            );
          })
        }
      </Box>
    </Box>
  );
};

const GroupsCreate = (props) => {
  const disabled = !useIsAdmin();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const [users, setUsers] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [id, setId] = React.useState(null);

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 1000 },
      });

      setUsers(data);
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  };

  const putUsersIntoGroup = async () => {
    if (!selected.length) {
      return redirect('/groups');
    }

    try {
      await dataProvider.addUsersToGroup(null, {
        id,
        data: { userIds: selected },
      });
    } catch (e) {
      console.log(e); // eslint-disable-line
    }

    return redirect('/groups');
  };

  React.useEffect(() => {
    fetch();
  }, []);

  React.useEffect(() => {
    if (id) {
      putUsersIntoGroup();
    }
  }, [selected, id]);

  return (
    <Create
      {...props}
      actions={<CustomTopToolbar />}
      transform={({ Users, ...rest }) => {
        setSelected(Users);

        return rest;
      }}
      onSuccess={async ({ data }) => {
        setId(data.id);
      }}
      record={{
        name: '',
        Users: [],
      }}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled={disabled} />
        <WorkflowRole source="workflowRole" fullWidth disabled={disabled} />
        <UsersSelection users={users} />
      </SimpleForm>
    </Create>
  );
};

export default GroupsCreate;
