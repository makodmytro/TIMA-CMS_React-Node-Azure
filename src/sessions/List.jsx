import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  TextField,
  ReferenceInput,
  SelectInput,
  DateTimeInput, useListContext, useDataProvider,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { Language, Topic } from '../common/components/fields-values-by-fk';
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

          <DateTimeInput source="startDate" alwaysOn onChange={() => handleSubmit()} />
          <DateTimeInput source="endDate" alwaysOn onChange={() => handleSubmit()} />
        </form>

      )}
    </Form>
  );
};

const QuestionList = (props) => {
  const columns = [
    { key: 'clientCountry', el: <TextField label="Country" source="clientCountry" /> },
    { key: 'fk_languageId', el: <Language label="Language" sortBy="fk_languageId" /> },
    { key: 'fk_topicId', el: <Topic label="Topic" sortBy="fk_topicId" /> },
    { key: 'duration', el: <TextField source="duration" label="Duration" /> },
    { key: 'questionsCount', el: <TextField source="questionsCount" label="# of questions" /> },
    { key: 'answersCount', el: <TextField source="answersCount" label="# of answers" /> },
    { key: 'updatedAt', el: <DateField source="updatedAt" showTime /> },
  ];
  const [visibleColumns, setVisibleColumns] = React.useState(getVisibleColumns(columns, 'sessions'));

  return (
    <List
      {...props}
      filters={<Filters />}
      bulkActionButtons={false}
      actions={(
        <ListActions
          visibleColumns={visibleColumns}
          onColumnsChange={handleColumnsChange('sessions', setVisibleColumns)}
          columns={columns}
        />
      )}
      sort={{
        field: 'updatedAt',
        order: 'DESC',
      }}
    >
      <Datagrid rowClick="show">
        {
          columns
            .filter((col) => visibleColumns.includes(col.key))
            .map((col) => React.cloneElement(col.el, { key: col.key }))
        }
      </Datagrid>
    </List>
  );
};

export default QuestionList;
