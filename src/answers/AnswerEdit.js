import React from 'react';
import omit from 'lodash/omit';
import { Form } from 'react-final-form';
import { useParams } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {
  useNotify,
  useDataProvider,
  DeleteButton,
  useTranslate,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import FormFields from './components/form';
import AnswerMedia from './media/media';
import RelatedQuestionsActionsRow from './components/RelatedQuestions/ActionsRow';
import FollowupQuestionsActionsRow from './components/FollowupQuestions/ActionsRow';
import StatusHistory from './components/StatusHistory';
import StatusWarning from './components/StatusWarning';
import StatusInputSection from './components/StatusInput';
import useAnswer from './useAnswer';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS?.split(',') || [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

const AnswerEdit = () => {
  const { id } = useParams();
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { answer, refresh } = useAnswer();

  const disableEdit = (answer && answer.allowEdit === false);
  const disableDelete = (answer && answer.allowEdit === false);

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
      return notify('Failed to update', 'error');
    }
  };

  React.useEffect(() => {
    refresh();
  }, []);

  const updateRelatedQuestions = async (questions, { fk_languageId, fk_topicId }) => {
    let i = 0;

    while (i < questions.length) {
      await dataProvider.update('questions', { // eslint-disable-line
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

  return (
    <>
      <CustomTopToolbar />
      <StatusWarning record={answer} />
      <RelatedQuestionsActionsRow record={answer} />
      <Typography variant="h6" style={{ textTransform: 'uppercase' }}>
        {translate('misc.editing_answer')}
      </Typography>
      <Box boxShadow={3} borderRadius={5}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            ...answer,
          }}
          enableReinitialize
          render={({ handleSubmit, valid }) => {
            return (
              <Box>
                <form onSubmit={handleSubmit}>
                  <Box p={2}>
                    <FormFields edit />
                  </Box>
                  <Box display="flex" p={2} bgcolor="#f5f5f5">
                    <Box flex={1}>
                      <Button type="submit" variant="contained" color="primary" disabled={disableEdit || !valid}>
                        <SaveIcon style={{ fontSize: '18px' }} />&nbsp; {translate('misc.save')}
                      </Button>
                    </Box>
                    <Box flex={1} textAlign="right">
                      <DeleteButton
                        basePath="answers"
                        record={answer}
                        undoable={false}
                        disabled={disableDelete}
                      />
                    </Box>
                  </Box>
                </form>
              </Box>
            );
          }}
        />
      </Box>

      <Box pt={2}>
        <StatusInputSection record={answer} />
      </Box>
      <Box pt={2}>
        <StatusHistory record={answer} />
      </Box>
      <Box pt={2}>
        <FollowupQuestionsActionsRow record={answer} />
      </Box>

      <HiddenField fieldName="media">
        {
          !disableEdit && (
            <Box my={1} p={2} boxShadow={3}>
              <Typography>{translate('resources.answers.media')}</Typography>
              <AnswerMedia answer={answer} />
            </Box>
          )
        }
      </HiddenField>
    </>
  );
};

export default AnswerEdit;
