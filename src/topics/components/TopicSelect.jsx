import React from 'react';
import { useField, useFormState } from 'react-final-form'; // eslint-disable-line
import {
  useDataProvider,
  SelectInput,
  useTranslate,
  required,
  ReferenceInput,
} from 'react-admin';
import Button from '@material-ui/core/Button';
import PencilIcon from '@material-ui/icons/Edit';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as TopicsLogic from '../logic'

const SELECT_TOPIC_LEVELS = process.env.REACT_APP_SELECT_TOPIC_LEVELS;

const MultiTopicSelect = ({
  source,
  label,
  isRequired,
  disabled,
  filter,
  editting,
}) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
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
    } catch (e) {} // eslint-disable-line

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

        setTopicsChild(topic.ChildTopics);
      } else {
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

      if (topic.ChildTopics?.length > 0) {
        onChange(null);

        setTopicsGrandchild(topic.ChildTopics);
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

  const error = (errors[source] && sourceDirty) || (errors.topicOne && topicOneDirty)
    || (errors.topicTwo && topicTwoDirty) || (errors.topicThree && topicThreeDirty);

  React.useEffect(() => {
    if (!topics.length) {
      fetch();
    }
  }, []);

  React.useEffect(() => {
    if (filter.fk_languageId) {
      setFilteredTopics(topics.filter((t) => t.fk_languageId === filter.fk_languageId));
    } else {
      setFilteredTopics(topics);
    }
  }, [filter, topics]);

  const selectedTopicLabel = TopicsLogic.getTreeLabel(value, topics);
/*
  const selected = topicsGrandchild.length
    ? topicsGrandchild.find((t) => t.id === value)
    : (
      topicsChild.length
        ? topicsChild.find((t) => t.id === value)
        : topics.find((t) => t.id === value)
    );
*/
  return (
    <Box>
      <Typography variant="body2" style={{ color: error ? '#f44336' : 'initial' }}>
        {translate(label)}
      </Typography>
      {
        loading && <Box mb={2}><CircularProgress size={20} /></Box>
      }
      {
        !loading && (editting && !toggleEdit) && (
          <Box mb={2}>
            <Button color="secondary" onClick={() => setToggleEdit(true)} size="small">
              {selectedTopicLabel} &nbsp;&nbsp;<PencilIcon fontSize="small" />
            </Button>
          </Box>
        )
      }
      {
        !loading && (!editting || (editting && toggleEdit)) && (
          <Box display="flex">
            <Box flex={1} mr={1}>
              <SelectInput
                source="topicOne"
                choices={filteredTopics}
                optionText="name"
                optionValue="id"
                label=""
                fullWidth
                style={{ marginTop: '0px' }}
                disabled={disabled}
                validate={isRequired ? required() : null}
              />
            </Box>
            {
              !!topicsChild.length && (
                <Box flex={1} mr={1}>
                  <SelectInput
                    source="topicTwo"
                    choices={topicsChild}
                    optionText="name"
                    optionValue="id"
                    label=""
                    fullWidth
                    style={{ marginTop: '0px' }}
                    disabled={disabled}
                    validate={isRequired ? required() : null}
                  />
                </Box>
              )
            }
            {
              !!topicsGrandchild.length && (
                <Box flex={1}>
                  <SelectInput
                    source="topicThree"
                    choices={topicsGrandchild}
                    optionText="name"
                    optionValue="id"
                    label=""
                    fullWidth
                    style={{ marginTop: '0px' }}
                    disabled={disabled}
                    validate={isRequired ? required() : null}
                  />
                </Box>
              )
            }
          </Box>
        )
      }
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
        disabled, source, label, isRequired, editting, filter,
      }}
    />
  );
};

export default TopicSelect;
