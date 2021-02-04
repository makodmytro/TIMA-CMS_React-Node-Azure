import React from 'react';
import {
  Create,
  SimpleForm,
  useNotify,
  useDataProvider,
  required,
  useRedirect,
  ReferenceInput,
  SelectInput,
} from 'react-admin';
import { useField, Form } from 'react-final-form'; // eslint-disable-line
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
    </>
  );
};

const QuestionCreate = ({ dispatch, languages, ...props }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSubmit = async (values) => {
    try {
      const { answer_text: answerText, ...rest } = values;

      if (answerText && !rest.fk_answerId) {
        const { data } = await dataProvider.createAnswerWithQuestions(null, {
          data: {
            text: answerText,
            fk_topicId: rest.fk_topicId,
            fk_languageId: rest.fk_languageId,
            questions: [{
              ...rest,
            }],
          },
        });

        redirect(`/answers/${data.id}`);
      } else {
        const { data } = await dataProvider.create('questions', {
          data: rest,
        });

        redirect(`/questions/${data.id}`);
      }

      notify('The question has been created');
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }

      throw err;
    }
  };

  return (
    <>
      <Create
        {...props}
        actions={<CustomTopToolbar />}
      >
        <SimpleForm save={onSubmit}>
          <FormFields languages={languages} />
        </SimpleForm>
      </Create>
    </>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : [];

  return {
    languages,
  };
};

export default connect(mapStateToProps)(QuestionCreate);
