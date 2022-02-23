import React from 'react';
import {
  ReferenceInput,
  SelectInput,
  TextInput,
  useListContext,
} from 'react-admin';
import { Form } from 'react-final-form';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import styles from './styles';

const Filters = ({ languages, topics, ...props }) => {
  const classes = styles();
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
          <TextInput label="Text" source="q" alwaysOn onChange={() => handleSubmit()} />
          <ReferenceInput
            onChange={() => handleSubmit()}
            label="Language"
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
              emptyText="None"
            />
          </ReferenceInput>
          <ReferenceInput
            onChange={() => handleSubmit()}
            label="Editor"
            source="fk_editorId"
            reference="users"
            alwaysOn
            allowEmpty
            perPage={100}
          >
            <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
          </ReferenceInput>
          <ReferenceInput
            label="Topic"
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
              emptyText="None"
            />
          </ReferenceInput>
          <SelectInput
            label="Approved"
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
        </form>
      )}
    </Form>
  );
};

export default Filters;
