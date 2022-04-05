import React from 'react';
import {
  Edit, required, SimpleForm, TextInput,
  SaveButton,
  DeleteButton,
  Toolbar,
} from 'react-admin';
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
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={disabled}
      />
    </Toolbar>
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
      </SimpleForm>
    </Edit>
  );
};

export default LanguageEdit;
