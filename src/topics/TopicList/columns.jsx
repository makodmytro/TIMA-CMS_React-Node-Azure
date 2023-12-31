import React from 'react';
import { TextField, DateField } from 'react-admin';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TopicImage from '../components/Image';

const HIDDEN_FIELDS = process.env.REACT_APP_HIDE_FIELDS_TOPICS ? process.env.REACT_APP_HIDE_FIELDS_TOPICS.split(',') : [];

const Progress = ({ record }) => {
  if (!record?.syncScheduled) {
    return null;
  }

  return (
    <Box textAlign="center">
      <CircularProgress size={20} color="primary" />
    </Box>
  );
};

const columns = [
  {
    key: 'name',
    el: <TextField source="name" />,
  },
  { key: 'welcomeText', el: <TextField source="welcomeText" /> },
  {
    key: 'topicKey',
    el: <TextField source="topicKey" />,
  },
  {
    key: 'level',
    el: <TextField source="level" />,
  },
  {
    key: 'qnaApiVersion',
    el: <TextField source="qnaApiVersion" label="QNA Version" />,
  },
  {
    key: 'qnaKnowledgeBaseId',
    el: <TextField source="qnaKnowledgeBaseId" label="Knowledge base ID" />,
  },
  {
    key: 'image',
    el: <TopicImage label="Image" />,
  },
  {
    key: 'syncScheduled',
    el: <Progress />,
  },
  {
    key: 'updatedAt',
    el: <DateField source="contentLastUpdatedAt" showTime />,
  },
  {
    key: 'lastSyncAt',
    el: <DateField source="lastSyncAt" showTime label="Last sync at" />,
  },
];

export default columns.filter((c) => !HIDDEN_FIELDS.includes(c.key));
