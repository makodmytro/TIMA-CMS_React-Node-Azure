import React, { useMemo } from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {
  TextInput,
  useTranslate,
  BooleanInput,
  SelectInput,
  required,
} from 'react-admin';
import { useSelector } from 'react-redux';

const StepFour = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const translate = useTranslate();
  const TOPICS_METADATA = process.env.REACT_APP_TOPICS_METADATA_REQUIRED === '1';
  const TOPICS_METADATA_KEYS = process.env.REACT_APP_TOPICS_METADATA_KEYS ? process.env.REACT_APP_TOPICS_METADATA_KEYS.split(',') : ['', '', ''];
  const topics = useSelector((state) => state.admin.resources.topics.data);

  const departments = useMemo(() => Object.values(topics).filter((topic) => topic.fk_parentTopicId == null), [topics]);
  const topicGroups = useMemo(() => {
    return Object.values(topics).filter((topic) => topics[topic.fk_parentTopicId] && !topics[topic.fk_parentTopicId].fk_parentTopicId);
  }, [topics]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={async (values) => {
        const errors = {};
        if (values.hasParent && !values.fk_parentTopicId) {
          errors.fk_parentTopicId = translate('Required');
        }
        return errors;
      }}
      render={({ handleSubmit, submitting, values, valid }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box>
              {TOPICS_METADATA_KEYS ? (
                <SelectInput
                  source="qnaMetadataKey"
                  label="resources.topics.fields.qnaMetadataKey"
                  validate={TOPICS_METADATA && required()}
                  choices={[
                    {
                      id: TOPICS_METADATA_KEYS[0],
                      name: translate(`resources.topics.fields.qnaMetadataKeyOptions.${TOPICS_METADATA_KEYS[0]}`) || TOPICS_METADATA_KEYS[0],
                    },
                    {
                      id: TOPICS_METADATA_KEYS[1],
                      name: translate(`resources.topics.fields.qnaMetadataKeyOptions.${TOPICS_METADATA_KEYS[1]}`) || TOPICS_METADATA_KEYS[1],
                    },
                    {
                      id: TOPICS_METADATA_KEYS[2],
                      name: translate(`resources.topics.fields.qnaMetadataKeyOptions.${TOPICS_METADATA_KEYS[2]}`) || TOPICS_METADATA_KEYS[2],
                    },
                  ]}
                  margin="dense"
                  fullWidth
                />
              ) : (
                <TextInput
                  source="qnaMetadataKey"
                  validate={TOPICS_METADATA && required()}
                  label="resources.topics.fields.qnaMetadataKey"
                  fullWidth
                />
              )}
              {!!values.qnaMetadataKey && values.qnaMetadataKey !== TOPICS_METADATA_KEYS[0] && (
                <SelectInput
                  source="fk_parentTopicId"
                  label="resources.topics.fields.qnaMetadataKey"
                  validate={required()}
                  choices={
                    values.qnaMetadataKey === TOPICS_METADATA_KEYS[1] ? departments : topicGroups
                  }
                  margin="dense"
                  fullWidth
                />
              )}
              <TextInput
                source="qnaMetadataValue"
                validate={TOPICS_METADATA && required()}
                label="resources.topics.fields.qnaMetadataValue"
                fullWidth
              />
              <TextInput
                source="qnaApiEndpoint"
                label="resources.topics.fields.qnaApiEndpoint"
                fullWidth
              />
              <TextInput
                source="qnaApiVersion"
                label="resources.topics.fields.qnaApiVersion"
                fullWidth
              />
              <TextInput
                source="qnaSubscriptionKey"
                label="resources.topics.fields.qnaSubscriptionKey"
                autoComplete="new-password"
                type="password"
                fullWidth
              />
              <TextInput
                source="qnaKnowledgeBaseId"
                label="resources.topics.fields.qnaKnowledgeBaseId"
                autoComplete="new-password"
                fullWidth
              />
              <BooleanInput source="startSync" label="resources.topics.fields.startSync" />
            </Box>
            <Box textAlign="right">
              <Button type="button" variant="outlined" color="primary" size="small" onClick={() => onBack(values)}>
                {translate('misc.back')}
              </Button>
              &nbsp;
              <Button type="submit" disabled={!valid || submitting} variant="contained" color="secondary" size="small">
                {translate('misc.next')}
              </Button>
            </Box>
          </form>
        );
      }}
    />
  );
};

export default StepFour;
