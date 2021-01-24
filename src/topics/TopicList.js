import React, { cloneElement, useState } from 'react';
import {
  Datagrid,
  DateField,
  Filter,
  List,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
} from 'react-admin';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import QrDialog from './qr-dialog';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';

const styles = makeStyles(() => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
}));

const Filters = (props) => {
  const classes = styles();

  return (
    <>
      <Filter {...props} className={classes.padded}>
        <TextInput label="Text" source="q" alwaysOn />
        <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
          <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
        </ReferenceInput>
      </Filter>
      {props.children}
    </>
  );
};

const ShowQuestions = ({
  record, size, fullWidth, ml,
}) => (
  <Box ml={ml}>
    <Button
      component={Link}
      onClick={(e) => {
        e.stopPropagation();
      }}
      size={size || 'small'}
      color="primary"
      variant="outlined"
      to={`/questions?filter=${encodeURIComponent(JSON.stringify({ fk_topicId: record.id }))}`}
      fullWidth={!!fullWidth}
    >
      Show questions
    </Button>
  </Box>
);
const Buttons = ({ record }) => (
  <div>
    <Box mb={1}>
      <ShowQuestions record={record} fullWidth />
    </Box>
    <div>
      {record.globalTopic ? null : <QrDialog record={record} fullWidth />}
    </div>
  </div>
);

const Img = ({ record }) => {
  if (!record.topicImageUrl) {
    return null;
  }

  return (
    <div>
      <img style={{ maxWidth: '200px' }} src={record.topicImageUrl} alt="topic" />
    </div>
  );
};

const TopicList = (props) => {
  const columns = [
    {
      key: 'name',
      el: (<TextField source="name" />),
    },
    { key: 'welcomeText', el: (<TextField source="welcomeText" />) },
    {
      key: 'topicKey',
      el: (<TextField source="topicKey" />),
    },
    {
      key: 'image',
      el: (<Img label="Image" />),
    },
    {
      key: 'updatedAt',
      el: (<DateField source="updatedAt" showTime />),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'topics'));

  return (
    <>
      <List
        {...props}
        filters={(
          <Filters />
        )}
        bulkActionButtons={false}
        actions={(
          <ListActions
            visibleColumns={visibleColumns}
            onColumnsChange={handleColumnsChange('topics', setVisibleColumns)}
            columns={columns}
          />
        )}
        sort={{ field: 'fk_languageId', order: 'DESC' }}
      >
        <Datagrid rowClick="edit">
          {columns.filter((col) => visibleColumns.includes(col.key))
            .map((col) => cloneElement(col.el, { key: col.key }))}
          <Buttons />
        </Datagrid>
      </List>
    </>
  );
};
export { ShowQuestions, Img };
export default TopicList;
