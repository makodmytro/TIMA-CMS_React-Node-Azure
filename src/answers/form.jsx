import React from 'react';
import {
  ReferenceInput, required, SelectInput,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import PlayableText from '../common/components/playable-text';

export const MarkdownInput = ({ source, label, lang }) => {
  const {
    input: { onChange, value },
    meta: {
      touched, dirty, error, submitFailed,
    },
  } = useField(source);

  const invalid = !!error && (touched || dirty || submitFailed);

  return (
    <>
      <InputLabel error={invalid}>{label}</InputLabel>
      <FormControl fullWidth error={invalid}>
        <MdEditor
          style={{ height: '40vh', borderColor: !invalid ? 'rgba(224, 224, 224, 1)' : 'red' }}
          renderHTML={(text) => <ReactMarkdown source={text} />}
          onChange={({ text }) => {
            onChange(text);
          }}
          value={value}
        />
        <Box p={1} textAlign="right" style={{ border: '1px solid #e0e0e0', borderTop: 'none' }}>
          <PlayableText text={value} lang={lang} hideText />
        </Box>
      </FormControl>
    </>
  );
};

const Form = ({ languages, edit }) => {
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
      <MarkdownInput
        label="Text"
        source="text"
        lang={getLang()}
      />
      {
        !edit && (
          <ReferenceInput
            source="fk_languageId"
            label="resources.answers.fields.fk_languageId"
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
        source="fk_topicId"
        label="resources.answers.fields.fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
        filter={{ fk_languageId: value }}
        disabled={edit}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
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

export default connect(mapStateToProps)(Form);
