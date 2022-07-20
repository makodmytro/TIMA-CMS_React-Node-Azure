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
  useTranslate,
  useNotify,
  useRedirect,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { useIsAdmin } from '../hooks';

const AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN === '1';

const CustomToolbar = (props) => {
  const disabled = !useIsAdmin();
  const translate = useTranslate();

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

const ProfileCustomToolbar = (props) => {
  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="ra.action.save"
        redirect="list"
        submitOnEnter
        disabled={props.pristine}
      />
    </Toolbar>
  );
};

export const GroupsSelection = ({ disabled }) => {
  const [groups, setGroups] = React.useState([]);
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList('groups', {
        pagination: { perPage: 1000, page: 1 },
      });

      setGroups(data);
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
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
          {translate('resources.groups.select_user')}
        </Typography>
      </Box>
      <Box display="flex" flexWrap="wrap">
        {
          groups.map((group) => {
            return (
              <Box key={group.id} flex="0 0 30%">
                <BooleanInput
                  name={`u_${group.id}`}
                  label={group.name}
                  defaultValue={value.includes(group.id)}
                  record={{ [`u_${group.id}`]: value.includes(group.id) }}
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

const NullableBoolean = ({ record, source, ...rest }) => {
  return (
    <BooleanInput
      source={source}
      record={{
        ...record,
        [source]: record?.source || false,
      }}
      {...rest}
    />
  );
};

const DeactivateWarning = () => {
  const translate = useTranslate();

  return (
    <Box width="100%" mb={2}>
      <Alert severity="warning" elevation={3}>
        {translate('misc.self_deactivation')}
      </Alert>
    </Box>
  );
};

const UsersEdit = (props) => {
  const { permissions } = props;
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const notify = useNotify();
  const { id } = useParams();
  const [passwordToggle, setPasswordToggle] = React.useState(false);
  const disabled = !useIsAdmin();
  const disabledCheckbox = !useIsAdmin() || parseInt(id, 10) === parseInt(permissions?.userId, 10);

  const onSuccess = async () => {
    if (parseInt(id, 10) === parseInt(permissions?.userId, 10)) {
      await dataProvider.me();
    }

    notify('Saved successfully');
    redirect('/users');
  };

  const T = ({ record }) => (<>{record?.name}</>);
  if (parseInt(id, 10) === parseInt(permissions?.userId, 10) && disabled) { // user is not admin and just looking at his profile
    return (
      <Edit
        {...props}
        actions={<CustomTopToolbar />}
        undoable={false}
        onSuccess={onSuccess}
        title={<T />}
      >
        <SimpleForm toolbar={<ProfileCustomToolbar />}>
          <TextInput label={translate('resources.users.change_password')} source="change_password" type="text" defaultValue={1} style={{ display: 'none' }} />
          <TextInput source="name" validate={required()} fullWidth disabled />
          <TextInput source="email" validate={required()} fullWidth disabled />
          {
            !AZURE_LOGIN && (
              <>
                <TextInput
                  source="password"
                  type="password"
                  validate={required()}
                  fullWidth
                  helperText={translate('misc.password_must_change')}
                  autoComplete="new-password"
                  label="resources.users.fields.password"
                />
                <TextInput
                  type="password"
                  source="password_confirm"
                  validate={(value, allValues) => {
                    if (value !== allValues?.password) {
                      return translate('misc.password_mismatch');
                    }

                    return undefined;
                  }}
                  fullWidth
                  autoComplete="new-password"
                  label="resources.users.fields.password_confirm"
                />
              </>
            )
          }

          <GroupsSelection disabled />
        </SimpleForm>
      </Edit>
    );
  }

  return (
    <Edit
      {...props}
      actions={<CustomTopToolbar />}
      undoable={false}
      onSuccess={onSuccess}
      title={<T />}
    >
      <SimpleForm toolbar={<CustomToolbar />}>
        <TextInput source="name" validate={required()} fullWidth disabled />
        <TextInput source="email" validate={required()} fullWidth disabled />
        {
          !AZURE_LOGIN && (
            <BooleanInput
              source="change_password"
              label="Change user password"
              disabled={disabled}
              onChange={(v) => setPasswordToggle(v)}
            />
          )
        }

        {
          passwordToggle && (
            <>
              <TextInput
                source="password"
                type="password"
                validate={required()}
                fullWidth
                helperText={translate('misc.password_must_change')}
                autoComplete="new-password"
                label="resources.users.fields.password"
              />
              <TextInput
                type="password"
                source="password_confirm"
                validate={(value, allValues) => {
                  if (value !== allValues?.password) {
                    return translate('misc.password_mismatch');
                  }

                  return undefined;
                }}
                fullWidth
                autoComplete="new-password"
                label="resources.users.fields.password_confirm"
              />
            </>
          )
        }
        <NullableBoolean
          source="isActive"
          label="resources.users.fields.isActive"
          disabled={disabledCheckbox}
        />
        <NullableBoolean
          source="isAdmin"
          label="resources.users.fields.isAdmin"
          disabled={disabledCheckbox}
        />
        {
          disabledCheckbox && (
            <DeactivateWarning />
          )
        }
        <GroupsSelection disabled={disabled} />
      </SimpleForm>
    </Edit>
  );
};

export default UsersEdit;
