import React from 'react';
import {
  ReferenceInput,
  SelectInput,
  TextInput,
  useListContext,
  useTranslate,
} from 'react-admin';
import { Form } from 'react-final-form';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import styles from './styles';

const Filters = ({ languages, topics, ...props }) => {
  const classes = styles();
  const translate = useTranslate();
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
          <TextInput label="misc.text" source="q" alwaysOn onChange={() => handleSubmit()} />
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
              emptyText={translate('misc.none')}
            />
          </ReferenceInput>
          <ReferenceInput
            onChange={() => handleSubmit()}
            label="resources.answers.fields.fk_editorId"
            source="fk_editorId"
            reference="users"
            alwaysOn
            allowEmpty
            perPage={100}
          >
            <SelectInput optionText="name" className={classes.select} allowEmpty emptyText={translate('misc.none')} />
          </ReferenceInput>
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
              emptyText={translate('misc.none')}
            />
          </ReferenceInput>
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
        </form>
      )}
    </Form>
  );
};

export default Filters;
