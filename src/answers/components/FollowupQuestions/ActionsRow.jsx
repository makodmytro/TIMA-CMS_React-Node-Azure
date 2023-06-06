import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import Button from '@material-ui/core/Button';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AccordionDetails } from '@material-ui/core';
import List from './List';
import SearchCreateDialog from './SearchCreateDialog';

const ActionsRow = ({ record }) => {
  const translate = useTranslate();
  const [expanded, setExpanded] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const disabled = record && record.allowEdit === false;

  if (!record) {
    return null;
  }

  return (
    <Box mb={2} display="flex">
      <Box display="flex" flexDirection="column" width="100%">
        <Box flex={1} pb={2} width="150px" textAlign="center">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            type="button"
            onClick={() => setCreateOpen(true)}
            disabled={disabled}
            fullWidth
          >
            {translate('resources.questions.add_followup')}
          </Button>
        </Box>
        <Box flex={6}>
          <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
              <Typography>
                {record.FollowupQuestions?.length || 0} {translate('resources.answers.followup_questions')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box flex={1}>
                <List record={record} />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <SearchCreateDialog record={record} open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
};

export default ActionsRow;
