import React from 'react';
import omit from 'lodash/omit';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {
  Edit,
  SimpleForm,
  useRefresh,
  useNotify,
  useDataProvider,
  Toolbar,
  SaveButton,
  DeleteButton,
  useTranslate,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './components/form';
import AnswerMedia from './media/media';
import RelatedQuestionsActionsRow from './components/RelatedQuestions/ActionsRow';
import FollowupQuestionsActionsRow from './components/FollowupQuestions/ActionsRow';
import StatusHistory from './components/StatusHistory';
import StatusWarning from './components/StatusWarning';
import { useDisabledDelete, useDisabledEdit } from '../hooks';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS?.split(',') || [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

const CustomToolbar = (props) => {
  const disableEdit = /*useDisabledEdit(props?.record?.fk_topicId) ||*/ props?.record?.allowEdit === false;
  const disableDelete = /*useDisabledDelete(props?.record?.fk_topicId) ||*/ props?.record?.allowEdit === false;

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="ra.action.save"
        submitOnEnter
        disabled={disableEdit}
      />
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={disableDelete}
      />
    </Toolbar>
  );
};

const Fields = ({ setRecord, ...props }) => {
  React.useEffect(() => {
    setRecord(props.record);
  }, [props.record]);

  return (
    <Form {...props} edit />
  );
};

const AnswerEdit = (props) => {
  const translate = useTranslate();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const [answer, setAnswer] = React.useState(null);
  const disableEdit = /*useDisabledEdit(answer?.fk_topicId) ||*/ (answer && answer.allowEdit === false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (!ref.current && answer) {
      ref.current = answer;
    }
  }, [answer]);

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

    ref.current = null;
    notify('The answer and its related questions were updated');
    refresh();
  };

  const onSucces = ({ data }) => {
    if (data.fk_languageId !== ref.current.fk_languageId) {
      return updateRelatedQuestions(data.Questions, data);
    }

    ref.current = null;
    notify('The answer was updated');
    return refresh();
  };

  return (
    <>
      <CustomTopToolbar />
      <StatusWarning record={answer} />
      <RelatedQuestionsActionsRow record={answer} />
      <Edit
        {...props}
        undoable={false}
        onSuccess={onSucces}
        mutationMode="pessimistic"
        transform={(data) => {
          return omit(data, ['Questions', 'AnswerMedia', 'createdAt', 'deletedAt', 'updatedAt']);
        }}
      >
        <SimpleForm toolbar={<CustomToolbar />}>
          <Fields
            setRecord={setAnswer}
          />
        </SimpleForm>
      </Edit>
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
