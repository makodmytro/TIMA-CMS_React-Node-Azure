import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Confirm,
  DateField,
  List,
  useDataProvider,
  useListContext,
  useNotify,
  useRedirect,
  useRefresh,
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
import styles from './styles';
import Filters from './Filters';
import AnswerField from './AnswerField';
import { useDisabledEdit, useDisabledApprove } from '../../hooks';

const QUESTIONS_TREE_CHILD_COLOR = process.env.REACT_APP_QUESTIONS_TREE_CHILD_COLOR || '498ca752';
const QUESTIONS_ENABLE_TREE_LIST = process.env.REACT_APP_QUESTIONS_ENABLE_TREE_LIST || '1';

const CustomGridItem = ({
  record,
  removeAnswer,
  visibleColumns,
  level,
}) => {
  const dataProvider = useDataProvider();
  const [expanded, setExpanded] = React.useState(false);
  const [children, setChildren] = React.useState([]);
  const disableEdit = useDisabledEdit(record?.fk_topicId);
  const disableApprove = useDisabledApprove(record?.fk_topicId);
  const classes = styles();
  const redirect = useRedirect();

  const fetchChildren = async () => {
    try {
      const { data } = await dataProvider.getOne('questions', { id: record.id });

      setChildren(data?.ChildQuestions || []);
    } catch (e) {} // eslint-disable-line
  };

  React.useEffect(() => {
    if (expanded && !children.length) {
      fetchChildren();
    }
  }, [expanded]);

  const link = (id) => (e) => {
    e.stopPropagation();
    redirect(`/questions/${id}`);
  };

  const bg = !level ? 'initial' : `#${(parseInt(QUESTIONS_TREE_CHILD_COLOR, 16) + 32 * level).toString(16)}`;

  if (level) {
    return (
      <TableRow
        className={classes.cursor}
        style={{ backgroundColor: bg }}
        onClick={link(record.id)}
      >
        <TableCell>
          {
            !!record.childCount && record.childCount > 0 && (
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
            lang={record.Language ? record.Language.code : null}
          />
        </TableCell>
        {
          (Array.from(Array(visibleColumns.length - 1).keys())).map((v, i) => (
            <TableCell key={i}>&nbsp;</TableCell>
          ))
        }
        <TableCell>
          <DropdownMenu
            record={record}
            removeAnswer={removeAnswer}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <TableRow
        className={classes.cursor}
        onClick={link(record.id)}
      >
        <TableCell>
          {
            !!record.childCount && record.childCount > 0 && QUESTIONS_ENABLE_TREE_LIST === '1' && (
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
              <TopicSelectCell label="Topic" source="fk_topicId" record={record} disabled={disableEdit} />
            </TableCell>
          )}
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
            record={record}
            removeAnswer={removeAnswer}
          />
        </TableCell>
      </TableRow>
      {
        expanded && record.childCount && !!children.length && (
          <>
            {
              children.map((child, iii) => (
                <CustomGridItem
                  record={child}
                  removeAnswer={removeAnswer}
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
  removeAnswer,
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
  const translate = useTranslate();
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
        title={translate('misc.unlink_answer')}
        content={translate('dialogs.unlink_confirmation')}
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
        filterDefaultValues={{ ignored: [false, null], topLevelOnly: '1' }}
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
