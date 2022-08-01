import React from 'react';
import {
  useTranslate,
  FunctionField,
  TextField as RATextField,
} from 'react-admin';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Alert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import SubdirectoryArrowRight from '@material-ui/icons/SubdirectoryArrowRight';
import AlertDialog from '../../../common/components/Alert';
import DropdownMenu from '../../../questions/components/list-dropdown-menu';
import ApprovedSwitchField from '../../../questions/components/approved-switch-field';
import UseAsSuggestionSwitchField from '../../../questions/components/use-as-suggestion-switch-field';
import useAnswer from '../../useAnswer';
import { FollowupIcon } from '../TextField';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const styles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: '#D5D5D5',
    },
  },
}));

const RelatedQuestionsTable = ({
  record,
  onUnlinkClick,
}) => {
  const classes = styles();
  const [warning, setWarning] = React.useState(false);
  const languages = useSelector((state) => state.admin.resources?.languages?.data);
  const translate = useTranslate();
  const { refresh } = useAnswer();
  const disabled = record?.allowEdit === false;

  if (!record || !record.RelatedQuestions || !record.RelatedQuestions.length) {
    return (
      <Alert severity="info">
        {translate('resources.questions.no_related')}
      </Alert>
    );
  }

  const onPreUnlinkClick = (id) => {
    const minQuestions = record?.isFollowupChild ? 1 : 3;
    if (record?.RelatedQuestions?.length > minQuestions) {
      return onUnlinkClick(id);
    }

    return setWarning(true);
  };

  const isThereContext = record.RelatedQuestions.some((q) => q.parentAnswers?.length > 0);

  return (
    <>
      <AlertDialog
        open={warning}
        title={translate('resources.answers.related_questions')}
        content={translate('resources.answers.related_questions_no_remove')}
        confirm={translate('misc.close')}
        onClose={() => setWarning(false)}
      />
      <Table>
        <TableHead>
          <TableRow>
            {
              isThereContext && (
                <TableCell>{translate('resources.questions.fields.context')}</TableCell>
              )
            }
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
                  {
                    isThereContext && (
                      <TableCell>
                        <FunctionField
                          record={related}
                          render={() => {
                            // if (!related.fk_parentAnswerId) {
                            //   return (
                            //     <>-</>
                            //   );
                            // }

                            return (
                              <Box key={i} py={1}>
                                { related.parentAnswers.map((pa, idx) => (
                                  <Box key={idx}>
                                    &#8226;&nbsp;
                                    <Typography
                                      component={Link}
                                      to={{ pathname: `/answers/${pa.id}/edit`, key: pa.id, state: { applied: true } }}
                                      onClick={(e) => e.stopPropagation()}
                                      className={classes.link}
                                    >
                                      {pa.text.length > 20 ? `${pa.text.substr(0, 20)}...` : pa.text}
                                    </Typography>
                                  </Box>
                                ))}
                                <Box pl={2}>
                                  <SubdirectoryArrowRight fontSize="small" />
                                  &nbsp;
                                  {
                                    related.isFollowup && <FollowupIcon />
                                  }
                                  <Typography component="span"><b>{related.text}</b></Typography>

                                  {
                                    i === 0 && (
                                      <Box pl={2}>
                                        {
                                          record.FollowupQuestions.map((q, ii) => {
                                            return (
                                              <Box key={ii} pt={0.5} display="flex">
                                                <Box flex={1} pr={1}>
                                                  {
                                                    q.isContextOnly && (
                                                      <Chip
                                                        label={translate('resources.questions.fields.contextOnly')}
                                                        variant="outlined"
                                                        size="small"
                                                        style={{ fontSize: '0.5rem', textTransform: 'uppercase' }}
                                                      />
                                                    )
                                                  }
                                                </Box>
                                                <Box fontSize="0.9rem" lineHeight="14px" flex={4}>
                                                  <SubdirectoryArrowRight fontSize="small" />
                                                  &nbsp;
                                                  <Typography component="span">
                                                    {q.text}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                            );
                                          })
                                        }
                                      </Box>
                                    )
                                  }

                                </Box>
                              </Box>
                            );
                          }}
                        />
                      </TableCell>
                    )
                  }

                  <TableCell>
                    <RATextField record={related} source="text" />
                  </TableCell>
                  {
                    !USE_WORKFLOW && (
                      <>
                        <TableCell>
                          <ApprovedSwitchField record={related} disabled={!related.allowEdit} />
                        </TableCell>
                        <TableCell>
                          <UseAsSuggestionSwitchField record={related} disabled={!related.allowEdit} />
                        </TableCell>
                      </>
                    )
                  }
                  <TableCell>&nbsp;</TableCell>
                  {/*<TableCell>
                    <Button
                      className="error-btn btn-xs"
                      size="small"
                      type="button"
                      variant="outlined"
                      onClick={() => onPreUnlinkClick(related.id)}
                    >
                      {translate('misc.unlink_answer')}
                    </Button>
                  </TableCell>
                */}
                  <TableCell>
                    <DropdownMenu
                      record={{ ...related }}
                      editInline
                      disabled={disabled}
                      disabledDelete={record?.allowDelete === false}
                      deleteComponent={record?.allowDelete ? (
                        <Button
                          onClick={() => onPreUnlinkClick(related.id)}
                          type="button"
                          size="small"
                          style={{ justifyContent: 'flex-start', color: '#d64242' }}
                          disabled={record?.allowDelete === false}
                          fullWidth
                        >
                          <DeleteIcon style={{ fontSize: '20px' }} /> &nbsp;{translate('misc.delete')}
                        </Button>
                      ) : null}
                      onEditCallback={refresh}
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
