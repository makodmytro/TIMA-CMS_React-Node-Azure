import React from 'react';
import {
  Create,
  SimpleForm,
  useNotify,
  useDataProvider,
  required,
  ReferenceInput,
  SelectInput,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';
import AutocompleteInput from './autocomplete-input';

const FormFields = (props) => {
  const {
    input: { value },
  } = useField('fk_languageId');

  const getLang = () => {
    if (!value || !props.languages[value]) {
      return null;
    }

    return props.languages[value].code;
  };

  return (
    <>
      <PlayableTextInput
        label="resources.questions.fields.text"
        source="text"
        validate={required()}
        lang={getLang}
        fullWidth
      />
      <ReferenceInput
        label="resources.questions.fields.fk_languageId"
        source="fk_languageId"
        reference="languages"
        validate={required()}
        fullWidth
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>

      <ReferenceInput
        label="resources.questions.fields.fk_topicId"
        source="fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
        filter={{ fk_languageId: value }}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <AutocompleteInput />
      <ReferenceInput
        allowEmpty
        label="resources.questions.fields.fk_parentQuestionId"
        source="fk_parentQuestionId"
        reference="questions"
        fullWidth
      >
        <SelectInput
          allowEmpty
          resettable
          emptyValue={null}
          optionText="text"
          fullWidth
        />
      </ReferenceInput>
      <ReferenceInput
        allowEmpty
        label="resources.questions.fields.fk_questionId"
        source="fk_questionId"
        reference="questions"
        fullWidth
      >
        <SelectInput
          allowEmpty
          resettable
          emptyValue={null}
          optionText="text"
        />
      </ReferenceInput>
    </>
  );
};

const QuestionCreate = ({ dispatch, languages, ...props }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const createAnswer = async (values) => {
    try {
      const { data } = await dataProvider.create('answers', {
        data: values,
      });

      return data;
    } catch (err) {
      notify(`Failed to create new answer for the question: ${err.message}`);

      throw err;
    }
  };

  return (
    <>
      <Create
        {...props}
        actions={<CustomTopToolbar />}
        transform={async (data) => {
          const { answer_text: answerText, ...rest } = data;

          if (answerText && !rest.fk_answerId) {
            const answer = await createAnswer({
              text: answerText,
              fk_topicId: rest.fk_topicId,
              fk_languageId: rest.fk_languageId,
            });

            rest.fk_answerId = answer.id;
          }

          return rest;
        }}
      >
        <SimpleForm redirect="list">
          <FormFields languages={languages} />
        </SimpleForm>
      </Create>
    </>
  );
};

const mapStateToProps = (state) => ({
  languages: state.admin.resources.languages.data,
});

export default connect(mapStateToProps)(QuestionCreate);
