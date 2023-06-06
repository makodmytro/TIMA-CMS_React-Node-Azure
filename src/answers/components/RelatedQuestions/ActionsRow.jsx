import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import { MuiBulletedTextArea } from 'react-bulleted-textarea';
import { Box, Typography, Accordion, Button, AccordionSummary, AccordionDetails, TextareaAutosize } from '@material-ui/core';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Save as SaveIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import List from './List';
import SearchCreateDialog from './SearchCreateDialog';

const bulletChar = '-';

const ActionsRow = ({ record }) => {
  const translate = useTranslate();
  const [expanded, setExpanded] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [editRawContent, setEditRawContent] = useState(false);
  const disabled = record && record.allowEdit === false;

  const rawContent = (record?.RelatedQuestions || [])
    .filter((r) => {
      if (record.fk_answerId) {
        return r.id !== record.id;
      }

      return true;
    })
    .map((related, i) => related.text);

  const handleTextareaChange = (values) => {
    console.log(values); // [a, b, c]
  };

  if (!record) {
    return null;
  }

  return (
    <Box mb={1} display="flex">
      <Box flex={6}>
        {editRawContent ? (
          <Box boxShadow={3} borderRadius={5} p={2}>
            <MuiBulletedTextArea
              values={rawContent}
              bulletChar={bulletChar}
              onChange={handleTextareaChange}
              style={{ width: '100%', marginBottom: '12px' }}
            />
            <Button type="submit" variant="contained" color="primary">
              <SaveIcon style={{ fontSize: '18px' }} />
              &nbsp; {translate('misc.save')}
            </Button>
          </Box>
        ) : (
          <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
              <Typography>
                {record?.RelatedQuestions?.length || 0} {translate('resources.answers.related_questions')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box flex={1}>
                <List record={record} />
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
      <Box flex={1} pl={2} pt={1} textAlign="center">
        {!editRawContent && (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            type="button"
            onClick={() => {
              setCreateOpen(true);
              setRelatedOpen(true);
            }}
            disabled={disabled}
            fullWidth
          >
            {translate('resources.questions.add_related')}
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          color="secondary"
          type="button"
          style={{ marginTop: '12px', backgroundColor: '#c3170a' }}
          onClick={() => {
            setEditRawContent((editing) => !editing);
          }}
          disabled={disabled}
          fullWidth
        >
          {!editRawContent ? translate('resources.questions.convert_row_intent') : translate('misc.undo_change')}
        </Button>
      </Box>
      <SearchCreateDialog relatedOpen={relatedOpen} record={record} open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
};

export default ActionsRow;
