import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import { connect } from 'react-redux';
import {
  BooleanInput,
  Confirm,
  DateField,
  List,
  ReferenceInput,
  SelectInput,
  TextInput,
  useDataProvider,
  useListContext,
  useNotify,
  usePermissions,
  useRedirect,
  useRefresh,
} from 'react-admin';
import { Form } from 'react-final-form';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import Badge from '@material-ui/core/Badge';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp';
import ThumbsDownIcon from '@material-ui/icons/ThumbDown';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import PlayableText from '../common/components/playable-text';
import ThumbsUp from '../assets/thumbs-up.png';
import ThumbsDown from '../assets/thumbs-down.png';
import DropdownMenu from './list-dropdown-menu';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';
import TopicSelectCell from '../common/components/TopicSelectCell';
import ApprovedSwitchField from './approved-switch-field';
import { Text } from '../answers/AnswerList';
import UseAsSuggestionSwitchField from './use-as-suggestion-switch-field';

const styles = makeStyles((theme) => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
  related: {
    color: theme.palette.primary.main,
    fontSize: '0.7rem',

    '& span': {
      color: 'white',
    },
  },
  cursor: {
    cursor: 'pointer',
  },
  thead: {
    cursor: 'pointer',
    fontWeight: 'bold',

    '& svg': {
      fontSize: '0.8rem',
      verticalAlign: 'middle',
    },
  },
  badge: {
    right: '-5px',
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

  const getTopicsFilter = () => {
    const filters = { globalTopic: [0, 1] };
    if (filterValues.fk_languageId) {
      filters.fk_languageId = filterValues.fk_languageId;
    }
    return filters;
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
            filter={getTopicsFilter()}
          >
            <SelectInput
              optionText="name"
              className={classes.select}
              allowEmpty
              emptyText="None"
              disabled={props.permissions && !props.permissions.allowEdit}
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
          <BooleanInput
            label="Ignored"
            source="ignored"
            alwaysOn
            onChange={() => handleSubmit()}
          />
          <BooleanInput
            label="Unanswered questions"
            source="unanswered"
            alwaysOn
            onChange={() => handleSubmit()}
          />
          { /*
          <BooleanInput
            label="Hide related"
            source="groupRelated"
            alwaysOn
            onChange={() => handleSubmit()}
          />
          */ }
        </form>

      )}
    </Form>
  );
};

const AnswerField = ({ record }) => {
  if (!record) {
    return null;
  }

  if (!record.fk_answerId) {
    return (
      <Button
        component={Link}
        to={`/questions/${record.id}`}
        size="small"
        style={{ color: 'red', borderColor: '#ff0000a6' }}
        variant="outlined"
        onClick={(e) => e.stopPropagation()}
      >
        <AddIcon />
        &nbsp;Link answer
      </Button>
    );
  }

  const link = (
    <Button
      component={Link}
      to={`/answers/${record.fk_answerId}`}
      size="small"
      color="primary"
      onClick={(e) => e.stopPropagation()}
    >
      {
        !record.Answer && (
          <>
            View related answer
          </>
        )
      }
    </Button>
  );

  if (!record.Answer) {
    return link;
  }

  return (
    <Text
      record={{
        ...record.Answer,
        Language: record.Language,
        relatedQuestions: record.relatedQuestionsForAnswerCount || 0,
      }}
    />
  );
};

const CustomGridItem = ({
  record, removeAnswer,
  visibleColumns,
}) => {
  const { permissions } = usePermissions();
  const classes = styles();
  const redirect = useRedirect();

  const link = (id) => (e) => {
    e.stopPropagation();
    redirect(`/questions/${id}`);
  };

  return (
    <>
      <TableRow
        className={classes.cursor}
        style={{ backgroundColor: record.fk_answerId ? 'default' : '#ff000030' }}
        onClick={link(record.id)}
      >
        {visibleColumns.includes('text') && (
          <TableCell>
            <PlayableText
              text={record.text}
              lang={record.Language ? record.Language.code : null}
            />
          </TableCell>
        )}

        {visibleColumns.includes('fk_answerId')
          && (
            <TableCell style={{ width: '25%' }}>
              <AnswerField label="Answer" record={record} />
            </TableCell>
          )}
        {visibleColumns.includes('fk_topicId')
          && (
            <TableCell>
              <TopicSelectCell label="Topic" source="fk_topicId" record={record} />
            </TableCell>
          )}
        {visibleColumns.includes('approved')
          && (
            <TableCell>
              <ApprovedSwitchField label="Approved" record={record} disabled={permissions && !permissions.allowEdit} />
            </TableCell>
          )}
        {visibleColumns.includes('useAsSuggestion')
          && (
            <TableCell>
              <UseAsSuggestionSwitchField label="useAsSuggestion" record={record} disabled={permissions && !permissions.allowEdit} />
            </TableCell>
          )}
        {visibleColumns.includes('updatedAt') && (
          <TableCell>
            <DateField source="updatedAt" showTime record={record} />
          </TableCell>
        )}
        {visibleColumns.includes('feedbackPositiveCount') && (
          <TableCell>
            <Badge
              badgeContent={record.feedbackPositiveCount || 0}
              color="secondary"
              classes={{ badge: classes.badge }}
              showZero
            >
              <img src={ThumbsUp} alt="thumbs-up" style={{ maxWidth: '30px' }} />
            </Badge>
          </TableCell>
        )}

        {visibleColumns.includes('feedbackNegativeCount') && (
          <TableCell>
            <Badge
              badgeContent={record.feedbackNegativeCount || 0}
              color="error"
              classes={{ badge: classes.badge }}
              showZero
            >
              <img src={ThumbsDown} alt="thumbs-up" style={{ maxWidth: '30px' }} />
            </Badge>
          </TableCell>
        )}

        <TableCell>
          <DropdownMenu
            record={record}
            removeAnswer={removeAnswer}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

const CustomGrid = ({
  removeAnswer, visibleColumns,
}) => {
  const { ids, data, basePath, currentSort, setSort } = useListContext(); // eslint-disable-line
  const classes = styles();

  const Th = ({ label, field }) => (visibleColumns.includes(field) ? (
    <TableCell
      className={classes.thead}
      onClick={() => setSort(field, currentSort.order === 'ASC' ? 'DESC' : 'ASC')}
    >
      {label}&nbsp;
      {
        field === currentSort.field && currentSort.order === 'DESC' && (
          <ArrowUp size="small" />
        )
      }
      {
        field === currentSort.field && currentSort.order === 'ASC' && (
          <ArrowDown size="small" />
        )
      }
    </TableCell>
  ) : null);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box my={1}>
          <Table>
            <TableHead>
              <TableRow>
                <Th label="Text" field="text" />
                <Th label="Answer" field="fk_answerId" />
                <Th label="Topic" field="fk_topicId" />
                <Th label="Approved" field="approved" />
                <Th label="Suggestion" field="useAsSuggestion" />
                <Th label="Updated at" field="updatedAt" />
                <Th label={<ThumbsUpIcon />} field="feedbackPositiveCount" />
                <Th label={<ThumbsDownIcon />} field="feedbackNegativeCount" />
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                ids.map((id) => (
                  <CustomGridItem
                    key={id}
                    record={data[id]}
                    basePath={basePath}
                    removeAnswer={removeAnswer}
                    visibleColumns={visibleColumns}
                  />
                ))
              }
            </TableBody>
          </Table>
        </Box>
      </Grid>
    </Grid>
  );
};

const QuestionList = ({
  languages, topics, dispatch, ...props
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [record, setRecord] = React.useState(null);
  const [removeAnswerConfirmOpened, setRemoveAnswerConfirmOpened] = React.useState(false);

  const columns = [
    { key: 'text' },
    { key: 'fk_answerId' },
    { key: 'fk_topicId' },
    { key: 'approved' },
    { key: 'useAsSuggestion' },
    { key: 'updatedAt' },
    { key: 'feedbackPositiveCount' },
    { key: 'feedbackNegativeCount' },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'questions'));

  const onRemoveAnswerOpen = (r) => {
    setRecord(r);
    setRemoveAnswerConfirmOpened(true);
  };

  const onRemoveAnswerClose = () => {
    setRecord(null);
    setRemoveAnswerConfirmOpened(false);
  };

  const removeAnswer = async () => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: { fk_answerId: null },
      });

      refresh();
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
    onRemoveAnswerClose();
  };

  return (
    <>
      <Confirm
        isOpen={removeAnswerConfirmOpened}
        loading={false}
        title="Unlink answer"
        content="Are you sure you want to unlink the answer from the question?"
        onConfirm={removeAnswer}
        onClose={onRemoveAnswerClose}
      />
      <List
        {...props}
        actions={(
          <ListActions
            visibleColumns={visibleColumns}
            onColumnsChange={handleColumnsChange('questions', setVisibleColumns)}
            columns={columns}
          />
        )}
        filters={<Filters languages={languages} topics={topics} />}
        filterDefaultValues={{ ignored: [false, null] }}
      >
        <CustomGrid
          visibleColumns={visibleColumns}
          removeAnswer={onRemoveAnswerOpen}
        />
      </List>
    </>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : {};

  return { topics, languages };
};

export default connect(mapStateToProps)(QuestionList);
