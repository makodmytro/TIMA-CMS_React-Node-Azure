import React from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import {
  DateField,
  List,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
  useListContext,
  useRedirect,
  useDataProvider,
  useRefresh,
  useNotify,
  Confirm,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import Badge from '@material-ui/core/Badge';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ViewIcon from '@material-ui/icons/Visibility';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/HighlightOff';
import RelatedIcon from '@material-ui/icons/Cached';
import PlayableText, { PlayableTextField } from '../common/components/playable-text';
import RelatedQuestionsDialog from './related-questions-dialog';
import ThumbsUp from '../assets/thumbs-up.png';
import ThumbsDown from '../assets/thumbs-down.png';

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
}));

const Filters = (props) => {
  const classes = styles();

  return (
    <Filter {...props} className={classes.padded}>
      <TextInput label="Text" source="q" alwaysOn />
      <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
      <ReferenceInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
    </Filter>
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
        &nbsp;Create answer
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
    <PlayableText text={record.Answer.text} el={link} lang={record.Language ? record.Language.code : 'en-US'} />
  );
};

const RelatedQuestions = ({ record, expanded, setExpanded }) => {
  const classes = styles();

  if (!record || !record.relatedQuestions || !record.relatedQuestions.length) {
    return (<>&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</>);
  }

  return (
    <span
      className={classes.related}
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(!expanded);
      }}
    >
      {record.relatedQuestions.length}
      { expanded ? <ExpandLessIcon size="small" /> : <AddIcon size="small" />} { /* eslint-disable-line */ }
    </span>
  );
};

const DropdownMenu = ({
  record, deleteQuestion, removeAnswer,
  openRelatedQuestions,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);

    return false;
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const onDeleteClicked = (e) => {
    e.stopPropagation();

    deleteQuestion(record);
    setAnchorEl(null);
  };

  const onRemoveClicked = (e) => {
    e.stopPropagation();

    removeAnswer(record);
    setAnchorEl(null);
  };

  const onOpenRelatedQuestions = (e) => {
    e.stopPropagation();
    openRelatedQuestions(record);

    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="secondary"
        size="small"
      >
        Actions <ExpandIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {
          record.relatedQuestions && !!record.relatedQuestions.length && (
            <MenuItem onClick={onOpenRelatedQuestions}>
              <ListItemIcon><RelatedIcon /></ListItemIcon>
              Related questions
            </MenuItem>
          )
        }
        {
          !record.fk_answerId && (
            <MenuItem
              component={Link}
              to={`/questions/${record.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ListItemIcon><AddIcon /></ListItemIcon>
              Create answer
            </MenuItem>
          )
        }
        {
          !!record.fk_answerId && (
            <MenuItem
              component={Link}
              to={`/answers/${record.fk_answerId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ListItemIcon><ViewIcon /></ListItemIcon>
              View answer
            </MenuItem>
          )
        }
        <MenuItem onClick={onDeleteClicked}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          Delete question
        </MenuItem>
        {
          record.fk_answerId && (
            <MenuItem onClick={onRemoveClicked}>
              <ListItemIcon><RemoveIcon /></ListItemIcon>
              Remove answer
            </MenuItem>
          )
        }
      </Menu>
    </div>
  );
};

const CustomGridItem = ({
  record, deleteQuestion, removeAnswer,
  openRelatedQuestions,
}) => {
  const classes = styles();
  const redirect = useRedirect();
  const [expanded, setExpanded] = React.useState(false);

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
        <TableCell>
          <RelatedQuestions record={record} expanded={expanded} setExpanded={setExpanded} />
          &nbsp;
          <PlayableText text={record.text} lang={record.Language ? record.Language.code : 'en-US'} />
        </TableCell>
        <TableCell>
          <AnswerField label="Answer" record={record} />
        </TableCell>
        <TableCell>
          <DateField source="updatedAt" showTime record={record} />
        </TableCell>
        <TableCell>
          <Badge badgeContent={record.feedbackPositiveCount || 0} color="secondary" classes={{ badge: classes.badge }} showZero>
            <img src={ThumbsUp} alt="thumbs-up" style={{ maxWidth: '30px' }} />
          </Badge>
        </TableCell>
        <TableCell>
          <Badge badgeContent={record.feedbackNegativeCount || 0} color="error" classes={{ badge: classes.badge }} showZero>
            <img src={ThumbsDown} alt="thumbs-up" style={{ maxWidth: '30px' }} />
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu
            record={record}
            deleteQuestion={deleteQuestion}
            removeAnswer={removeAnswer}
            openRelatedQuestions={openRelatedQuestions}
          />
        </TableCell>
      </TableRow>
      {
        expanded && (
          record.relatedQuestions.map((related, i) => (
            <TableRow
              className={classes.cursor}
              key={i}
              style={{ backgroundColor: '#fdfdd6' }}
              onClick={link(related.id)}
            >
              <TableCell>
                <PlayableTextField source="text" record={{ ...related, Language: record.Language }} />
              </TableCell>
              <TableCell>
                <AnswerField label="Answer" record={related} />
              </TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          ))
        )
      }
    </>
  );
};

const CustomGrid = ({
  deleteQuestion, removeAnswer, openRelatedQuestions,
}) => {
  const { ids, data, basePath, currentSort, setSort } = useListContext(); // eslint-disable-line
  const classes = styles();

  const Th = ({ label, field }) => (
    <TableCell className={classes.thead} onClick={() => setSort(field, currentSort.order === 'ASC' ? 'DESC' : 'ASC')}>
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
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box my={1}>
          <Table>
            <TableHead>
              <TableRow>
                <Th label="Text" field="text" />
                <Th label="Answer" field="fk_answerId" />
                <Th label="Updated at" field="updatedAt" />
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
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
        title="Remove answer"
        content="Are you sure you want to remove the answer from the question?"
        onConfirm={removeAnswer}
        onClose={onRemoveAnswerClose}
      />
      <List {...props} filters={<Filters />}>
        <CustomGrid
          openRelatedQuestions={onOpenRelatedQuestions}
          deleteQuestion={onDeletedOpen}
          removeAnswer={onRemoveAnswerOpen}
        />
      </List>
    </>
  );
};

export default QuestionList;
