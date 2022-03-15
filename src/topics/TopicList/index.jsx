import React, { useState } from 'react';
import {
  useRefresh,
  useDataProvider,
  useNotify,
  Title,
  CreateButton,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import {
  getVisibleColumns,
  handleColumnsChange,
} from '../../common/components/ListActions';
import ColumnConfig from '../../common/components/ColumnConfig';
import PermissionsDialog from '../components/PermissionsDialog';
import columns from './columns';
import TableView from './TableView';
import Filters from './Filters';
import { useRecursiveTimeout, useIsAdmin } from '../../hooks';

const TOPICS_ENABLE_TREE_LIST = process.env.REACT_APP_TOPICS_ENABLE_TREE_LIST || '1';

const TopicList = () => {
  const admin = useIsAdmin();
  const [open, setOpen] = React.useState(null);
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [records, setResults] = React.useState(null);
  const [pagination, setPagination] = React.useState({
    perPage: 10,
    page: 1,
  });
  const [form, setForm] = React.useState({
    q: '',
    fk_languageId: null,
  });
  const [count, setCount] = React.useState(0);

  const onSubmit = async (values = form, paging = pagination) => {
    setForm(values);

    const { data, total } = await dataProvider.getList('topics', {
      filter: {
        ...(values.q ? { q: values.q } : {}),
        ...(values.fk_languageId ? { fk_languageId: values.fk_languageId } : {}),
        topLevelOnly: TOPICS_ENABLE_TREE_LIST,
      },
      pagination: paging,
    });

    setResults(data);
    setCount(total);
  };

  const setPage = (page, submit = true) => {
    setPagination({
      ...pagination,
      page: page + 1,
    });

    if (submit) {
      onSubmit(form, { perPage: pagination.perPage, page: page + 1 });
    }
  };

  const setPageSize = (val) => {
    setPagination({
      page: 1,
      perPage: val,
    });

    onSubmit(form, { perPage: val, page: 1 });
  };

  React.useEffect(() => {
    onSubmit(form);
  }, []);

  useRecursiveTimeout(() => onSubmit(), 1000 * 30);

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'topics'));

  const onSync = async (id) => {
    try {
      await dataProvider.topicSync(null, {
        id,
      });

      notify('Sync scheduled');
      refresh();
    } catch (err) {
      notify('Failed to sync', 'error');
    }
  };

  const columnsToDisplay = columns.filter((col) => visibleColumns.includes(col.key));

  return (
    <Box>
      <PermissionsDialog
        open={!!open}
        onClose={() => setOpen(null)}
        id={open}
      />
      <Title title="Topics" />
      <Box display="flex" my={1} alignItems="flex-start" justifyContent="space-between">
        <Box flex="2">
          <Filters onSubmit={onSubmit} initialValues={form} />
        </Box>
        <Box flex="1" textAlign="right">
          { admin && <CreateButton basePath="/topics" /> }
          { !admin && <CreateButton basePath="/topics" disabled /> }
          <ColumnConfig
            resource="topics"
            columns={columns}
            visible={visibleColumns}
            onChange={handleColumnsChange('topics', setVisibleColumns)}
          />
        </Box>
      </Box>
      <Box boxShadow={3}>
        {
          records && !records.length && (
            <Box py={2}>
              <Alert severity="info">
                No records were found
              </Alert>
            </Box>
          )
        }
        {
          records && !!records.length && (
            <>
              <TableView
                {...{
                  columnsToDisplay,
                  records,
                  setOpen,
                  onSync,
                  count,
                  pagination,
                  setPage,
                  setPageSize,
                }}
              />
            </>
          )
        }
      </Box>
    </Box>
  );
};

export default TopicList;
