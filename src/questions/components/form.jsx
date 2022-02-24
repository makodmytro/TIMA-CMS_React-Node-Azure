import React from 'react';
import { ReferenceInput, required, SelectInput } from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import AutocompleteInput from './autocomplete-input';
import { PlayableTextInput } from '../../common/components/playable-text';

const FormFields = ({
  languages,
  edit,
}) => {
  const {
    input: { value },
  } = useField('fk_languageId');

  const getLang = () => {
    if (!value || !languages[value]) {
      return null;
    }

    return languages[value].code;
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
      {
        !edit && (
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
        )
      }

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
      {
        !edit && (
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
        )
      }
      {
        !edit && (
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
        )
      }
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

export default connect(mapStateToProps)(FormFields);