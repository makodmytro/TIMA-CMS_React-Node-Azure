import React from 'react';
import {
  BooleanInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  useListContext,
  useTranslate,
} from 'react-admin';
import { useSelector } from 'react-redux';
import { Form } from 'react-final-form';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import TopicSelectDialog from '../../topics/components/TopicSelectDialog';
import styles from './styles';

const TOPICS_ENABLE_TREE_LIST = process.env.REACT_APP_TOPICS_ENABLE_TREE_LIST || '1';
const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const Filters = ({ languages, topics, ...props }) => {
  const classes = styles();
  const [open, setOpen] = React.useState(false);
  const translate = useTranslate();
  const {
    filterValues,
    setFilters,
  } = useListContext();

  React.useEffect(() => {
    if (!filterValues.topLevelOnly) {
      setFilters({
        ...filterValues,
        topLevelOnly: '1',
      });
    }
  }, []);

  if (props.context === 'button') {
    return null;
  }

  const handleSetFilters = (filters) => {
    setFilters(filters, {});
  };

  const onTopicFilterConfirm = (ids) => {
    setFilters({
      ...filterValues,
      fk_topicId: ids,
    });
    setOpen(false);
  };

  const handleTopicChange = (event) => {
    setFilters({
      ...filterValues,
      fk_topicId: event.target.value,
    });

    if (event.target.value) {
      const topic = topics[event.target.value];
      if (topic) {
        const language = languages[topic.fk_languageId];

        if (language) {
          setFilters({
            ...filterValues,
            fk_languageId: language.id,
            fk_topicId: event.target.value,
          });
        }
      }
    }
  };

  const getTopicsFilter = () => {
    const filters = { globalTopic: [0, 1] };
    if (filterValues.fk_languageId) {
      filters.fk_languageId = filterValues.fk_languageId;
    }
    return filters;
  };

  return (
    <Form onSubmit={handleSetFilters} initialValues={filterValues}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextInput label="misc.text" source="q" alwaysOn onChange={() => handleSubmit()} />
          <ReferenceInput
            onChange={() => handleSubmit()}
            label="resources.questions.fields.fk_languageId"
            source="fk_languageId"
            reference="languages"
            alwaysOn
            allowEmpty
          >
            <SelectInput
              disabled={Boolean(filterValues.fk_topicId)}
              optionText="name"
              className={classes.select}
              allowEmpty
              emptyText={translate('misc.none')}
            />
          </ReferenceInput>
          <ReferenceInput
            onChange={() => handleSubmit()}
            label="resources.questions.fields.fk_editorId"
            source="fk_editorId"
            reference="users"
            alwaysOn
            allowEmpty
            perPage={100}
          >
            <SelectInput optionText="name" className={classes.select} allowEmpty emptyText={translate('misc.none')} />
          </ReferenceInput>
          {
            TOPICS_ENABLE_TREE_LIST === '1' && (
              <Box display="inline-flex" style={{ verticalAlign: 'top', flexDirection: 'column' }} pb={4}>
                <Button onClick={() => setOpen(true)}>
                  {translate('resources.topics.filter_by_topics')} {filterValues.fk_topicId ? `(${filterValues.fk_topicId.length})` : ''}
                </Button>
                <TopicSelectDialog
                  open={open}
                  onClose={() => setOpen(false)}
                  onConfirm={onTopicFilterConfirm}
                  initialValues={filterValues.fk_topicId || []}
                />
              </Box>
            )
          }
          {
            TOPICS_ENABLE_TREE_LIST !== '1' && (
              <ReferenceInput
                label="resources.questions.fields.fk_topicId"
                source="fk_topicId"
                reference="topics"
                alwaysOn
                allowEmpty
                perPage={100}
                onChange={handleTopicChange}
                filter={getTopicsFilter()}
              >
                <SelectInput
                  optionText="name"
                  className={classes.select}
                  allowEmpty
                  emptyText={translate('misc.none')}
                />
              </ReferenceInput>
            )
          }

          {
            !USE_WORKFLOW && (
              <SelectInput
                label="resources.questions.fields.approved"
                source="approved"
                allowEmpty
                emptyText="Both"
                onChange={() => handleSubmit()}
                defaultValue=""
                choices={[
                  { id: true, name: <DoneIcon color="primary" /> },
                  { id: false, name: <ClearIcon /> },
                ]}
              />
            )
          }

          <BooleanInput
            label="resources.questions.fields.ignored"
            source="ignored"
            alwaysOn
            onChange={() => handleSubmit()}
          />
          <BooleanInput
            label="misc.unanswered_questions"
            source="unanswered"
            alwaysOn
            onChange={() => handleSubmit()}
          />
        </form>
      )}
    </Form>
  );
};

export default Filters;
