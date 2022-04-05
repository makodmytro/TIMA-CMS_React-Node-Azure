import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  DateField,
  List,
  ReferenceField,
  TextField,
  useRedirect,
  useTranslate,
  useListContext,
} from 'react-admin';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PlayableText from '../../common/components/playable-text';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../../common/components/ListActions';
import ApprovedSwitchField from '../components/approved-swtich-field';
import TopicSelectCell from '../../common/components/TopicSelectCell';
import { Language } from '../../common/components/fields-values-by-fk';
import StatusField from '../../common/components/StatusField';
import DropDownMenu from '../components/list-dropdown-menu';
import AnswerTextField from '../components/TextField';
import AnswerField from '../../questions/components/AnswerField';
import Filters from './Filters';
import styles from './styles';
import { useDisabledEdit, useDisabledApprove } from '../../hooks';

const QUESTIONS_TREE_CHILD_COLOR = process.env.REACT_APP_QUESTIONS_TREE_CHILD_COLOR || '498ca752';
const QUESTIONS_ENABLE_TREE_LIST = process.env.REACT_APP_QUESTIONS_ENABLE_TREE_LIST || '1';
const HIDDEN_FIELDS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS
  ? process.env.REACT_APP_HIDE_FIELDS_ANSWERS.split(',')
  : [];

const columns = [
  { key: 'text' },
  { key: 'spokenText' },
  { key: 'fk_languageId' },
  { key: 'fk_editorId' },
  { key: 'status' },
  { key: 'fk_topicId' },
  { key: 'approved' },
  { key: 'tags' },
  { key: 'updatedAt' },
].filter((c) => !HIDDEN_FIELDS.includes(c.key));

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : {};

  return { topics, languages };
};

const WrapTopicSelect = (props) => {
  return (
    <TopicSelectCell source="fk_topicId" label="resources.answers.fields.fk_topicId" sortBy="fk_topicId" {...props} disabled={useDisabledEdit(props?.record?.fk_topicId)} />
  );
};
const WrapApprovedSwitch = (props) => {
  return (
    <ApprovedSwitchField label="resources.answers.fields.approved" {...props} disabled={useDisabledApprove(props?.record?.fk_topicId)} />
  );
};

const CustomGridItem = ({
  record,
  visibleColumns,
  level,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const classes = styles();
  const redirect = useRedirect();

  const link = (id) => (e) => {
    e.stopPropagation();
    redirect(`/answers/${id}`);
  };

  const bg = !level ? 'initial' : `#${(parseInt(QUESTIONS_TREE_CHILD_COLOR, 16) + 32 * level).toString(16)}`;

  if (level) {
    return (
      <>
        <TableRow
          className={classes.cursor}
          style={{ backgroundColor: bg }}
          onClick={(e) => {
            e.stopPropagation();
            redirect(`/questions/${record.id}`);
          }}
        >
          <TableCell>
            {
              !!record.FollowupQuestions && record.FollowupQuestions.length > 0 && (
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
          <TableCell style={{ width: '25%' }}>
            <AnswerField label="Answer" record={record} />
          </TableCell>
          {
            (Array.from(Array(visibleColumns.length - 2).keys())).map((v, i) => (
              <TableCell key={i}>&nbsp;</TableCell>
            ))
          }
          <TableCell>
            &nbsp;
          </TableCell>
        </TableRow>
      </>
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
            !!record.FollowupQuestions && record.FollowupQuestions.length > 0 && QUESTIONS_ENABLE_TREE_LIST === '1' && (
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

        {
          visibleColumns.includes('text') && (
            <TableCell>
              <AnswerTextField label="resources.answers.fields.text" sortBy="text" record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('spokenText') && (
            <TableCell>
              <TextField source="spokenText" label="resources.answers.fields.spokenText" sortBy="spokenText" record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('fk_languageId') && (
            <TableCell>
              <Language label="resources.answers.fields.fk_languageId" sortBy="fk_languageId" record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('fk_editorId') && (
            <TableCell>
              <ReferenceField source="fk_editorId" label="resources.answers.fields.fk_editorId" sortBy="fk_editorId" reference="users" link={false} record={record} basePath="answers">
                <TextField source="name" />
              </ReferenceField>
            </TableCell>
          )
        }
        {
          visibleColumns.includes('status') && (
            <TableCell>
              <StatusField source="status" label="resources.answers.fields.status" sortable={false} record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('fk_topicId') && (
            <TableCell>
              <WrapTopicSelect label="resources.answers.fields.fk_topicId" record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('approved') && (
            <TableCell>
              <WrapApprovedSwitch label="resources.answers.fields.approved" record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('tags') && (
            <TableCell>
              <TextField source="tags" label="resources.answers.fields.tags" sortable={false} record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('updatedAt') && (
            <TableCell>
              <DateField source="updatedAt" showTime record={record} />
            </TableCell>
          )
        }
        <TableCell>
          <DropDownMenu record={record} />
        </TableCell>
      </TableRow>
      {
        expanded && record.FollowupQuestions && !!record.FollowupQuestions.length && (
          <>
            {
              record.FollowupQuestions.map((child, iii) => (
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

const CustomGrid = ({ visibleColumns }) => {
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
                <Th label="resources.answers.fields.text" field="text" />
                <Th label="resources.answers.fields.spokenText" field="spokenText" />
                <Th label="resources.answers.fields.fk_languageId" field="fk_languageId" />
                <Th label="resources.answers.fields.fk_editorId" field="fk_editorId" />
                <Th label="resources.answers.fields.status" field="status" />
                <Th label="resources.answers.fields.fk_topicId" field="fk_topicId" />
                <Th label="resources.answers.fields.approved" field="approved" />
                <Th label="resources.answers.fields.updatedAt" field="updatedAt" />
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

const AnswerList = ({
  languages, topics, dispatch, ...props
}) => {
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
        <CustomGrid visibleColumns={visibleColumns} />
      </List>
    </>
  );
};

export default connect(mapStateToProps)(AnswerList);
