import React, { cloneElement, useState } from 'react';
import {
  Datagrid,
  DateField,
  List,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
  useDataProvider,
  useListContext,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { PlayableTextField } from '../common/components/playable-text';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';
import TopicSelectCell from '../common/components/TopicSelectCell';

const styles = makeStyles(() => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '16px',
    minHeight: '80px',
    alignItems: 'flex-end',
    paddingTop: 0,

    '& div': {
      paddingRight: 16,
    },
  },
}));

const Filters = (props) => {
  const classes = styles();
  const {
    filterValues,
    setFilters,
  } = useListContext();
  const dataProvider = useDataProvider();

  if (props.context === 'button') {
    return null;
  }

  const handleSetFilters = (filters) => {
    setFilters(filters, {});
  };

  const handleLanguageChange = (event) => {
    setFilters({ ...filterValues, fk_languageId: event.target.value }, {});
  };

  const handleTopicChange = (event) => {
    if (event.target.value) {
      dataProvider.getOne('topics', { id: event.target.value })
        .then(({ data }) => {
          setFilters({
            ...filterValues,
            fk_languageId: data.fk_languageId,
            fk_topicId: event.target.value,
          });
        });
    } else {
      setFilters({ ...filterValues, fk_topicId: event.target.value }, {});
    }
  };

  return (

    <Form onSubmit={handleSetFilters} initialValues={filterValues}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextInput label="Text" source="q" alwaysOn onChange={() => handleSubmit()} />
          <ReferenceInput
            onChange={handleLanguageChange}
            label="Language"
            source="fk_languageId"
            reference="languages"
            alwaysOn
            allowEmpty
          >
            <SelectInput
              disabled={Boolean(filterValues.fk_topicId)}
              optionText="name"
              className={classes.select}
              allowEmpty
              emptyText="None"
            />
          </ReferenceInput>
          <ReferenceInput
            onChange={() => handleSubmit()}
            label="Editor"
            source="fk_editorId"
            reference="editors"
            alwaysOn
            perPage={100}
          >
            <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
          </ReferenceInput>
          <ReferenceInput
            label="Topic"
            source="fk_topicId"
            reference="topics"
            alwaysOn
            allowEmpty
            perPage={100}
            onChange={handleTopicChange}
            filter={filterValues.fk_languageId ? { fk_languageId: filterValues.fk_languageId }
              : null}
          >
            <SelectInput
              optionText="name"
              className={classes.select}
              allowEmpty
              emptyText="None"
            />
          </ReferenceInput>
        </form>

      )}
    </Form>
  );
};

const AnswerList = (props) => {
  const columns = [
    { key: 'text', el: <PlayableTextField source="text" /> },
    {
      key: 'fk_languageId',
      el: <TextField source="Language.name" label="Language" sortBy="fk_languageId" />,
    },
    {
      key: 'fk_editorId',
      el: <TextField source="Editor.name" label="Editor" sortBy="fk_editorId" />,
    },
    {
      key: 'fk_topicId',
      el: <TopicSelectCell source="fk_topicId" label="Topic" sortBy="fk_topicId" />,
    },
    { key: 'updatedAt', el: <DateField source="updatedAt" showTime /> },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'answers'));

  return (
    <List
      {...props}
      actions={(
        <ListActions
          visibleColumns={visibleColumns}
          onColumnsChange={handleColumnsChange('answers', setVisibleColumns)}
          columns={columns}
        />
          )}
      filters={<Filters />}
      bulkActionButtons={false}
    >
      <Datagrid rowClick="edit">
        {columns.filter((col) => visibleColumns.includes(col.key))
          .map((col) => cloneElement(col.el, { key: col.key }))}
      </Datagrid>
    </List>
  );
};

export default AnswerList;
