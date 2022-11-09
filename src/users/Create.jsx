import React from 'react';
import {
  Create, required, SimpleForm, TextInput,
  BooleanInput,
  email,
  Toolbar,
  SaveButton,
  useTranslate,
  useDataProvider,
  useRedirect,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { useIsAdmin } from '../hooks';
import { GroupsSelection } from './Edit';

const AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN === '1';

const CustomToolbar = (props) => {
  const disabled = !useIsAdmin();

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label={AZURE_LOGIN ? 'resources.users.add' : 'ra.action.save'}
        redirect="list"
        submitOnEnter
        disabled={props.pristine || disabled}
      />
    </Toolbar>
  );
};

const UsersCreate = (props) => {
  const [record, setRecord] = React.useState(null);
  const [_groups, setGroups] = React.useState([]);
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const disabled = !useIsAdmin();
  const translate = useTranslate();

  const onSuccess = async () => {
    if (!_groups.length) {
      return redirect('/users');
    }

    await dataProvider.update('users', {
      id: record.id,
      data: {
        ...record,
        groups: _groups,
      },
    });

    return redirect('/users');
  };

  React.useEffect(() => {
    if (record) {
      onSuccess();
    }
  }, [_groups, record]);

  return (
    <Create
      {...props}
      actions={<CustomTopToolbar />}
      transform={({ groups, ...rest }) => {
        setGroups(groups);

        return rest;
      }}
      onSuccess={async ({ data }) => {
        setRecord(data);
      }}
    >
      <SimpleForm toolbar={<CustomToolbar />} initialValues={{ groups: [], isActive: true }}>
        <TextInput source="name" validate={required()} fullWidth disabled={disabled} autoComplete="no" />
        <TextInput source="email" validate={[required(), email()]} fullWidth disabled={disabled} autoComplete="no" />
        {
          !AZURE_LOGIN && (
            <>
              <TextInput
                source="password"
                type="password"
                validate={required()}
                fullWidth
                disabled={disabled}
                helperText={translate('misc.password_must_change')}
                autoComplete="new-password"
                label="resources.users.fields.password"
              />
              <TextInput
                type="password"
                source="password_confirm"
                label="resources.users.fields.password_confirm"
                validate={(value, allValues) => {
                  if (value !== allValues?.password) {
                    return translate('misc.password_mismatch');
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

        <BooleanInput source="isActive" label="resources.users.fields.isActive" disabled={disabled} />
        <BooleanInput source="isAdmin" label="resources.users.fields.isAdmin" disabled={disabled} />
        <GroupsSelection disabled={disabled} />
      </SimpleForm>
    </Create>
  );
};

export default UsersCreate;
