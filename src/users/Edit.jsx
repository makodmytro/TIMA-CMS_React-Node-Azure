import React from 'react';
import { useField } from 'react-final-form'; // eslint-disable-line
import { useParams } from 'react-router-dom';
import {
  Edit, required, SimpleForm, TextInput,
  SaveButton,
  DeleteButton,
  Toolbar,
  BooleanInput,
  useDataProvider,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { useIsAdmin } from '../hooks';

const CustomToolbar = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="Save"
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

const ProfileCustomToolbar = (props) => {
  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="Save"
        redirect="list"
        submitOnEnter
        disabled={props.pristine}
      />
    </Toolbar>
  );
};

const GroupsSelection = ({ disabled }) => {
  const [groups, setGroups] = React.useState([]);
  const dataProvider = useDataProvider();

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList('groups', {
        pagination: { perPage: 1000, page: 1 },
      });

      setGroups(data);
    } catch (e) {} // eslint-disable-line
  };

  React.useEffect(() => {
    if (!groups.length) {
      fetch();
    }
  }, []);

  const { input: { onChange, value } } = useField('groups');

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
          Select the groups the user belongs to
        </Typography>
      </Box>
      <Box display="flex" flexWrap="wrap">
        {
          groups.map((group) => {
            return (
              <Box key={group.id} flex="0 0 30%">
                <BooleanInput
                  name={group.id}
                  label={group.name}
                  defaultValue={value.includes(group.id)}
                  record={{ [group.id]: value.includes(group.id) }}
                  onChange={() => handleChange(group.id)}
                  disabled={disabled}
                />
              </Box>
            );
          })
        }
      </Box>
    </Box>
  );
};

const UsersEdit = (props) => {
  const { permissions } = props;
  const { id } = useParams();
  const [passwordToggle, setPasswordToggle] = React.useState(false);
  const disabled = !useIsAdmin();

  if (id === permissions?.userId && disabled) { // user is not admin and just looking at his profile
    return (
      <Edit
        {...props}
        actions={<CustomTopToolbar />}
        undoable={false}
      >
        <SimpleForm toolbar={<ProfileCustomToolbar />}>
          <TextInput source="change_password" type="text" defaultValue={1} style={{ display: 'none' }} />
          <TextInput source="name" validate={required()} fullWidth disabled />
          <TextInput source="email" validate={required()} fullWidth disabled />
          <TextInput
            source="password"
            type="password"
            validate={required()}
            fullWidth
            helperText="Must be changed after first login"
            autoComplete="new-password"
          />
          <TextInput
            type="password"
            source="password_confirm"
            validate={(value, allValues) => {
              if (value !== allValues?.password) {
                return 'Password does not match';
              }

              return undefined;
            }}
            fullWidth
            autoComplete="new-password"
          />
        </SimpleForm>
      </Edit>
    );
  }

  return (
    <Edit
      {...props}
      actions={<CustomTopToolbar />}
      undoable={false}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled />
        <TextInput source="email" validate={required()} fullWidth disabled />
        <BooleanInput
          source="change_password"
          label="Change user password"
          disabled={disabled}
          onChange={(v) => setPasswordToggle(v)}
        />

        {
          passwordToggle && (
            <>
              <TextInput
                source="password"
                type="password"
                validate={required()}
                fullWidth
                disabled={disabled}
                helperText="Must be changed after first login"
                autoComplete="new-password"
              />
              <TextInput
                type="password"
                source="password_confirm"
                validate={(value, allValues) => {
                  if (value !== allValues?.password) {
                    return 'Password does not match';
                  }

                  return undefined;
                }}
                fullWidth
                disabled={disabled}
                autoComplete="new-password"
              />
            </>
          )
        }
        <BooleanInput source="isActive" label="Active" disabled={disabled} />
        <BooleanInput source="isAdmin" label="Admin" disabled={disabled} />
        <GroupsSelection disabled={disabled} />
      </SimpleForm>
    </Edit>
  );
};

export default UsersEdit;
