import React from 'react';
import {
  useDataProvider,
  useRefresh,
  useNotify,
  Confirm,
} from 'react-admin';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { PlayableTextField } from '../common/components/playable-text';
import DropdownMenu from './list-dropdown-menu';
import ApprovedSwitchField from './approved-switch-field';

const RelatedQuestionsTable = ({
  record,
  relatedQuestions,
  answerView,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [confirmations, setConfirmations] = React.useState({
    id: null,
    unlink: false,
  });

  const top = () => window.scrollTo(0, 0);

  const unlinkAnswerClicked = (id) => {
    setConfirmations({
      ...confirmations,
      unlink: true,
      id,
    });
  };

  const unlinkAnswerClosed = () => {
    setConfirmations({
      ...confirmations,
      unlink: false,
      id: null,
    });
  };

  const unlinkAnswerConfirmed = async () => {
    await dataProvider.update('questions', {
      id: confirmations.id,
      data: { fk_answerId: null },
    });

    unlinkAnswerClosed();
    notify('The answer has been unlinked');
    refresh();
    top();
  };

  if (!record) {
    return null;
  }

  if (!relatedQuestions || (!answerView && relatedQuestions.length - 1 === 0)
    || !relatedQuestions.length) {
    return (
      <Alert severity="info">
        There are no related questions
      </Alert>
    );
  }

  return (
    <>
      <Confirm
        isOpen={confirmations.unlink}
        loading={false}
        title="Unlink answer"
        content="Are you sure you want to unlink the answer from the question?"
        onConfirm={unlinkAnswerConfirmed}
        onClose={unlinkAnswerClosed}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Text</TableCell>
            <TableCell>Approved</TableCell>
            <TableCell>&nbsp;</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            relatedQuestions
              .filter((r) => {
                if (record.fk_answerId) {
                  return r.id !== record.id;
                }

                return true;
              })
              .map((related, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <PlayableTextField source="text" record={{ ...related, Language: record.Language }} />
                  </TableCell>
                  <TableCell>
                    <ApprovedSwitchField record={related} />
                  </TableCell>
                  <TableCell>
                    <Button
                      style={{ borderColor: 'red', color: 'red ' }}
                      size="small"
                      type="button"
                      variant="outlined"
                      onClick={() => unlinkAnswerClicked(related.id)}
                    >
                      Unlink answer
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu
                      record={{ ...related, Language: record.Language }}
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
