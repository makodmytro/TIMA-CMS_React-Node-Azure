import React from 'react';
import {
  ReferenceInput,
  SelectInput,
  TextInput,
  useListContext,
  useTranslate,
} from 'react-admin';
import { useSelector } from 'react-redux';
import { Form } from 'react-final-form';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
  const status = useSelector((state) => state.custom.workflowStatus);
  const {
    filterValues,
    setFilters,
  } = useListContext();

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

  return (
    <Form onSubmit={handleSetFilters} initialValues={filterValues}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={classes.form}>
          <Box flex="0 0 100%">
            <Typography style={{ transform: 'uppercase' }}>{translate('misc.filters')}</Typography>
          </Box>
          <TextInput label="resources.answers.fields.filter" source="q" alwaysOn onChange={() => handleSubmit()} />
          {
            languages?.length > 1 && (
              <ReferenceInput
                onChange={() => handleSubmit()}
                label="resources.answers.fields.fk_languageId"
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
                  emptyText={translate('misc.all')}
                />
              </ReferenceInput>
            )
          }

          <ReferenceInput
            onChange={() => handleSubmit()}
            label="resources.answers.fields.fk_createdByUserId"
            source="fk_createdByUserId"
            reference="users"
            alwaysOn
            allowEmpty
            perPage={100}
          >
            <SelectInput optionText="name" className={classes.select} allowEmpty emptyText={translate('misc.all')} />
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
                label="resources.answers.fields.fk_topicId"
                source="fk_topicId"
                reference="topics"
                alwaysOn
                allowEmpty
                perPage={100}
                onChange={handleTopicChange}
                filter={filterValues.fk_languageId ? { fk_languageId: filterValues.fk_languageId }
                  : null}
              >
                <SelectInput
                  optionText="name"
                  className={classes.select}
                  allowEmpty
                  emptyText={translate('misc.all')}
                />
              </ReferenceInput>
            )
          }
          {
            !USE_WORKFLOW && (
              <SelectInput
                label="resources.answers.fields.approved"
                source="approved"
                allowEmpty
                emptyText={translate('misc.both')}
                onChange={() => handleSubmit()}
                defaultValue=""
                choices={[
                  { id: true, name: <DoneIcon color="primary" /> },
                  { id: false, name: <ClearIcon /> },
                ]}
              />
            )
          }
          {
            USE_WORKFLOW && (
              <SelectInput
                label="resources.answers.fields.status"
                source="status"
                allowEmpty
                emptyText={translate('misc.all')}
                onChange={() => handleSubmit()}
                defaultValue=""
                choices={status.map((s) => ({
                  id: s.value, name: translate(`resources.users.workflow.status.${s.name}`),
                }))}
              />
            )
          }
        </form>
      )}
    </Form>
  );
};

export default Filters;
