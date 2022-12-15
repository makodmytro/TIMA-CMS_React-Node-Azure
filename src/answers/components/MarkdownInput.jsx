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
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter'; // eslint-disable-line
import createImagePlugin from '@draft-js-plugins/image'; // eslint-disable-line
// import editorStyles from './editorStyles.module.css';
import { marked } from 'marked';
import draftToHtml from 'draftjs-to-html';
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown';
import htmlToDraft from 'html-to-draftjs';

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
      const fixedValue = value.replace(/\n\s*\n/g, '\n') //remove double line breaks
        .replace(/(?<!\]\()(https?:\/\/[^\s]+)(?=\))/g, (match) => match.replace(/_/g, '*')) //replace underscores with asterisks just if it's not part of a link
        .replace(/alt="undefined"/g, ''); //remove alt="undefined" from images

      /*const rawData = mdToDraftjs(fixedValue);
      const contentState = convertFromRaw(rawData);*/

      const html = marked.parse(fixedValue);
      const blocksFromHtml = htmlToDraft(html);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setState(EditorState.createWithContent(contentState));
    }
  }, [value]);

  const convertDraftJsStateToMarkdown = (contentState) => {
    //return stateToMarkdown(contentState);
    const rawContentState = convertToRaw(contentState);

    const convertedHTML = draftToHtml(rawContentState);
    const mdFromHtml = NodeHtmlMarkdown.translate(convertedHTML, { bulletMarker: '-', keepDataImages: false });

    return mdFromHtml;
  };

  return (
    <>
      <InputLabel error={invalid}>{translate(label)}</InputLabel>
      <FormControl fullWidth error={invalid}>
        <Editor
          editorState={state}
          onEditorStateChange={(v) => {
            onChange(convertDraftJsStateToMarkdown(v.getCurrentContent()));
            setState(v);
          }}
          plugins={plugins}
          onBlur={() => onBlur()}
          disabled={disabled === true}
          readOnly={disabled === true}
          wrapperClassName={disabled === true ? 'disabled-markdown-editor' : ''}
          toolbar={{
            options: ['inline', 'blockType', 'link', 'emoji', 'history', 'image'],
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
              previewImage: false,
              alignmentEnabled: false,
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
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