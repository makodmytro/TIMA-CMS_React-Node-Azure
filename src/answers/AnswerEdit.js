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
import { useDisabledDelete, useDisabledEdit } from '../hooks';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_ANSWERS?.split(',') || [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

const CustomToolbar = (props) => {
  const disableEdit = useDisabledEdit(props?.record?.fk_topicId);
  const disableDelete = useDisabledDelete(props?.record?.fk_topicId);

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="ra.action.save"
        submitOnEnter
        disabled={props.pristine || disableEdit}
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
  const disableEdit = useDisabledEdit(answer?.fk_topicId);
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
    <Box pt={2}>
      <CustomTopToolbar />
      <RelatedQuestionsActionsRow record={answer} />
      <Box display="flex">
        <Box flex={1} px={1}>
          <Box height="50%" borderBottom="1px solid gray" borderLeft="1px solid gray" display="flex" alignItems="end" textAlign="right" position="relative">
            <i className="arrow-right" style={{ right: 0, bottom: '-5px' }} />
          </Box>
        </Box>
        <Box flex={20}>
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
        </Box>
      </Box>
      <Box display="flex" pt={1}>
        <Box flex={2} display="flex" height="80px">
          <Box flex={1} borderRight="1px solid gray">
            &nbsp;
          </Box>
          <Box flex={1} borderBottom="1px solid gray" display="flex" alignItems="end" textAlign="right" position="relative">
            <i className="arrow-right" style={{ right: 0, bottom: '-5px' }} />
          </Box>
        </Box>
        <Box flex={6} display="flex" pt={6} pl={2}>
          <Box flex={1}>
            <FollowupQuestionsActionsRow record={answer} />
          </Box>
        </Box>
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
    </Box>
  );
};

export default AnswerEdit;
