import React from 'react';
import { useField, useFormState } from 'react-final-form'; // eslint-disable-line
import {
  useDataProvider,
  SelectInput,
  useTranslate,
  required,
  ReferenceInput,
  useNotify,
} from 'react-admin';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import PencilIcon from '@material-ui/icons/Edit';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as TopicsLogic from '../logic';

const SELECT_TOPIC_LEVELS = process.env.REACT_APP_SELECT_TOPIC_LEVELS;
const TOPICS_LEVEL_LABELS = process.env.REACT_APP_TOPICS_LEVEL_LABELS ? process.env.REACT_APP_TOPICS_LEVEL_LABELS.split(',') : ['', '', ''];

const MultiTopicSelect = ({
  source,
  depth,
  isRequired,
  disabled,
  filter,
  editting,
  allowEmpty,
  label,
  anyLevelSelectable,
  filterFunction,
  record,
}) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const [toggleEdit, setToggleEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filteredTopics, setFilteredTopics] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [topicsChild, setTopicsChild] = React.useState([]);
  const [topicsGrandchild, setTopicsGrandchild] = React.useState([]);

  const { errors } = useFormState();
  const { meta: { dirty: sourceDirty }, input: { value, onChange } } = useField(source);
  const { meta: { dirty: topicOneDirty }, input: { value: topicOne, onChange: onTopicOneChange } } = useField('topicOne');
  const { meta: { dirty: topicTwoDirty }, input: { value: topicTwo, onChange: onTopicTwoChange } } = useField('topicTwo');
  const { meta: { dirty: topicThreeDirty }, input: { value: topicThree, onChange: onTopicThreeChange } } = useField('topicThree');

  const findWhatIsSelected = async (_id) => {
    // try to match to the top level tops
    const parent = topics.find((topic) => topic.id === _id);

    // if it matches the selected value is top level, we set it
    if (parent) {
      onTopicOneChange(parent.id);

      return;
    }

    // try to match to level 1 ChildTopics
    let child = null;
    topics.forEach((topic) => {
      const found = (topic.ChildTopics || []).find((c) => c.id === _id);

      if (found) {
        child = found;
      }
    });

    // if it matches the selected value is 2nd level
    if (child) {
      onTopicOneChange(child.fk_parentTopicId);

      setTimeout(() => onTopicTwoChange(child.id), 500);
    }

    if (depth && depth === 2) {
      return;
    }

    // try to match to level 2 ChildTopics
    let grandchild = null;

    topics.forEach((topic) => {
      (topic.ChildTopics || []).forEach((c) => {
        (c.ChildTopics || []).forEach((ct) => {
          if (ct.id === _id) {
            grandchild = ct;
          }
        });
      });
    });

    // if it matches the selected value is 3rd level
    if (grandchild) {
      let grandchildParent;

      topics.forEach((topic) => {
        const found = (topic.ChildTopics || []).find((c) => c.id === grandchild.fk_parentTopicId);

        if (found) {
          grandchildParent = found;
        }
      });

      onTopicOneChange(grandchildParent?.fk_parentTopicId);

      setTimeout(() => onTopicTwoChange(grandchildParent?.id), 500);
      setTimeout(() => onTopicThreeChange(grandchild.id), 1000);
    }
  };

  const fetch = async () => {
    setLoading(true);

    try {
      const { data } = await dataProvider.topicTree('topics', {
        pagination: { perPage: 200, page: 1 },
        // filter: { topLevelOnly: '1' },
      });

      setTopics(data);
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (topicOne) {
      setTopicsChild([]);
      setTopicsGrandchild([]);
      onTopicTwoChange(null);
      onTopicThreeChange(null);

      const topic = topics.find((t) => t.id === topicOne);

      if (!topic) {
        return;
      }

      if (topic.ChildTopics?.length > 0) {
        onChange(null);

        setTopicsChild(
          filterFunction ? topic.ChildTopics.filter((t) => filterFunction(t)) : topic.ChildTopics
        );
      }

      if (!topic.ChildTopics?.length || anyLevelSelectable) {
        onChange(topicOne);
      }
    }
  }, [topicOne]);

  React.useEffect(() => {
    if (topicTwo) {
      setTopicsGrandchild([]);
      onTopicThreeChange(null);

      const topic = topicsChild.find((t) => t.id === topicTwo);

      if (!topic) {
        return;
      }

      if (topic.ChildTopics?.length > 0 && (!depth || depth > 2)) {
        onChange(null);

        setTopicsGrandchild(
          filterFunction ? topic.ChildTopics.filter((t) => filterFunction(t)) : topic.ChildTopics
        );
      } else {
        onChange(topicTwo);
      }
    }
  }, [topicTwo]);

  React.useEffect(() => {
    if (topicThree) {
      onChange(topicThree);
    }
  }, [topicThree]);

  React.useEffect(() => {
    // editing, we need to go backwards
    if (value && !topicOne && topics.length) {
      findWhatIsSelected(value);
    }
  }, [value, topicOne, topics]);

  const clear = () => {
    onChange(null);
    setTimeout(() => {
      onTopicOneChange(null);
      onTopicTwoChange(null);
      onTopicThreeChange(null);
      setTopicsChild([]);
      setTopicsGrandchild([]);
    }, 200);
  };

  const error = (errors[source] && sourceDirty) || (errors.topicOne && topicOneDirty)
    || (errors.topicTwo && topicTwoDirty) || (errors.topicThree && topicThreeDirty);

  React.useEffect(() => {
    if (!topics.length) {
      fetch();
    }
  }, []);

  React.useEffect(() => {
    if (filter && filter.fk_languageId) {
      setFilteredTopics(topics.filter((t) => t.fk_languageId === filter.fk_languageId));
    } else if (filterFunction) {
      setFilteredTopics(topics.filter((t) => filterFunction(t)));
    } else {
      setFilteredTopics(topics);
    }
  }, [filter, topics]);

  const selectedTopicLabel = TopicsLogic.getTreeLabel(value, topics);

  return (
    <Box>
      {
        !!label && (
          <Typography variant="body2" style={{ color: error ? '#f44336' : 'initial' }}>
            {translate(label)}&nbsp;
            {
              allowEmpty && !disabled && (
                <small onClick={() => clear()} style={{ textDecoration: 'underline', cursor: 'pointer', textTransform: 'lowercase' }}>
                  ({translate('misc.clear')})
                </small>
              )
            }
          </Typography>
        )
      }
      {
        loading && <Box mb={2}><CircularProgress size={20} /></Box>
      }
      {
        !loading && (editting && !toggleEdit) && (
          <Box mb={2}>
            <Button color="secondary" onClick={() => setToggleEdit(true)} size="small" disabled={disabled}>
              {selectedTopicLabel || translate('misc.none')} &nbsp;&nbsp;<PencilIcon fontSize="small" />
            </Button>
          </Box>
        )
      }
      {
        !loading && (!editting || (editting && toggleEdit)) && (
          <>
            <Box display="flex" width="100%">
              <Box display="flex" flexDirection="column" width="33%">

                <Box flex={1} mr={1}>
                  <SelectInput
                    source="topicOne"
                    choices={filteredTopics}
                    optionText="name"
                    optionValue="id"
                    label={TOPICS_LEVEL_LABELS[0]}
                    fullWidth
                    style={{ marginTop: '0px' }}
                    disabled={disabled || record?.isFollowupChild}
                    validate={isRequired ? required() : null}
                  />
                </Box>
                {record?.isFollowupChild
                  && (
                  <Alert severity="info">
                    {translate('resources.answers.allow_change_topic_false')}
                  </Alert>
                  )}
              </Box>

              {
                !!topicsChild.length && (!disabled || topicTwo) && (
                  <Box flex={1} mr={1}>
                    <SelectInput
                      source="topicTwo"
                      choices={topicsChild}
                      optionText="name"
                      optionValue="id"
                      label={TOPICS_LEVEL_LABELS[1]}
                      fullWidth
                      style={{ marginTop: '0px' }}
                      disabled={disabled}
                      validate={isRequired ? required() : null}
                    />
                  </Box>
                )
              }
              {
                !!topicsGrandchild.length && (!depth || depth > 2) && (!disabled || topicThree) && (
                  <Box flex={1}>
                    <SelectInput
                      source="topicThree"
                      choices={topicsGrandchild}
                      optionText="name"
                      optionValue="id"
                      label={TOPICS_LEVEL_LABELS[2]}
                      fullWidth
                      style={{ marginTop: '0px' }}
                      disabled={disabled}
                      validate={isRequired ? required() : null}
                    />
                  </Box>
                )
              }
            </Box>
          </>
        )
      }
      {(toggleEdit && record?.FollowupQuestions?.length !== 0) && (
        <Alert severity="info">
          {translate('resources.answers.topic_edit')}
        </Alert>
      )}
    </Box>
  );
};

const TopicSelect = ({
  disabled,
  source,
  label,
  isRequired,
  editting,
  filter,
  filterFunction,
  depth,
  allowEmpty,
  anyLevelSelectable,
  record = [],
}) => {
  if (!SELECT_TOPIC_LEVELS || SELECT_TOPIC_LEVELS === '0') {
    return (
      <ReferenceInput
        source={source}
        label={label}
        reference="topics"
        validate={isRequired ? required() : null}
        fullWidth
        filter={filter}
        disabled={disabled}
      >
        <SelectInput
          optionText="name"
          disabled={disabled}
        />
      </ReferenceInput>
    );
  }

  return (
    <MultiTopicSelect
      {...{
        disabled,
        source,
        isRequired,
        editting,
        filter,
        depth,
        allowEmpty,
        label,
        anyLevelSelectable,
        filterFunction,
        record,
      }}
    />
  );
};

export default TopicSelect;
