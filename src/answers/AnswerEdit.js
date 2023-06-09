import React, { useRef, useState, useEffect } from 'react';
import omit from 'lodash/omit';
import isString from 'lodash/isString';
import { Form } from 'react-final-form';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, CircularProgress, Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import ChatIcon from '@material-ui/icons/Chat';
import { useNotify, useDataProvider, DeleteButton, useTranslate } from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import FormFields from './components/form';
import AnswerMedia from './media/media';
import RelatedQuestionsActionsRow from './components/RelatedQuestions/ActionsRow';
import FollowupQuestionsActionsRow from './components/FollowupQuestions/ActionsRow';
import StatusHistory from './components/StatusHistory';
import StatusWarning from './components/StatusWarning';
import StatusInputSection from './components/StatusInput';
import useAnswer from './useAnswer';
import SummarizeAnswerDialog from './components/SummarizeAnswerDialog';
import IntentEntity from './components/IntentEntity';
import { useIsAdmin } from '../hooks';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS?.split(',') || [];
const SHOW_GPT_SUMMARIZE = process.env.REACT_APP_FEATURE_GPT_SUMMARIZE ?? false;
const SHOW_ANSWER_INTENT = process.env.REACT_APP_SHOW_ANSWER_INTENT ?? false;

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

const useStyles = makeStyles(() => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const AnswerEdit = () => {
  const classes = useStyles();
  const { id } = useParams();
  const isAdmin = useIsAdmin();
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { answer, refresh } = useAnswer();
  const [summarizeOpen, setSummarizeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summarized, setSummarized] = useState('');
  const summarizeRef = useRef('');
  const disableEdit = answer && answer.allowEdit === false;
  const disableDelete = answer && answer.allowDelete === false;

  const onSubmit = async (values) => {
    try {
      const { data } = await dataProvider.update('answers', {
        id,
        data: omit(values, ['RelatedQuestions', 'FollowupQuestions', 'WorkflowChanges', 'AnswerMedia', 'createdAt', 'deletedAt', 'updatedAt']),
      });

      if (data.fk_languageId !== answer.fk_languageId) {
        return updateRelatedQuestions(data.RelatedQuestions, data);
      }

      notify('The answer was updated');
      return refresh();
    } catch (err) {
      return notify(err?.body?.message || 'Failed to update', 'error');
    }
  };

  const summarizeAnswerRequest = async (text) => {
    try {
      setIsLoading(true);
      const { data } = await dataProvider.summarizeAnswer('answers', {
        data: {
          text,
        },
      });
      if (data.summary) {
        summarizeRef.current = data.summary;
        setIsLoading(false);
        setSummarizeOpen(true);
      }
      return data;
    } catch (err) {
      return notify(err?.body?.message || 'Failed to summarize', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  const acceptSummarize = () => {
    setSummarized(summarizeRef.current);
    setSummarizeOpen(false);
    setAnswerFormPristine(false);
  };
  const updateRelatedQuestions = async (questions, { fk_languageId, fk_topicId }) => {
    let i = 0;

    while (i < questions.length) {
      await dataProvider.update('questions', {
        // eslint-disable-line
        id: questions[i].id,
        data: {
          fk_languageId,
          fk_topicId,
        },
      });

      i += 1;
    }

    notify('The answer and its related questions were updated');
    refresh();
  };

  const [answerFormPristine, setAnswerFormPristine] = useState(true);

  const throwIfAnswerFormDirty = () => {
    if (!answerFormPristine) {
      throw new Error(translate('misc.answer_form_pristine_error'));
    }
  };

  return (
    <>
      <CustomTopToolbar />
      <StatusWarning record={answer} />
      {SHOW_ANSWER_INTENT && answer && isAdmin && <IntentEntity record={answer} />}
      <RelatedQuestionsActionsRow record={answer} />
      <Typography variant="h6" style={{ textTransform: 'uppercase' }}>
        {translate('misc.editing_answer')}
      </Typography>
      {true && (
        <Box boxShadow={3} borderRadius={5}>
          <Form
            initialValues={{ ...answer }}
            onSubmit={onSubmit}
            mutators={{
              replaceWithSummarized: (args, state, { changeValue }) => {
                changeValue(state, 'text', () => summarized);
              },
            }}
            enableReinitialize
            render={({ form, handleSubmit, valid, values }) => {
              const pristine = ['fk_languageId', 'fk_topicId', 'spokenText', 'tags', 'text', 'isContextOnly'].every((key) => {
                if (!answer) {
                  return false;
                }
                if (isString(values[key]) && isString(answer[key])) {
                  return values[key].trim() === answer[key].trim();
                }
                return answer && values[key] === answer[key];
              });
              if (pristine !== answerFormPristine) {
                setAnswerFormPristine(pristine);
              }
              return (
                <Box>
                  <form onSubmit={handleSubmit}>
                    <Box p={2}>
                      <FormFields edit record={answer} markdownText={summarized} />
                    </Box>
                    <Box display="flex" p={2} bgcolor="#f5f5f5">
                      <Box flex={1} display="flex">
                        <Button type="submit" variant="contained" color="primary" disabled={pristine || disableEdit || !valid}>
                          <SaveIcon style={{ fontSize: '18px' }} />
                          &nbsp; {translate('misc.save')}
                        </Button>
                        {SHOW_GPT_SUMMARIZE && (
                          <Box position="relative" width="max-content">
                            <Button
                              type="button"
                              variant="contained"
                              color="secondary"
                              style={{ marginLeft: '12px' }}
                              onClick={() => summarizeAnswerRequest(answer.text)}
                              disabled={isLoading}
                            >
                              <ChatIcon style={{ fontSize: '18px' }} />
                              &nbsp; {translate('misc.summarize')}
                            </Button>
                            {isLoading && (
                              <Fade
                                in={isLoading}
                                style={{
                                  transitionDelay: isLoading ? '800ms' : '0ms',
                                }}
                                unmountOnExit
                              >
                                <CircularProgress color="secondary" size={20} className={classes.buttonProgress} />
                              </Fade>
                            )}
                          </Box>
                        )}
                        <SummarizeAnswerDialog
                          text={summarizeRef.current}
                          open={summarizeOpen}
                          onClose={() => {
                            setSummarizeOpen(false);
                            summarizeRef.current = '';
                          }}
                          onSuccess={() => {
                            form.mutators.replaceWithSummarized();
                            acceptSummarize();
                          }}
                        />
                      </Box>
                      <Box flex={1} textAlign="right">
                        <DeleteButton basePath="/answers" record={answer} undoable={false} disabled={disableDelete} />
                      </Box>
                    </Box>
                  </form>
                </Box>
              );
            }}
          />
        </Box>
      )}

      <Box pt={2}>
        <StatusInputSection record={answer} disabled={disableEdit} preSubmitFn={throwIfAnswerFormDirty} />
      </Box>
      <Box pt={2}>
        <StatusHistory record={answer} />
      </Box>
      <Box pt={2}>
        <FollowupQuestionsActionsRow record={answer} />
      </Box>

      <HiddenField fieldName="media">
        {!disableEdit && (
          <Box my={1} p={2} boxShadow={3}>
            <Typography>{translate('resources.answers.media')}</Typography>
            <AnswerMedia answer={answer} />
          </Box>
        )}
      </HiddenField>
    </>
  );
};

export default AnswerEdit;
