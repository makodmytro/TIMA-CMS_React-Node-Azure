import React from 'react';
import {
  useTranslate,
} from 'react-admin';
import { useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import ForumTwoTone from '@material-ui/icons/ForumTwoTone';
import { PlayableTextField } from '../../../common/components/playable-text';
import DropdownMenu from '../../../questions/components/list-dropdown-menu';
import ApprovedSwitchField from '../../../questions/components/approved-switch-field';
import UseAsSuggestionSwitchField from '../../../questions/components/use-as-suggestion-switch-field';
import { useDisabledApprove } from '../../../hooks';
import useAnswer from '../../useAnswer';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const RelatedQuestionsTable = ({
  record,
  onUnlinkClick,
}) => {
  const languages = useSelector((state) => state.admin.resources?.languages?.data);
  const translate = useTranslate();
  const { refresh } = useAnswer();
  const disabled = record && record.allowEdit === false;
  const disabledApproved = useDisabledApprove(record?.fk_topicId) || (record && record.allowEdit === false);

  if (!record || !record.RelatedQuestions || !record.RelatedQuestions.length) {
    return (
      <Alert severity="info">
        {translate('resources.questions.no_related')}
      </Alert>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>&nbsp;</TableCell>
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
          <TableCell>&nbsp;</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          (record.RelatedQuestions || [])
            .filter((r) => {
              if (record.fk_answerId) {
                return r.id !== record.id;
              }

              return true;
            })
            .map((related, i) => (
              <TableRow key={i}>
                <TableCell>
                  {
                    !!related.qna_promptDisplayOrder && (
                      <span>
                        <ForumTwoTone fontSize="small" />&nbsp;
                      </span>
                    )
                  }
                </TableCell>
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
                  <Button
                    className="error-btn btn-xs"
                    size="small"
                    type="button"
                    variant="outlined"
                    onClick={() => onUnlinkClick(related.id)}
                    disabled={disabled}
                  >
                    {translate('misc.unlink_answer')}
                  </Button>
                </TableCell>
                <TableCell>
                  <DropdownMenu
                    record={{ ...related }}
                    editInline
                    disabled={disabled}
                    onEditCallback={refresh}
                  />
                </TableCell>
              </TableRow>
            ))
        }
      </TableBody>
    </Table>
  );
};

export default RelatedQuestionsTable;
