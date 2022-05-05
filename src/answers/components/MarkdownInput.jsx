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
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import draftToMarkdown from 'draftjs-to-markdown';
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
            console.log(convertToRaw(v.getCurrentContent()));

            onChange(draftToMarkdown(convertToRaw(v.getCurrentContent())));
            setState(v);
          }}
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
                '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                '✅', '❎', '💯',
              ]
            }
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

export default DraftInput;
