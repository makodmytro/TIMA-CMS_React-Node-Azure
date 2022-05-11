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
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { markdownToDraft, draftToMarkdown } from 'markdown-draft-js';
import PlayableText from '../../common/components/playable-text';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS?.split(',') || [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

const DraftInput = ({
  source, label, lang, disabled,
}) => {
  const translate = useTranslate();
  const [state, setState] = React.useState(EditorState.createEmpty());
  const { input: { value: spokenText, onBlur } } = useField('spokenText');
  const {
    input: { onChange, value },
    meta: {
      touched, dirty, error, submitFailed,
    },
  } = useField(source, { validate: required() });
  const invalid = !!error && (touched || dirty || submitFailed);

  React.useEffect(() => {
    if (value && !touched && !dirty) {
      const rawData = markdownToDraft(value);
      const contentState = convertFromRaw(rawData);

      setState(EditorState.createWithContent(contentState));
    }
  }, [value]);

  return (
    <>
      <InputLabel error={invalid}>{translate(label)}</InputLabel>
      <FormControl fullWidth error={invalid}>
        <Editor
          editorState={state}
          onEditorStateChange={(v) => {
            onChange(draftToMarkdown(convertToRaw(v.getCurrentContent())));
            setState(v);
          }}
          onBlur={() => onBlur()}
          disabled={disabled === true}
          readOnly={disabled === true}
          wrapperClassName={disabled === true ? 'disabled-markdown-editor' : ''}
          toolbar={{
            options: ['inline', 'blockType', 'link', 'emoji', 'remove', 'history', 'list'],
            inline: {
              options: ['bold', 'italic', 'strikethrough'],
            },
            emoji: {
              emojis: [
                '😀', '😉', '😎', '😮', '🙁', '👋', '👌', '👍', '👎',
              ],
            },
          }}
        />
        <HiddenField fieldName="spokenText">
          <Box p={1} textAlign="right" style={{ border: '1px solid #e0e0e0', borderTop: 'none' }}>
            <TextInput source="spokenText" label="resources.answers.fields.spokenText" fullWidth multiline rows={2} disabled={disabled === true} />
            <PlayableText text={spokenText || value} lang={lang} hideText disabled={disabled === true} />
          </Box>
        </HiddenField>
      </FormControl>
    </>
  );
};

export default DraftInput;
