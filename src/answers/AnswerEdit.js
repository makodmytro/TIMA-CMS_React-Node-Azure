import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {
  Edit,
  SimpleForm,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';
import AnswerMedia from './media/media';
import RelatedQuestionsTable from '../questions/related-questions-table';
import SearchQuestions from './search-questions';
import BatchApproveButton from './batch-approve-button';

const Fields = ({ setRecord, ...props }) => {
  React.useEffect(() => {
    setRecord(props.record);
  }, [props.record]);

  return (
    <Form {...props} edit />
  );
};

const AnswerEdit = (props) => {
  const [answer, setAnswer] = React.useState(null);

  return (
    <>
      <Edit {...props} actions={<CustomTopToolbar />} undoable={false}>
        <SimpleForm>
          <Fields
            setRecord={setAnswer}
          />
        </SimpleForm>
      </Edit>
      <Box my={1} p={2} boxShadow={3}>
        <Typography>Related questions</Typography>
        {
          answer && answer.id && !!answer.Questions.length && (
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
        props.permissions && props.permissions.allowMediaFiles && (
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
