import React, { cloneElement, useState } from 'react';
import { connect } from 'react-redux';
import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
} from 'react-admin';
import Badge from '@material-ui/core/Badge';
import ReactMarkdown from 'react-markdown';
import PlayableText from '../../common/components/playable-text';
import ListActions, {
  getVisibleColumns,
  handleColumnsChange,
} from '../../common/components/ListActions';
import ApprovedSwitchField from '../components/approved-swtich-field';
import TopicSelectCell from '../../common/components/TopicSelectCell';
import { Language } from '../../common/components/fields-values-by-fk';
import DropDownMenu from '../components/list-dropdown-menu';
import Filters from './Filters';
import styles from './styles';
import { useDisabledEdit } from '../../hooks';

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : {};

  return { topics, languages };
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
        text={record.spokenText || record.text}
        lang={languages[record.fk_languageId] ? languages[record.fk_languageId].code : null}
      />
    </div>
  );
});

const WrapTopicSelect = (props) => {
  return (
    <TopicSelectCell source="fk_topicId" label="Topic" sortBy="fk_topicId" {...props} disabled={useDisabledEdit(props?.record?.fk_topicId)} />
  );
};
const WrapApprovedSwitch = (props) => {
  return (
    <ApprovedSwitchField label="Approved" {...props} disabled={useDisabledEdit(props?.record?.fk_topicId)} />
  );
};

const AnswerList = ({
  languages, topics, dispatch, ...props
}) => {
  const columns = [
    {
      key: 'text',
      el: <Text label="Text" sortBy="text" />,
    },
    {
      key: 'spokenText',
      el: <TextField source="spokenText" label="Spoken text" sortBy="spokenText" />,
    },
    {
      key: 'fk_languageId',
      el: <Language label="Language" sortBy="fk_languageId" />,
    },
    {
      key: 'fk_editorId',
      el: (
        <ReferenceField source="fk_editorId" label="Editor" sortBy="fk_editorId" reference="users" link={false}>
          <TextField source="name" />
        </ReferenceField>
      ),
    },
    {
      key: 'fk_topicId',
      el: <WrapTopicSelect />,
    },
    {
      key: 'approved',
      el: <WrapApprovedSwitch />,
    },
    {
      key: 'tags',
      el: <TextField source="tags" label="Tags" sortable={false} />,
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
