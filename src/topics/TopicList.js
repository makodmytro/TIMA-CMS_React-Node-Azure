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
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import QrDialog from './components/qr-dialog';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';
import ShowQuestionsButton from './components/ShowQuestionsButton';
import TopicImage from './components/Image';

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

const Buttons = ({ record }) => (
  <div>
    <Box mb={1}>
      <ShowQuestionsButton record={record} fullWidth />
    </Box>
    <div>
      {record.globalTopic ? null : <QrDialog record={record} fullWidth />}
    </div>
  </div>
);

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
      el: (<TopicImage label="Image" />),
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

export default TopicList;
