import React from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Alert from '@material-ui/lab/Alert';
import { PlayableTextField } from '../common/components/playable-text';
import DropdownMenu from './list-dropdown-menu';
import ApprovedSwitchField from './approved-switch-field';

const RelatedQuestionsTable = ({
  record,
  relatedQuestions,
  deleteQuestion,
  removeAnswer,
}) => {
  if (!record) {
    return null;
  }

  if ((!record.relatedQuestions || !record.relatedQuestions.length)
    && (!relatedQuestions || !relatedQuestions.length)) {
    return (
      <Alert severity="info">
        There are no related questions
      </Alert>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Text</TableCell>
            <TableCell>Approved</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            (relatedQuestions || record.relatedQuestions).map((related, i) => (
              <TableRow key={i}>
                <TableCell>
                  <PlayableTextField source="text" record={{ ...related, Language: record.Language }} />
                </TableCell>
                <TableCell>
                  <ApprovedSwitchField record={related} />
                </TableCell>
                <TableCell>
                  <DropdownMenu
                    record={{ ...related, Language: record.Language }}
                    deleteQuestion={deleteQuestion}
                    removeAnswer={removeAnswer}
                    hideLinks
                  />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </>
  );
};

export default RelatedQuestionsTable;
