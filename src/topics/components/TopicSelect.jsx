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
  const [topicsSubOne, setTopicsSubOne] = React.useState([]);
  const [topicsSubTwo, setTopicsSubTwo] = React.useState([]);

  const { errors } = useFormState();
  const { meta: { dirty: sourceDirty }, input: { value, onChange } } = useField(source);
  const { meta: { dirty: topicOneDirty }, input: { value: topicOne, onChange: onTopicOneChange } } = useField('topicOne');
  const { meta: { dirty: topicTwoDirty }, input: { value: topicTwo, onChange: onTopicTwoChange } } = useField('topicTwo');
  const { meta: { dirty: topicThreeDirty }, input: { value: topicThree, onChange: onTopicThreeChange } } = useField('topicThree');

  const fetchChildren = async (_id, level = 1) => {
    try {
      const { data } = await dataProvider.getOne('topics', { id: _id });

      if (level === 1) {
        setTopicsSubOne(data?.ChildTopics || []);
      } else {
        setTopicsSubTwo(data?.ChildTopics || []);
      }
    } catch (e) {} // eslint-disable-line
  };

  const fetchParent = async (_id) => {
    setLoading(true);
    try {
      // this function gets called on edit
      // we get the currently selected topic
      const { data } = await dataProvider.getOne('topics', { id: _id });

      // if the topic has a parent, then we need to move up a level
      if (data.fk_parentTopicId) {
        // get the parent topic
        const { data: parent } = await dataProvider.getOne('topics', { id: data.fk_parentTopicId });

        // if the parent has a parent itself, we know the selected Topic is from the third select
        // first select grand parent, second select parent, third select our selected topic
        if (parent.fk_parentTopicId) {
          // fetchChildren(parent.fk_parentTopicId, 1);
          // fetchChildren(parent.id, 2);

          onTopicOneChange(parent.fk_parentTopicId);

          setTimeout(() => onTopicTwoChange(parent.id), 1000);
          setTimeout(() => {
            onTopicThreeChange(data.id);
            setLoading(false);
          }, 1500);
        } else {
          // if the parent doesn't have a parent itself, we know the selected Topic is from the second select
          // first select parent, second select our selected topic
          // fetchChildren(parent.id, 1);
          onTopicOneChange(parent.id);

          setTimeout(() => {
            onTopicTwoChange(data.id);
            setLoading(false);
          }, 1000);
        }
      } else {
        // if the selected topic doesnt have a parent, we know its from the first select
        onTopicOneChange(_id);
        setLoading(false);
      }
    } catch (e) {} // eslint-disable-line
  };

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList('topics', {
        pagination: { perPage: 200, page: 1 },
        filter: { topLevelOnly: '1' },
      });

      setTopics(data);
    } catch (e) {} // eslint-disable-line
  };

  React.useEffect(() => {
    if (topicOne) {
      setTopicsSubOne([]);
      setTopicsSubTwo([]);
      onTopicTwoChange(null);
      onTopicThreeChange(null);

      const topic = topics.find((t) => t.id === topicOne);

      if (!topic) {
        return;
      }

      if (topic.childCount > 0) {
        onChange(null);

        fetchChildren(topic.id);
      } else {
        onChange(topicOne);
      }
    }
  }, [topicOne]);

  React.useEffect(() => {
    if (topicTwo) {
      setTopicsSubTwo([]);
      onTopicThreeChange(null);

      const topic = topicsSubOne.find((t) => t.id === topicTwo);

      if (!topic) {
        return;
      }

      if (topic.childCount > 0) {
        onChange(null);

        fetchChildren(topic.id, 2);
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
      const topic = topics.find((t) => t.id === value);

      // if we have topic match, its a top level topic
      if (topic) {
        onTopicOneChange(topic.id);
      } else {
        // if we don't have topic match we need to retrieve the parent
        fetchParent(value);
      }
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

  const selected = topicsSubTwo.length
    ? topicsSubTwo.find((t) => t.id === value)
    : (
      topicsSubOne.length
        ? topicsSubOne.find((t) => t.id === value)
        : topics.find((t) => t.id === value)
    );

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
              {selected?.name} &nbsp;&nbsp;<PencilIcon fontSize="small" />
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
              !!topicsSubOne.length && (
                <Box flex={1} mr={1}>
                  <SelectInput
                    source="topicTwo"
                    choices={topicsSubOne}
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
              !!topicsSubTwo.length && (
                <Box flex={1}>
                  <SelectInput
                    source="topicThree"
                    choices={topicsSubTwo}
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
