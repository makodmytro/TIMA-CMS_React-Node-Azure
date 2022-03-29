import React from 'react';
import {
  Create, required, SimpleForm, TextInput,
  BooleanInput,
  email,
  Toolbar,
  SaveButton,
  useTranslate,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { useIsAdmin } from '../hooks';

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
  const disabled = !useIsAdmin();
  const translate = useTranslate();

  return (
    <Create {...props} actions={<CustomTopToolbar />}>
      <SimpleForm toolbar={<CustomToolbar />}>
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
      </SimpleForm>
    </Create>
  );
};

export default UsersCreate;
