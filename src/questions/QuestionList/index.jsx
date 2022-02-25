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
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import Badge from '@material-ui/core/Badge';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import ThumbsUpIcon from '@material-ui/icons/ThumbUp';
import ThumbsDownIcon from '@material-ui/icons/ThumbDown';
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

const CustomGridItem = ({
  record, removeAnswer,
  visibleColumns,
}) => {
  const disableEdit = useDisabledEdit(record?.fk_topicId);
  const disableApprove = useDisabledApprove(record?.fk_topicId);
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
    </>
  );
};

const CustomGrid = ({
  removeAnswer,
  visibleColumns,
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
