import React from 'react';
import { useTranslate, TextField } from 'react-admin';
import {
  Typography,
  Box,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditableIntentEntityField from '../EditableIntentEntityField';

const IntentEntity = ({ record }) => {
  const translate = useTranslate();

  return (
    <Box width="100%" my={2}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>{translate('resources.answers.intent_entity.text')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box width="100%" flex={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{translate('resources.answers.intent_entity.intent')}</TableCell>
                  <TableCell>{translate('resources.answers.intent_entity.entity')}</TableCell>
                  <TableCell>{translate('resources.answers.intent_entity.answerId')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <EditableIntentEntityField record={record}>
                      <span>Beantragung von</span>
                    </EditableIntentEntityField>
                  </TableCell>
                  <TableCell>
                    <EditableIntentEntityField record={record}>
                      <span>HR_Elterngeld</span>
                    </EditableIntentEntityField>
                  </TableCell>
                  <TableCell>
                    <TextField record={record} source="id" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default IntentEntity;
