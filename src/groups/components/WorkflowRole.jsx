import React from 'react';
import {
  useDataProvider,
  AutocompleteInput,
  useTranslate,
} from 'react-admin';
import { useSelector } from 'react-redux';

const WorkflowRole = (props) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const options = useSelector((state) => state.custom.workflowRoles);

  return (
    <AutocompleteInput
      choices={options.map((o) => ({
        id: o.value, name: translate(`resources.users.workflow.roles.${o.name}`),
      }))}
      allowEmpty
      emptyText={translate('misc.none')}
      {...props}
    />
  );
};

export default WorkflowRole;
