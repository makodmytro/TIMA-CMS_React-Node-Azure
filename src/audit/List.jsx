import React, { cloneElement } from 'react';
import {
  Datagrid,
  DateField,
  List,
  TextField,
  Filter,
  ReferenceInput,
  SelectInput,
  useTranslate,
} from 'react-admin';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { DateTimeInput } from '../common/components/datetime-picker';
import DetailDialog from './DetailDialog';

const ActionTypeField = ({ record }) => {
  const translate = useTranslate();

  if (!record || !record.actionType) {
    return null;
  }

  return (
    <div>
      {translate(`resources.audit.actions.${record.actionType}`)}
    </div>
  );
};

const Filters = (props) => {
  const translate = useTranslate();

  return (
    <Box pt={2}>
      <Box flex="0 0 100%">
        <Typography style={{ transform: 'uppercase' }}>{translate('misc.filters')}</Typography>
      </Box>
      <Filter {...props}>
        <DateTimeInput
          label="resources.sessions.fields.from"
          inputVariant="filled"
          source="from"
          size="small"
          disableFuture
          alwaysOn
        />
        <DateTimeInput
          label="resources.sessions.fields.to"
          inputVariant="filled"
          source="to"
          size="small"
          disableFuture
          alwaysOn
        />
        <ReferenceInput
          source="fk_userId"
          label="resources.audit.fields.fk_userId"
          reference="users"
          allowEmpty
          alwaysOn
          style={{ marginTop: '-16px' }}
        >
          <SelectInput source="name" />
        </ReferenceInput>
      </Filter>
    </Box>
  );
};

const Btn = ({ record, onClick }) => {
  const translate = useTranslate();

  if (record && (!record.objectBefore && !record.objectAfter)) {
    return null;
  }

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        onClick(record);
      }}
      size="small"
      color="secondary"
      variant="contained"
      type="button"
    >
      {translate('misc.view')}
    </Button>
  );
};

const LogsList = (props) => {
  const [open, setOpen] = React.useState(null);

  const columns = [
    {
      key: 'entityName',
      el: <TextField source="entityName" />,
    },
    {
      key: 'actionType',
      el: <ActionTypeField />,
    },
    {
      key: 'fk_userId',
      el: <TextField source="userName" label="resources.audit.fields.fk_userId" />,
    },
    {
      key: 'createdAt',
      el: <DateField source="createdAt" showTime />,
    },
  ];

  const onClick = (record) => setOpen(record);

  return (
    <>
      <DetailDialog open={!!open} record={open} onClose={() => setOpen(null)} />
      <List
        {...props}
        actions={null}
        filters={<Filters />}
        bulkActionButtons={false}
        sort={{ field: 'updatedAt', order: 'DESC' }}
      >
        <Datagrid rowClick={null}>
          {columns.map((col) => cloneElement(col.el, { key: col.key }))}
          <Btn onClick={onClick} />
        </Datagrid>
      </List>
    </>
  );
};

export default LogsList;
