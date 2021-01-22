import React from 'react';
import { ReferenceInput, required, SelectInput } from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import AutocompleteInput from './autocomplete-input';
import AnswerCreateDialog from '../answers/create-dialog';
import { PlayableTextInput } from '../common/components/playable-text';

const FormFields = ({
  open,
  setOpen,
  onAnswerCreated,
  languages,
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
      <AnswerCreateDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={onAnswerCreated}
      />
      <PlayableTextInput
        source="text"
        validate={required()}
        lang={getLang}
        fullWidth
      />
      <ReferenceInput
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
      <ReferenceInput allowEmpty source="fk_parentQuestionId" reference="questions" fullWidth>
        <SelectInput
          allowEmpty
          resettable
          emptyValue={null}
          optionText="text"
          fullWidth
        />
      </ReferenceInput>
      <ReferenceInput allowEmpty source="fk_questionId" reference="questions" fullWidth>
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

const mapStateToProps = (state) => ({
  languages: state.admin.resources.languages.data,
});

export default connect(mapStateToProps)(FormFields);
