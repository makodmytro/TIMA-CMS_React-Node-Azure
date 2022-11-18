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
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToMarkdown } from 'draft-js-export-markdown';
import createImagePlugin from '@draft-js-plugins/image'; // eslint-disable-line
// import editorStyles from './editorStyles.module.css';
import htmlToDraft from 'html-to-draftjs';
import markdown2Html from '@deskeen/markdown';
import PlayableText from '../../common/components/playable-text';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS?.split(',') || [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

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
      //there are some markdown to draftjs converters, but they don't work well, either strikethrough is not working, or image is missing
      //we are using the following approach to convert markdown to draftjs with all features: md->html->update tags->draftjs

      //adapt markdown value to the parser, replace _ by * for italic
      const fixedValue = value.replace(/_/g, '*');
      const html = markdown2Html.parse(fixedValue).innerHTML;
      //remove figure elements, replace <s> with <del>
      const fixedHtml = html.replace(/<figure.*?>(.*?)<\/figure>/g, '$1').replace(/<s>/g, '<del>').replace(/<\/s>/g, '</del>');
      const blocksFromHtml = htmlToDraft(fixedHtml);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

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
            onChange(stateToMarkdown(v.getCurrentContent()));
            setState(v);
          }}
          plugins={plugins}
          onBlur={() => onBlur()}
          disabled={disabled === true}
          readOnly={disabled === true}
          wrapperClassName={disabled === true ? 'disabled-markdown-editor' : ''}
          toolbar={{
            options: ['inline', 'blockType', 'link', 'emoji', 'history', 'list', 'image'],
            inline: {
              options: ['bold', 'italic', 'strikethrough'],
            },
            emoji: {
              emojis: [
                '😀', '😉', '😎', '😮', '🙁', '👋', '👌', '👍', '👎',
              ],
            },
            image: {
              uploadEnabled: false,
              previewImage: true,
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

export default DraftInput;
