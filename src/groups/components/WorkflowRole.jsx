import React from 'react';
import {
  AutocompleteInput,
  useTranslate,
} from 'react-admin';
import { useSelector } from 'react-redux';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const WorkflowRole = (props) => {
  const translate = useTranslate();
  const options = useSelector((state) => state.custom.workflowRoles);

  if (!USE_WORKFLOW) {
    return null;
  }
  return (
    <AutocompleteInput
      choices={options.map((o) => ({
        id: o.value, name: translate(`resources.users.workflow.roles.${o.name}`),
      }))}
      allowEmpty
      emptyText={translate('misc.none')}
      options={{
        suggestionsContainerProps: {
          modifiers: {
            computeStyle: {
              gpuAcceleration: false,
            },
          },
        },
      }}
      {...props}
    />
  );
};

export default WorkflowRole;
