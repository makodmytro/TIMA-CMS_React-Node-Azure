import React from 'react';
import {
  useDataProvider,
  useRefresh,
  useNotify,
  Confirm,
  usePermissions,
} from 'react-admin';
import { connect } from 'react-redux';
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
import UseAsSuggestionSwitchField from './use-as-suggestion-switch-field';

const RelatedQuestionsTable = ({
  record,
  relatedQuestions,
  answerView,
  languages,
}) => {
  const { permissions } = usePermissions();
  const disabled = permissions && !permissions.allowEdit;

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
            <TableCell>Use as suggestion</TableCell>
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
                    <PlayableTextField
                      source="text"
                      getLanguageFromRecord={(r) => {
                        return languages[r.fk_languageId] ? languages[r.fk_languageId].code : null;
                      }}
                      record={{ ...related }}
                    />
                  </TableCell>
                  <TableCell>
                    <ApprovedSwitchField record={related} disabled={disabled} />
                  </TableCell>
                  <TableCell>
                    <UseAsSuggestionSwitchField record={related} disabled={disabled} />
                  </TableCell>
                  <TableCell>
                    <Button
                      className="error-btn"
                      size="small"
                      type="button"
                      variant="outlined"
                      onClick={() => unlinkAnswerClicked(related.id)}
                      disabled={disabled}
                    >
                      Unlink answer
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu
                      record={{ ...related }}
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

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  return { languages };
};

export default connect(mapStateToProps)(RelatedQuestionsTable);
