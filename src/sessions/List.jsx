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

          <DateTimeInput source="from" alwaysOn onChange={() => handleSubmit()} />
          <DateTimeInput source="until" alwaysOn onChange={() => handleSubmit()} />
        </form>

      )}
    </Form>
  );
};

const QuestionList = (props) => (
  <List {...props} filters={<Filters />} bulkActionButtons={false}>
    <Datagrid rowClick="show">
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="duration" label="duration" />
      <TextField source="questionsCount" label="# of questions" />
      <TextField source="answersCount" label="# of answers" />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default QuestionList;
