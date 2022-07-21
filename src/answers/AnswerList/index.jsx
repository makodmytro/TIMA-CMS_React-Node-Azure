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
  useDataProvider,
} from 'react-admin';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../../common/components/ListActions';
import ApprovedSwitchField from '../components/approved-swtich-field';
import TopicSelectCell from '../../common/components/TopicSelectCell';
import { Language } from '../../common/components/fields-values-by-fk';
import StatusField from '../../common/components/StatusField';
import DropDownMenu from '../components/list-dropdown-menu';
import AnswerTextField, { AnswerRelatedQuestionField } from '../components/TextField';
import Filters from './Filters';
import styles from './styles';
import { useDisabledApprove } from '../../hooks';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';
const HIDDEN_FIELDS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS
  ? process.env.REACT_APP_HIDE_FIELDS_ANSWERS.split(',')
  : [];

if (!USE_WORKFLOW) {
  HIDDEN_FIELDS.push('status');
} else {
  HIDDEN_FIELDS.push('approved');
}

const columns = [
  { key: 'fk_questionId' },
  { key: 'text' },
  { key: 'spokenText' },
  { key: 'fk_languageId' },
  { key: 'fk_createdByUserId' },
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
    <TopicSelectCell
      source="fk_topicId"
      label="resources.answers.fields.fk_topicId"
      sortBy="fk_topicId"
      {...props}
      disabled={props?.record?.allowEdit === false || props?.record?.isContextOnly}
    />
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
}) => {
  const classes = styles();
  const redirect = useRedirect();

  const link = (id) => (e) => {
    e.stopPropagation();
    redirect(`/answers/${id}`);
  };

  if (!record) {
    return null;
  }

  return (
    <>
      <TableRow
        className={classes.cursor}
        onClick={link(record.id)}
      >
        {
          visibleColumns.includes('fk_questionId') && (
            <TableCell>
              <AnswerRelatedQuestionField label="resources.answers.fields.fk_questionId" record={record} />
            </TableCell>
          )
        }
        {
          visibleColumns.includes('text') && (
            <TableCell>
              <AnswerTextField label="resources.answers.fields.text" sortBy="text" record={record} hideRelatedQuestions />
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
          visibleColumns.includes('fk_createdByUserId') && (
            <TableCell>
              <ReferenceField source="fk_createdByUserId" label="resources.answers.fields.fk_createdByUserId" sortBy="fk_createdByUserId" reference="users" link={false} record={record} basePath="answers">
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
        <Box my={1} maxWidth="100%">
          <Table>
            <TableHead>
              <TableRow>
                <Th label="resources.answers.fields.fk_questionId" field="fk_questionId" />
                <Th label="resources.answers.fields.text" field="text" />
                <Th label="resources.answers.fields.spokenText" field="spokenText" />
                <Th label="resources.answers.fields.fk_languageId" field="fk_languageId" />
                <Th label="resources.answers.fields.fk_createdByUserId" field="fk_createdByUserId" />
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
  const [disableCreate, setDisableCreate] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = useState(getVisibleColumns(columns, 'answers'));
  const dataProvider = useDataProvider();

  const _f = async () => {
    const { data } = await dataProvider.contentPermission();

    setDisableCreate(!data?.allowCreateContent);
  };

  React.useEffect(() => {
    _f();
  }, []);

  return (
    <>
      <List
        {...props}
        actions={(
          <ListActions
            visibleColumns={visibleColumns}
            onColumnsChange={handleColumnsChange('answers', setVisibleColumns)}
            columns={columns}
            disableCreate={disableCreate}
          />
        )}
        empty={false}
        filters={<Filters languages={languages} topics={topics} />}
        bulkActionButtons={false}
        sort={{ field: 'updatedAt', order: 'DESC' }}
      >
        <CustomGrid visibleColumns={visibleColumns} />
      </List>
    </>
  );
};

export default connect(mapStateToProps)(AnswerList);
