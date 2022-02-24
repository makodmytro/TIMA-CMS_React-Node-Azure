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
  useRefresh,
  useDataProvider,
  useNotify,
  ReferenceField,
  BooleanField,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import QrDialog from './components/qr-dialog';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';
import ShowQuestionsButton from './components/ShowQuestionsButton';
import TopicImage from './components/Image';
import { useRecursiveTimeout, useIsAdmin } from '../hooks';

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

const Buttons = ({ record, onSync }) => {
  const admin = useIsAdmin();

  return (
    <div>
      <Box mb={1}>
        <ShowQuestionsButton record={record} fullWidth />
      </Box>
      <div>
        {record.globalTopic ? null : <QrDialog record={record} fullWidth />}
      </div>
      {
        admin && (
          <Box mt={1}>
            <Button
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();

                return onSync(record?.id);
              }}
            >
              Schedule sync
            </Button>
          </Box>
        )
      }
    </div>
  );
};

const TopicList = (props) => {
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  useRecursiveTimeout(() => refresh(), 30000);

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
      key: 'level',
      el: (<TextField source="level" />),
    },
    {
      key: 'qnaApiVersion',
      el: (<TextField source="qnaApiVersion" label="QNA Version" />),
    },
    {
      key: 'qnaKnowledgeBaseId',
      el: (<TextField source="qnaKnowledgeBaseId" label="Knowledge base ID" />),
    },
    {
      key: 'fk_parentTopicId',
      el: (<ReferenceField source="fk_parentTopicId" reference="topics" label="Parent topic"><TextField source="name" /></ReferenceField>),
    },
    {
      key: 'image',
      el: (<TopicImage label="Image" />),
    },
    {
      key: 'syncScheduled',
      el: (<BooleanField label="Sync scheduled" source="syncScheduled" />),
    },
    {
      key: 'updatedAt',
      el: (<DateField source="updatedAt" showTime />),
    },
    {
      key: 'lastSyncAt',
      el: (<DateField source="lastSyncAt" showTime label="Last sync at" />),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'topics'));

  const onSync = async (id) => {
    try {
      await dataProvider.topicSync(null, {
        id,
      });

      notify('Sync schedules');
      refresh();
    } catch (err) {
      notify('Failed to sync', 'error');
    }
  };

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
          <Buttons onSync={onSync} />
        </Datagrid>
      </List>
    </>
  );
};

export default TopicList;
