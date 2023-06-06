import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRefresh, useDataProvider, useNotify, Title, CreateButton, useVersion, useTranslate } from 'react-admin';
import { useLocation, useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import { getVisibleColumns, handleColumnsChange } from '../../common/components/ListActions';
import ColumnConfig from '../../common/components/ColumnConfig';
import PermissionsDialog from '../components/PermissionsDialog';
import columns from './columns';
import TableView from './TableView';
import Filters from './Filters';
import { useRecursiveTimeout, useIsAdmin } from '../../hooks';

const TOPICS_ENABLE_TREE_LIST = process.env.REACT_APP_TOPICS_ENABLE_TREE_LIST || '1';

const TopicList = () => {
  const admin = useIsAdmin();
  const version = useVersion();
  const [open, setOpen] = useState(null);
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();
  const [records, setResults] = useState(null);
  const [pagination, setPagination] = useState({
    perPage: 10,
    page: 1
  });
  const [form, setForm] = useState({
    q: '',
    fk_languageId: null
  });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });
  const [count, setCount] = useState(0);
  const { search, pathname } = useLocation();
  const history = useHistory();
  const querystring = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useCallback(() => {
    const pageNo = parseInt(querystring.get('pageNo'), 10);
    if (pageNo && pageNo <= count / pagination.perPage + 1) {
      setPagination({
        ...pagination,
        page: pageNo
      });
    }
  }, [querystring, count, pagination.perPage]);

  const onSubmit = async (values = form, paging = pagination, _sort = sort) => {
    setForm(values);

    try {
      const { data, total } = await dataProvider.topicTree('topics', {
        filter: {
          ...(values.q ? { q: values.q } : {}),
          ...(values.fk_languageId ? { fk_languageId: values.fk_languageId } : {}),
          topLevelOnly: TOPICS_ENABLE_TREE_LIST
        },
        pagination: paging,
        sort: _sort
      });

      console.log('data', data)
      setResults(data);
      setCount(total);
      setSearchParams();
    } catch (e) {} // eslint-disable-line
  };

  const onSortClick = (field) => {
    const order = field === sort.field ? (sort.order === 'DESC' ? 'ASC' : 'DESC') : sort.order;
    setSort({ field, order });

    onSubmit(form, pagination, { field, order });
  };

  const setPage = (page, submit = true) => {
    setPagination({
      ...pagination,
      page: page + 1
    });
    const params = new URLSearchParams({ pageNo: page + 1 });
    console.log(params);
    history.replace({ pathname, search: params.toString() });

    if (submit) {
      onSubmit(form, { perPage: pagination.perPage, page: page + 1 });
    }
  };

  const setPageSize = (val) => {
    setPagination({
      page: 1,
      perPage: val
    });

    onSubmit(form, { perPage: val, page: 1 });
  };

  React.useEffect(() => {
    if (querystring.get('d')) {
      onSubmit();
    }
  }, [querystring.get('d')]);

  React.useEffect(() => {
    onSubmit(form);
  }, []);

  useEffect(() => {
    // setSearchParams();
    const pageNo = parseInt(querystring.get('pageNo'), 10);
    if (pageNo && pageNo <= count / pagination.perPage + 1) {
      setPagination({
        ...pagination,
        page: pageNo
      });
    }
  }, [count, querystring]);

  // useRecursiveTimeout(() => onSubmit(), 1000 * 30);

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'topics'));

  const onSync = async (id) => {
    try {
      await dataProvider.topicSync(null, {
        id
      });

      notify('Sync scheduled');
      refresh();
    } catch (err) {
      notify('Failed to sync', 'error');
    }
  };

  const columnsToDisplay = columns.filter((col) => visibleColumns.includes(col.key));

  return (
    <Box key={version}>
      <PermissionsDialog open={!!open} onClose={() => setOpen(null)} id={open} />
      <Title title={translate('resources.topics.name', { smart_count: 2 })} />
      <Box display="flex" my={1} alignItems="flex-start" justifyContent="space-between">
        <Box flex="2">
          <Filters onSubmit={onSubmit} initialValues={form} />
        </Box>
        <Box flex="1" textAlign="right">
          {admin && <CreateButton basePath="/topics" />}
          {!admin && <CreateButton basePath="/topics" disabled />}
          <ColumnConfig
            resource="topics"
            columns={columns}
            visible={visibleColumns}
            onChange={handleColumnsChange('topics', setVisibleColumns)}
          />
        </Box>
      </Box>
      <Box boxShadow={3}>
        {records && !records.length && (
          <Box py={2}>
            <Alert severity="info">No records were found</Alert>
          </Box>
        )}
        {records && !!records.length && (
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
                onSortClick,
                currentSort: sort,
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default TopicList;
