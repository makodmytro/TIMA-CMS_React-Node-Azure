import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import Select from '@material-ui/core/Select';
import { useDataProvider, useListContext, useRefresh, TextField } from 'react-admin';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTopicsTree } from '../../topics/useTopics';
import * as TopicsLogic from '../../topics/logic';

const SELECT_TOPIC_LEVELS = process.env.REACT_APP_SELECT_TOPIC_LEVELS;

const TopicSelectCell = ({ record, source, label, disabled }) => {
  const topics = useSelector((state) => state.admin.resources.topics.data);
  const { resource } = useListContext();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  const topicOptions = topics
    ? Object.values(topics).filter((topic) => !record.fk_languageId || topic.fk_languageId === record.fk_languageId)
    : [];

  const handleChange = async (event) => {
    event.stopPropagation();
    setLoading(true);
    await dataProvider.update(resource, {
      id: record.id,
      data: {
        fk_topicId: event.target.value,
      },
    });
    setLoading(false);
    refresh();
  };
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select label={label} value={get(record, source)} onChange={handleChange} style={{ minWidth: 100 }} disabled={disabled === true}>
        <MenuItem value={null}>
          <em>None</em>
        </MenuItem>

        {topicOptions.map((topic) => (
          <MenuItem value={topic.id} key={topic.id}>
            {topic.name}
          </MenuItem>
        ))}
      </Select>
      {loading && <LinearProgress />}
    </div>
  );
};

const MultiLevelLabel = ({ record }) => {
  const { topics } = useTopicsTree();

  if (!topics.length) {
    return null;
  }

  const label = TopicsLogic.getTreeLabel(record?.fk_topicId, topics);

  return <TextField source="name" record={{ name: label }} />;
};

const TopicCell = (props) => {
  if (!SELECT_TOPIC_LEVELS || SELECT_TOPIC_LEVELS === '0') {
    return <TopicSelectCell {...props} />;
  }

  return <MultiLevelLabel {...props} />;
};

export default TopicCell;
