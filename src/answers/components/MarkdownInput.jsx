import React from 'react';
import {
  TextInput,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import PlayableText from '../../common/components/playable-text';

const MarkdownInput = ({
  source, label, lang, disabled,
}) => {
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
      <InputLabel error={invalid}>{label}</InputLabel>
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
          <TextInput source="spokenText" label="Spoken text" fullWidth multiline rows={2} disabled={disabled === true} />
          <PlayableText text={spokenText || value} lang={lang} hideText disabled={disabled === true} />
        </Box>
      </FormControl>
    </>
  );
};

export default MarkdownInput;
