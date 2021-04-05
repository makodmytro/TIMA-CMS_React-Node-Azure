import React, { cloneElement, useState } from 'react';
import { connect } from 'react-redux';
import {
  Datagrid,
  DateField,
  List,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
  useListContext,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import Badge from '@material-ui/core/Badge';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import ReactMarkdown from 'react-markdown';
import PlayableText from '../common/components/playable-text';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';
import ApprovedSwitchField from './approved-swtich-field';
import TopicSelectCell from '../common/components/TopicSelectCell';
import { Language } from '../common/components/fields-values-by-fk';
import DropDownMenu from './list-dropdown-menu';

const styles = makeStyles((theme) => ({
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
  markdown: {
    display: 'flex',

    '& .second': {
      flex: 1,
    },
  },
  related: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    fontSize: '1rem',
    marginRight: '15px',

    '& span': {
      color: 'white',
      marginLeft: '5px',
      marginRight: '5px',
    },
  },
}));

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : {};

  return { topics, languages };
};

const Filters = ({ languages, topics, ...props }) => {
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
          <TextInput label="Text" source="q" alwaysOn onChange={() => handleSubmit()} />
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
            onChange={() => handleSubmit()}
            label="Editor"
            source="fk_editorId"
            reference="editors"
            alwaysOn
            allowEmpty
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
          <SelectInput
            label="Approved"
            source="approved"
            allowEmpty
            emptyText="Both"
            onChange={() => handleSubmit()}
            defaultValue=""
            choices={[
              { id: true, name: <DoneIcon color="primary" /> },
              { id: false, name: <ClearIcon /> },
            ]}
          />
        </form>

      )}
    </Form>
  );
};

export const Text = connect(mapStateToProps)(({ record, hideRelatedQuestions, languages }) => {
  const classes = styles();
  const badgeContent = record.relatedQuestions
    ? `+${record.relatedQuestions}`
    : '-';

  return (
    <div className={classes.markdown}>
      {
        !hideRelatedQuestions && (
          <div className={classes.related}>
            <Badge
              badgeContent={badgeContent}
              color="primary"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              &nbsp;
            </Badge>
          </div>
        )
      }
      <div className="second">
        <ReactMarkdown source={record.text} />
      </div>
      <PlayableText
        hideText
        text={record.text}
        lang={languages[record.fk_languageId] ? languages[record.fk_languageId].code : null}
      />
    </div>
  );
});

const AnswerList = ({
  languages, topics, dispatch, ...props
}) => {
  const columns = [
    {
      key: 'text',
      el: <Text label="Text" sortBy="text" />,
    },
    {
      key: 'fk_languageId',
      el: <Language label="Language" sortBy="fk_languageId" />,
    },
    {
      key: 'fk_editorId',
      el: <TextField source="Editor.name" label="Editor" sortBy="fk_editorId" />,
    },
    {
      key: 'fk_topicId',
      el: <TopicSelectCell source="fk_topicId" label="Topic" sortBy="fk_topicId" />,
    },
    {
      key: 'approved',
      el: <ApprovedSwitchField label="Approved" disabled={props.permissions && !props.permissions.allowEdit} />,
    },
    { key: 'updatedAt', el: <DateField source="updatedAt" showTime /> },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'answers'));

  return (
    <>
      <List
        {...props}
        actions={(
          <ListActions
            visibleColumns={visibleColumns}
            onColumnsChange={handleColumnsChange('answers', setVisibleColumns)}
            columns={columns}
          />
        )}
        filters={<Filters languages={languages} topics={topics} />}
        bulkActionButtons={false}
      >
        <Datagrid rowClick="edit">
          {columns.filter((col) => visibleColumns.includes(col.key))
            .map((col) => cloneElement(col.el, { key: col.key }))}
          <DropDownMenu />
        </Datagrid>
      </List>
    </>
  );
};

export default connect(mapStateToProps)(AnswerList);
