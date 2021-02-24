import React from 'react';
import {
  ReferenceInput,
  required,
  SelectInput,
  Confirm,
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

const Form = ({
  languages, topics, edit, record,
}) => {
  const [tmpLanguageValue, setTmpLanguageValue] = React.useState(null);
  const {
    input: { value: fkLanguageId, onChange: changeLanguage },
  } = useField('fk_languageId');
  const {
    input: { onChange: changeTopic },
  } = useField('fk_topicId');

  const getLang = () => {
    if (!fkLanguageId || !languages[fkLanguageId]) {
      return null;
    }

    return languages[fkLanguageId].code;
  };

  const onLanguageChangeConfirm = () => {
    changeLanguage(tmpLanguageValue);

    const first = Object.values(topics).find((t) => t.fk_languageId === tmpLanguageValue);

    if (first) {
      changeTopic(first.id);
    }

    setTmpLanguageValue(null);
  };

  const onLanguageChangeCancel = () => {
    setTmpLanguageValue(null);
    changeLanguage(record.fk_languageId);
  };

  const inputProps = !edit
    ? {}
    : {
      onChange: (e) => {
        e.preventDefault();
        e.stopPropagation();

        setTmpLanguageValue(e.target.value);
      },
    };

  return (
    <>
      {
        edit && (
          <Confirm
            isOpen={!!tmpLanguageValue}
            loading={false}
            title="Change language"
            content="Changing an answers's language will also have an effect its topic and the related question's topics"
            onConfirm={onLanguageChangeConfirm}
            onClose={onLanguageChangeCancel}
            confirm="Proceed"
            cancel="Undo change"
          />
        )
      }
      <MarkdownInput
        label="Text"
        source="text"
        lang={getLang()}
      />
      <ReferenceInput
        source="fk_languageId"
        label="resources.answers.fields.fk_languageId"
        reference="languages"
        validate={required()}
        fullWidth
        inputProps={inputProps}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>

      <ReferenceInput
        source="fk_topicId"
        label="resources.answers.fields.fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
        filter={{ fk_languageId: fkLanguageId }}
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

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : [];

  return {
    languages,
    topics,
  };
};

export default connect(mapStateToProps)(Form);
