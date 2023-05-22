import React, { useEffect } from 'react';
import { TextInput, useTranslate, required } from 'react-admin';
import { useField } from 'react-final-form';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import createImagePlugin from '@draft-js-plugins/image';
import { marked } from 'marked';
import draftToHtml from 'draftjs-to-html';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import htmlToDraft from 'html-to-draftjs';
import Button from '@material-ui/core/Button';

import PlayableText from '../../common/components/playable-text';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS?.split(',') || [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

const imagePlugin = createImagePlugin();

const DraftInput = ({ source, label, lang, disabled, initialText = '' }) => {
  const translate = useTranslate();
  const [state, setState] = React.useState(EditorState.createEmpty());
  const {
    input: { value: spokenText, onBlur },
  } = useField('spokenText');
  const {
    input: { onChange, value },
    meta: { touched, dirty, error, submitFailed },
  } = useField(source, { validate: required() });
  const invalid = !!error && (touched || dirty || submitFailed);

  useEffect(() => {
    if (value && !touched && !dirty) {
      const fixedValue = value
        .replace(/\n\s*\n/g, '\n') //remove double line breaks
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
    const mdFromHtml = NodeHtmlMarkdown.translate(convertedHTML, {
      bulletMarker: '-',
      keepDataImages: false,
      emDelimiter: '*',
      strongDelimiter: '**',
    });

    return mdFromHtml;
  };

  useEffect(() => {
    if (initialText !== '') {
      setState(EditorState.createWithContent(ContentState.createFromText(initialText)));
      onChange(initialText);
    }
  }, [initialText]);

  return (
    <>
      <style jsx global>
        {`
          img {
            max-width: 100%;
          }
        `}
      </style>

      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <InputLabel error={invalid}>{translate(label)}</InputLabel>
        <Button onClick={() => setState(EditorState.createEmpty())} disabled={disabled === true}>
          {translate('misc.clear')}
        </Button>
      </Box>
      <FormControl fullWidth error={invalid} style={{ img: { maxWidth: '100%' } }}>
        <Editor
          editorState={state}
          onEditorStateChange={(v) => {
            onChange(convertDraftJsStateToMarkdown(v.getCurrentContent()));
            setState(v);
          }}
          plugins={[imagePlugin]}
          onBlur={() => onBlur()}
          disabled={disabled === true}
          readOnly={disabled === true}
          wrapperClassName={disabled === true ? 'disabled-markdown-editor' : ''}
          toolbar={{
            options: ['inline', 'blockType', 'link', 'emoji', 'history', 'image', 'list'],
            inline: {
              options: ['bold', 'italic', 'strikethrough'],
            },
            emoji: {
              emojis: ['😀', '😉', '😎', '😮', '🙁', '👋', '👌', '👍', '👎'],
            },
            image: {
              uploadEnabled: false,
              previewImage: true,
              alignmentEnabled: true,
              alt: { present: false, mandatory: false },
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            },
          }}
        />
        <HiddenField fieldName="spokenText">
          <Box p={1} textAlign="right" style={{ border: '1px solid #e0e0e0', borderTop: 'none' }}>
            <TextInput
              source="spokenText"
              label="resources.answers.fields.spokenText"
              fullWidth
              multiline
              rows={2}
              disabled={disabled === true}
            />
            <PlayableText text={spokenText || value} lang={lang} hideText disabled={disabled === true} />
          </Box>
        </HiddenField>
      </FormControl>
    </>
  );
};

export default DraftInput;
