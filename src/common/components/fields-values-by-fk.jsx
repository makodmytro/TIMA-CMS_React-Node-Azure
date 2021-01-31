import React from 'react';
import {
  TextField,
} from 'react-admin';
import { connect } from 'react-redux';

export const Language = connect((state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : [];

  return {
    languages,
  };
})(({
  record,
  dispatch,
  languages,
  ...props
}) => {
  if (!record || !record.fk_languageId || !languages[record.fk_languageId]) {
    return null;
  }

  return (
    <TextField
      {...props}
      source="Language.name"
      record={{ Language: languages[record.fk_languageId] }}
    />
  );
});

export const Topic = connect((state) => {
  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : [];

  return {
    topics,
  };
})(({
  record,
  dispatch,
  topics,
  ...props
}) => {
  if (!record || !record.fk_topicId || !topics[record.fk_topicId]) {
    return null;
  }

  return (
    <TextField
      {...props}
      source="Topic.name"
      record={{ Topic: topics[record.fk_topicId] }}
    />
  );
});
