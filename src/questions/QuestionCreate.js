import React from 'react';
import {
  Create,
  SimpleForm,
  required,
  ReferenceInput,
  SelectInput,
  BooleanInput,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';
import AutocompleteInput from './components/autocomplete-input';

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
      <BooleanInput source="useAsSuggestion" />
    </>
  );
};

const QuestionCreate = ({ dispatch, languages, ...props }) => {
  return (
    <>
      <Create
        {...props}
        actions={<CustomTopToolbar />}
        transform={async (data) => {
          const { answer_text: answerText, fk_answerId, ...rest } = data;

          if (fk_answerId) {
            return {
              ...rest,
              fk_answerId,
            };
          }

          if (answerText) {
            return {
              ...rest,
              answerText,
            };
          }

          return rest;
        }}
      >
        <SimpleForm>
          <FormFields languages={languages} />
        </SimpleForm>
      </Create>
    </>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  return {
    languages,
  };
};

export default connect(mapStateToProps)(QuestionCreate);
