import React from 'react';
import {
  useTranslate,
  useDataProvider,
  useNotify,
  BooleanField,
} from 'react-admin';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Alert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import AnswerField from '../../../questions/components/AnswerField';
import { PlayableTextField } from '../../../common/components/playable-text';
import DropdownMenu from '../../../questions/components/list-dropdown-menu';
import ApprovedSwitchField from '../../../questions/components/approved-switch-field';
import UseAsSuggestionSwitchField from '../../../questions/components/use-as-suggestion-switch-field';
import { useDisabledApprove } from '../../../hooks';
import useAnswer from '../../useAnswer';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const FollowupQuestionsTable = ({
  record,
}) => {
  const languages = useSelector((state) => state.admin.resources?.languages?.data);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { refresh } = useAnswer();
  const notify = useNotify();
  const disabled = record && record.allowEdit === false;
  const disabledApproved = useDisabledApprove(record?.fk_topicId) || (record && record.allowEdit === false);

  const onDelete = async (id) => {
    await dataProvider.answersRemoveFollowup(null, {
      id: record?.id,
      question_id: id,
    });

    notify('The question was unlinked');
    refresh();
  };

  if (!record || !record.FollowupQuestions || !record.FollowupQuestions.length) {
    return (
      <Alert severity="info">
        {translate('resources.questions.no_followup')}
      </Alert>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{translate('resources.questions.fields.text')}</TableCell>
          {
            !USE_WORKFLOW && (
              <>
                <TableCell>{translate('resources.questions.fields.approved')}</TableCell>
                <TableCell>{translate('resources.questions.use_as_suggestion')}</TableCell>
              </>
            )
          }
          <TableCell>&nbsp;</TableCell>
          <TableCell>{translate('resources.questions.fields.contextOnly')}</TableCell>
          <TableCell>&nbsp;</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          (record.FollowupQuestions || [])
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
                {
                  !USE_WORKFLOW && (
                    <>
                      <TableCell>
                        <ApprovedSwitchField record={related} disabled={disabledApproved} />
                      </TableCell>
                      <TableCell>
                        <UseAsSuggestionSwitchField record={related} disabled={disabled} />
                      </TableCell>
                    </>
                  )
                }
                <TableCell>
                  <AnswerField record={related} afterLink={refresh} noLinkOnlyCreate />
                </TableCell>
                <TableCell>
                  <BooleanField
                    record={{ ...related, isContextOnly: record.isContextOnly }}
                    source="isContextOnly"
                    label={translate('resources.questions.contextOnly')}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu
                    record={{ ...related }}
                    editInline
                    disabled={disabled}
                    onEditCallback={refresh}
                    deleteComponent={(
                      <Button
                        onClick={() => onDelete(related.id)}
                        type="button"
                        size="small"
                        style={{ justifyContent: 'flex-start', color: '#d64242' }}
                        fullWidth
                      >
                        <DeleteIcon style={{ fontSize: '20px' }} /> &nbsp;{translate('misc.delete')}
                      </Button>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))
        }
      </TableBody>
    </Table>
  );
};

export default FollowupQuestionsTable;
