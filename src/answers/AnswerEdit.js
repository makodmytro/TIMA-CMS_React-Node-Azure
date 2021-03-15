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
  usePermissions,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';
import AnswerMedia from './media/media';
import RelatedQuestionsTable from '../questions/related-questions-table';
import SearchQuestions from './search-questions';
import BatchApproveButton from './batch-approve-button';

const CustomToolbar = (props) => {
  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="Save"
        submitOnEnter
        disabled={props.pristine || (props.permissions && !props.permissions.allowEdit)}
      />
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={props.permissions && !props.permissions.allowDelete}
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
  const { permissions } = usePermissions();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();
  const [answer, setAnswer] = React.useState(null);
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
      <Edit
        {...props}
        actions={<CustomTopToolbar />}
        undoable={false}
        onSuccess={onSucces}
        mutationMode="pessimistic"
        transform={(data) => {
          return omit(data, ['Questions', 'AnswerMedia', 'createdAt', 'deletedAt', 'updatedAt']);
        }}
      >
        <SimpleForm toolbar={<CustomToolbar permissions={permissions} />}>
          <Fields
            setRecord={setAnswer}
          />
        </SimpleForm>
      </Edit>
      <Box my={1} p={2} boxShadow={3}>
        <Typography>Related questions</Typography>
        {
          answer && answer.id && answer.Questions && !!answer.Questions.length && (
            <Box textAlign="right">
              <BatchApproveButton answerId={answer.id} variant="outlined" />
            </Box>
          )
        }
        <Box my={2}>
          <RelatedQuestionsTable
            record={answer}
            relatedQuestions={answer ? answer.Questions : []}
            answerView
          />
        </Box>
      </Box>
      <Box my={1} p={2} boxShadow={3}>
        <Typography>Search questions to create link</Typography>
        <SearchQuestions
          record={answer}
        />
      </Box>
      {
        permissions && permissions.allowMediaFiles && (
          <Box my={1} p={2} boxShadow={3}>
            <Typography>Media</Typography>
            <AnswerMedia answer={answer} />
          </Box>
        )
      }
    </>
  );
};

export default AnswerEdit;
