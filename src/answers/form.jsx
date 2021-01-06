import React from 'react';
import {
  ReferenceInput, required, SelectInput,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import { PlayableTextInput } from '../common/components/playable-text';

const Form = ({ languages }) => {
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
        source="text"
        validate={required()}
        fullWidth
        lang={getLang}
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
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
    </>
  );
};

const mapStateToProps = (state) => ({
  languages: state.admin.resources.languages.data,
});

export default connect(mapStateToProps)(Form);
