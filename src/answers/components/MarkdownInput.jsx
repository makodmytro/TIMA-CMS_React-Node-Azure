import React from 'react';
import {
  TextInput,
  useTranslate,
  required,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import ReactMarkdown from 'react-markdown';
import RichTextEditor from 'react-rte';
import MdEditor from 'react-markdown-editor-lite';
import PlayableText from '../../common/components/playable-text';

const MarkdownInput = ({
  source, label, lang, disabled,
}) => {
  const [state, setState] = React.useState(RichTextEditor.createEmptyValue());
  const translate = useTranslate();
  const { input: { value: spokenText } } = useField('spokenText');
  const {
    input: { onChange, value },
    meta: {
      touched, dirty, error, submitFailed,
    },
  } = useField(source, { validate: required() });

  const invalid = !!error && (touched || dirty || submitFailed);

  React.useEffect(() => {
    if (value && !touched && !dirty) {
      setState(RichTextEditor.createValueFromString(value, 'markdown'));
    }
  }, [value]);

  return (
    <>
      <InputLabel error={invalid}>{translate(label)}</InputLabel>
      <FormControl fullWidth error={invalid}>
        <RichTextEditor
          value={state}
          onChange={(v) => {
            onChange(v.toString('markdown'));
            setState(v);
          }}
          disabled={disabled === true}
          readOnly={disabled === true}
        />
        <Box p={1} textAlign="right" style={{ border: '1px solid #e0e0e0', borderTop: 'none' }}>
          <TextInput source="spokenText" label="resources.answers.fields.spokenText" fullWidth multiline rows={2} disabled={disabled === true} />
          <PlayableText text={spokenText || value} lang={lang} hideText disabled={disabled === true} />
        </Box>
      </FormControl>
    </>
  );
};

export const MarkdownInputOld = ({
  source, label, lang, disabled,
}) => {
  const translate = useTranslate();
  const { input: { value: spokenText } } = useField('spokenText');
  const {
    input: { onChange, value },
    meta: {
      touched, dirty, error, submitFailed,
    },
  } = useField(source);

  const invalid = !!error && (touched || dirty || submitFailed);

  return (
    <>
      <InputLabel error={invalid}>{translate(label)}</InputLabel>
      <FormControl fullWidth error={invalid}>
        <MdEditor
          style={{ height: '40vh', borderColor: !invalid ? 'rgba(224, 224, 224, 1)' : 'red' }}
          renderHTML={(text) => <ReactMarkdown source={text} />}
          onChange={({ text }) => {
            onChange(text);
          }}
          value={value}
          disabled={disabled === true}
        />
        <Box p={1} textAlign="right" style={{ border: '1px solid #e0e0e0', borderTop: 'none' }}>
          <TextInput source="spokenText" label="resources.answers.fields.spokenText" fullWidth multiline rows={2} disabled={disabled === true} />
          <PlayableText text={spokenText || value} lang={lang} hideText disabled={disabled === true} />
        </Box>
      </FormControl>
    </>
  );
};

export default MarkdownInput;
