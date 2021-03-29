import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  TextField,
  ReferenceInput,
  SelectInput,
  TextInput,
  useListContext,
  useDataProvider,
} from 'react-admin';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { Language, Topic } from '../common/components/fields-values-by-fk';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';
import { DateTimeInput } from '../common/components/datetime-picker';

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

const Filters = ({
  languages, topics, countries, permissions, ...props
}) => {
  const classes = styles();
  const {
    filterValues,
    setFilters,
  } = useListContext();

  if (props.context === 'button') {
    return null;
  }

  const handleSetFilters = (filters) => {
    setFilters(filters, {});
  };

  const handleTopicChange = (event) => {
    setFilters({
      ...filterValues,
      fk_topicId: event.target.value,
    });

    if (event.target.value) {
      const topic = topics[event.target.value];
      if (topic) {
        const language = languages[topic.fk_languageId];

        if (language) {
          setFilters({
            ...filterValues,
            fk_languageId: language.id,
            fk_topicId: event.target.value,
          });
        }
      }
    }
  };

  return (
    <Form onSubmit={handleSetFilters} initialValues={filterValues}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <ReferenceInput
            onChange={() => handleSubmit()}
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
          <DateTimeInput
            label="From"
            inputVariant="filled"
            source="from"
            size="small"
            onChange={() => handleSubmit()}
            disableFuture
          />
          <DateTimeInput
            label="To"
            inputVariant="filled"
            source="to"
            size="small"
            onChange={() => handleSubmit()}
            disableFuture
          />
          <SelectInput
            optionText="clientCountry"
            optionValue="clientCountry"
            className={classes.select}
            allowEmpty
            emptyText="None"
            source="clientCountry"
            label="Country"
            alwaysOn
            choices={countries}
            onChange={() => handleSubmit()}
          />
          {
            permissions && permissions.allowDemo !== false && (
              <TextInput
                source="demoCode"
                label="Code"
                onChange={() => handleSubmit()}
              />
            )
          }
        </form>

      )}
    </Form>
  );
};

const QuestionList = ({
  permissions, languages, topics, dispatch, ...props
}) => {
  const [countries, setCountries] = React.useState([]);
  const dataProvider = useDataProvider();

  const columns = [
    { key: 'clientCountry', el: <TextField label="Country" source="clientCountry" /> },
    { key: 'fk_languageId', el: <Language label="Language" sortBy="fk_languageId" /> },
    { key: 'fk_topicId', el: <Topic label="Topic" sortBy="fk_topicId" /> },
    { key: 'duration', el: <TextField source="duration" label="Duration" /> },
    { key: 'questionsCount', el: <TextField source="questionsCount" label="# of questions" /> },
    { key: 'answersCount', el: <TextField source="answersCount" label="# of answers" /> },
  ];

  if (permissions && permissions.allowDemo !== false) {
    columns.push({ key: 'demoCode', el: <TextField source="demoCode" label="Code" /> });
  }

  columns.push({ key: 'updatedAt', el: <DateField source="updatedAt" showTime /> });

  const [visibleColumns, setVisibleColumns] = React.useState(getVisibleColumns(columns, 'sessions'));

  React.useEffect(() => {
    setVisibleColumns(getVisibleColumns(columns, 'sessions'));
  }, [permissions]);

  const fetchCountries = async () => {
    const { data } = await dataProvider.sessionsMap();

    setCountries(data.data);
  };

  React.useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <List
      {...props}
      filters={(
        <Filters
          languages={languages}
          topics={topics}
          countries={countries}
          permissions={permissions}
        />
      )}
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

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : [];

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : [];

  return { topics, languages };
};

export default connect(mapStateToProps)(QuestionList);
