import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
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
import RelatedQuestionsDialog from './related-questions-dialog';
import ThumbsUp from '../assets/thumbs-up.png';
import ThumbsDown from '../assets/thumbs-down.png';
import DropdownMenu from './list-dropdown-menu';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../common/components/ListActions';
import TopicSelectCell from '../common/components/TopicSelectCell';
import BooleanField from '../common/components/BooleanField';
import LinksDialog from './links-dialog';

const styles = makeStyles((theme) => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
  related: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    fontSize: '1rem',
    paddingTop: '5px',
    paddingBottom: '5px',

    '&:hover': {
      backgroundColor: '#4ec2a826',
    },

    '& svg': {
      verticalAlign: 'middle',
      fontSize: '0.9rem',
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
            filter={getTopicsFilter()}
          >
            <SelectInput
              optionText="name"
              className={classes.select}
              allowEmpty
              emptyText="None"
            />
          </ReferenceInput>
          <BooleanInput
            label="Unanswered questions"
            source="unanswered"
            alwaysOn
            onChange={() => handleSubmit()}
          />
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
        record.Answer && (
          <>
            {record.Answer.text.substr(0, 40)}...
          </>
        )
      }
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
    <PlayableText
      text={record.Answer.text}
      el={link}
      lang={record.Language ? record.Language.code : 'en-US'}
    />
  );
};

const RelatedQuestions = ({ record }) => {
  const classes = styles();

  if (!record || !record.relatedQuestions || !record.relatedQuestions.length) {
    return (<>&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</>);
  }

  return (
    <span
      className={classes.related}
    >
      &nbsp;&nbsp;{record.relatedQuestions.length}&nbsp;
    </span>
  );
};

const CustomGridItem = ({
  record, deleteQuestion, removeAnswer,
  openRelatedQuestions, visibleColumns,
  onOpenLinksDialog,
}) => {
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
            <RelatedQuestions record={record} />
            &nbsp;
            <PlayableText
              text={record.text}
              lang={record.Language ? record.Language.code : 'en-US'}
            />
          </TableCell>
        )}

        {visibleColumns.includes('fk_answerId')
        && (
          <TableCell>
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
            <BooleanField label="Approved" source="approved" record={record} />
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
            deleteQuestion={deleteQuestion}
            removeAnswer={removeAnswer}
            openRelatedQuestions={openRelatedQuestions}
            onOpenLinksDialog={onOpenLinksDialog}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

const CustomGrid = ({
  deleteQuestion, removeAnswer, openRelatedQuestions, visibleColumns,
  onOpenLinksDialog,
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
                    deleteQuestion={deleteQuestion}
                    removeAnswer={removeAnswer}
                    openRelatedQuestions={openRelatedQuestions}
                    visibleColumns={visibleColumns}
                    onOpenLinksDialog={onOpenLinksDialog}
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

const QuestionList = (props) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [record, setRecord] = React.useState(null);
  const [deleteConfirmOpened, setDeleteConfirmedOpened] = React.useState(false);
  const [removeAnswerConfirmOpened, setRemoveAnswerConfirmOpened] = React.useState(false);
  const [relatedQuestionsOpened, setRelatedQuestionsOpened] = React.useState(false);
  const [linksDialogOpened, setLinksDialogOpened] = React.useState(false);

  const columns = [
    { key: 'text' },
    { key: 'fk_answerId' },
    { key: 'fk_topicId' },
    { key: 'approved' },
    { key: 'updatedAt' },
    { key: 'feedbackPositiveCount' },
    { key: 'feedbackNegativeCount' },
  ];

  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'questions'));

  const onDeletedOpen = (r) => {
    setRecord(r);
    setDeleteConfirmedOpened(true);
  };

  const onDeleteClose = () => {
    setRecord(null);
    setDeleteConfirmedOpened(false);
  };

  const deleteQuestion = async () => {
    try {
      await dataProvider.delete('questions', {
        id: record.id,
      });

      notify('The record has been deleted');
      refresh();
    } catch (err) {
      notify(`Failed to delete the question: ${err.message}`, 'error');
    }
    onDeleteClose();
  };

  const onOpenLinksDialog = (r) => {
    setRecord(r);
    setLinksDialogOpened(true);
  };

  const onCloseLinksDialog = () => {
    setRecord(null);
    setLinksDialogOpened(false);
  };

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
      notify(`Failed to remove the answer: ${err.message}`, 'error');
    }
    onRemoveAnswerClose();
  };

  const onOpenRelatedQuestions = (r) => {
    setRecord(r);
    setRelatedQuestionsOpened(true);
  };

  const onCloseRelatedQuestions = () => {
    setRecord(null);
    setRelatedQuestionsOpened(false);
  };

  return (
    <>
      <RelatedQuestionsDialog
        open={relatedQuestionsOpened}
        onClose={onCloseRelatedQuestions}
        record={record}
        deleteQuestion={onDeletedOpen}
        removeAnswer={onRemoveAnswerOpen}
      />
      <LinksDialog
        record={record}
        open={linksDialogOpened}
        onClose={onCloseLinksDialog}
        deleteQuestion={onDeletedOpen}
        removeAnswer={onRemoveAnswerOpen}
      />
      <Confirm
        isOpen={deleteConfirmOpened}
        loading={false}
        title="Delete question"
        content="Are you sure you want to delete the question?"
        onConfirm={deleteQuestion}
        onClose={onDeleteClose}
      />
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
        filters={<Filters />}
      >
        <CustomGrid
          visibleColumns={visibleColumns}
          openRelatedQuestions={onOpenRelatedQuestions}
          deleteQuestion={onDeletedOpen}
          removeAnswer={onRemoveAnswerOpen}
          onOpenLinksDialog={onOpenLinksDialog}
        />
      </List>
    </>
  );
};

export default QuestionList;
