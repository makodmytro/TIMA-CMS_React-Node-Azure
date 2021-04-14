import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  Datagrid,
  TextInput,
  Filter,
  DateField,
  EditButton,
  DeleteButton,
  TextField,
  BooleanInput,
} from 'react-admin';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CopyIcon from '@material-ui/icons/FileCopy';
import SearchIcon from '@material-ui/icons/Search';

const LinkField = ({ record }) => (
  <div>
    <Button
      component="a"
      color="primary"
      href={record.link}
      target="_blank"
      rel="noreferrer"
      size="small"
      onClick={(e) => e.stopPropagation()}
      style={{ textTransform: 'none' }}
    >
      {record.contact}
    </Button>
  </div>
);

const DemoUrl = ({ record }) => {
  const [open, setOpen] = React.useState(false);

  if (!record.demoUrl) {
    return null;
  }

  const onClick = (e) => {
    e.stopPropagation();

    navigator.clipboard.writeText(record.demoUrl);

    setOpen(true);

    setTimeout(() => setOpen(false), 1000);
  };

  return (
    <div>
      {record.demoUrl}&nbsp;
      <Tooltip title="Copied to clipboard" open={open} placement="bottom">
        <IconButton
          type="button"
          color="primary"
          onClick={onClick}
        >
          <CopyIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const Code = ({ record }) => (
  <div>
    {record.code}
    <IconButton
      component={Link}
      to={`/stats/sessions?filter=${encodeURIComponent(JSON.stringify({ demoCode: record.code }))}`}
      color="secondary"
      onClick={(e) => e.stopPropagation()}
    >
      <SearchIcon />
    </IconButton>
  </div>
);

const DemosFilters = (props) => {
  return (
    <Filter {...props}>
      <TextInput
        source="search"
        label="Text"
        alwaysOn
      />
      <TextInput
        source="code"
        label="Code"
        alwaysOn
      />
      <BooleanInput source="active" label="Active" alwaysOn />
    </Filter>
  );
};

const DemosList = (props) => (
  <List
    {...props}
    bulkActionButtons={false}
    filters={(
      <DemosFilters />
    )}
  >
    <Datagrid rowClick="edit">
      <LinkField label="Link" />
      <DemoUrl label="Demo URL" />
      <Code source="code" />
      <DateField source="expiryDate" />
      <TextField source="defaultTopicKey" label="Defaul topic k." />
      <EditButton />
      <DeleteButton undoable={false} />
    </Datagrid>
  </List>
);

export default DemosList;
