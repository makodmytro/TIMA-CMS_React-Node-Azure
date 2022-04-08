import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  DateField,
  List,
  useListContext,
  useTranslate,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import Badge from '@material-ui/core/Badge';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp';
import ThumbsDownIcon from '@material-ui/icons/ThumbDown';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import ForumTwoTone from '@material-ui/icons/ForumTwoTone';
import PlayableText from '../../common/components/playable-text';
import ThumbsUp from '../../assets/thumbs-up.png';
import ThumbsDown from '../../assets/thumbs-down.png';
import DropdownMenu from '../components/list-dropdown-menu';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../../common/components/ListActions';
import TopicSelectCell from '../../common/components/TopicSelectCell';
import ApprovedSwitchField from '../components/approved-switch-field';
import UseAsSuggestionSwitchField from '../components/use-as-suggestion-switch-field';
import StatusField from '../../common/components/StatusField';
import styles from './styles';
import Filters from './Filters';
import AnswerField from '../components/AnswerField';
import EditDialog from '../components/EditDialog';
import { useDisabledEdit, useDisabledApprove } from '../../hooks';

const QUESTIONS_TREE_CHILD_COLOR = process.env.REACT_APP_QUESTIONS_TREE_CHILD_COLOR || '498ca752';
const QUESTIONS_ENABLE_TREE_LIST = process.env.REACT_APP_QUESTIONS_ENABLE_TREE_LIST || '1';
const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';
const HIDDEN_FIELDS = process.env.REACT_APP_HIDE_FIELDS_QUESTIONS
  ? process.env.REACT_APP_HIDE_FIELDS_QUESTIONS.split(',')
  : [];

if (!USE_WORKFLOW) {
  HIDDEN_FIELDS.push('status');
} else {
  HIDDEN_FIELDS.push('approved');
  HIDDEN_FIELDS.push('useAsSuggestion');
}

const columns = [
  { key: 'text' },
  { key: 'fk_answerId' },
  { key: 'fk_topicId' },
  { key: 'approved' },
  { key: 'useAsSuggestion' },
  { key: 'updatedAt' },
  { key: 'feedbackPositiveCount' },
  { key: 'feedbackNegativeCount' },
].filter((c) => !HIDDEN_FIELDS.includes(c.key));

const CustomGridItem = ({
  record,
  visibleColumns,
  level,
}) => {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const disableEdit = useDisabledEdit(record?.fk_topicId);
  const disableApprove = useDisabledApprove(record?.fk_topicId);
  const classes = styles();

  const bg = !level ? 'initial' : `#${(parseInt(QUESTIONS_TREE_CHILD_COLOR, 16) + 32 * level).toString(16)}`;

  if (level) {
    return (
      <>
        <EditDialog record={record} open={open} onClose={() => setOpen(false)} />
        <TableRow
          className={classes.cursor}
          style={{ backgroundColor: bg }}
          onClick={() => setOpen(true)}
        >
          <TableCell>
            {
              !!record.qna_promptDisplayOrder && (
                <span>
                  <ForumTwoTone fontSize="small" />&nbsp;
                </span>
              )
            }
            {
              !!record.relatedQuestions && record.relatedQuestions.length > 0 && (
                <>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();

                      setExpanded(!expanded);
                    }}
                  >
                    { !expanded && <AddIcon fontSize="small" /> }
                    { expanded && <MinusIcon fontSize="small" /> }
                  </IconButton>
                </>
              )
            }
          </TableCell>
          <TableCell style={{ paddingLeft: `${30 * level}px` }}>
            <PlayableText
              text={record.text}
              fkLanguageId={record.fk_languageId}
            />
          </TableCell>
          {
            (Array.from(Array(visibleColumns.length - 1).keys())).map((v, i) => (
              <TableCell key={i}>&nbsp;</TableCell>
            ))
          }
          <TableCell>
            <DropdownMenu
              editInline
              record={record}
              disabled={record.allowEdit === false}
            />
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <>
      <EditDialog record={record} open={open} onClose={() => setOpen(false)} />
      <TableRow
        className={classes.cursor}
        onClick={() => setOpen(true)}
      >
        <TableCell>
          {
            !!record.relatedQuestions && record.relatedQuestions.length > 0 && QUESTIONS_ENABLE_TREE_LIST === '1' && (
              <>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();

                    setExpanded(!expanded);
                  }}
                >
                  { !expanded && <AddIcon fontSize="small" /> }
                  { expanded && <MinusIcon fontSize="small" /> }
                </IconButton>
              </>
            )
          }
        </TableCell>
        {visibleColumns.includes('text') && (
          <TableCell>
            <PlayableText
              text={record.text}
              fkLanguageId={record.fk_languageId}
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
              <TopicSelectCell label="Topic" source="fk_topicId" record={record} disabled={disableEdit} />
            </TableCell>
          )}
        {
          visibleColumns.includes('status') && (
            <TableCell>
              <StatusField source="status" label="resources.questions.fields.status" sortable={false} record={record} />
            </TableCell>
          )
        }
        {visibleColumns.includes('approved')
          && (
            <TableCell>
              <ApprovedSwitchField label="Approved" record={record} disabled={disableApprove} />
            </TableCell>
          )}
        {visibleColumns.includes('useAsSuggestion')
          && (
            <TableCell>
              <UseAsSuggestionSwitchField label="useAsSuggestion" record={record} disabled={disableEdit} />
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
            editInline
            record={record}
            disabled={record.allowEdit === false}
          />
        </TableCell>
      </TableRow>
      {
        expanded && record.relatedQuestions && !!record.relatedQuestions.length && (
          <>
            {
              record.relatedQuestions.map((child, iii) => (
                <CustomGridItem
                  record={child}
                  visibleColumns={visibleColumns}
                  key={iii}
                  level={(level || 0) + 1}
                />
              ))
            }
          </>
        )
      }
    </>
  );
};

const CustomGrid = ({
  visibleColumns,
}) => {
  const { ids, data, basePath, currentSort, setSort } = useListContext(); // eslint-disable-line
  const classes = styles();
  const translate = useTranslate();

  const Th = ({ label, field }) => (visibleColumns.includes(field) ? (
    <TableCell
      className={classes.thead}
      onClick={() => setSort(field, currentSort.order === 'ASC' ? 'DESC' : 'ASC')}
    >
      {translate(label)}&nbsp;
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
                <TableCell>&nbsp;</TableCell>
                <Th label="resources.questions.fields.text" field="text" />
                <Th label="resources.questions.fields.fk_answerId" field="fk_answerId" />
                <Th label="resources.questions.fields.fk_topicId" field="fk_topicId" />
                <Th label="resources.questions.fields.status" field="status" />
                <Th label="resources.questions.fields.approved" field="approved" />
                <Th label="resources.questions.fields.useAsSuggestion" field="useAsSuggestion" />
                <Th label="resources.questions.fields.updatedAt" field="updatedAt" />
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
  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'questions'));

  return (
    <>
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
        filterDefaultValues={{ ignored: [false, null], topLevelOnly: '1' }}
      >
        <CustomGrid
          visibleColumns={visibleColumns}
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
