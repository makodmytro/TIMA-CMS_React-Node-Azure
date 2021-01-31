import React from 'react';
import {
  Edit,
  SimpleForm,
  useNotify,
  useDataProvider,
  required,
  ReferenceInput,
  SelectInput,
  BooleanInput,
  useRefresh,
  Confirm,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ReactMarkdown from 'react-markdown';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';
import RelatedQuestionsTable from './related-questions-table';
import SearchQuestionsAnswers from './search-questions-answers';

const Answer = ({
  record, answer, unlinkAnswer, scrollToSearch,
}) => {
  if (!record) {
    return null;
  }

  if (!answer) {
    return (
      <Button
        color="primary"
        variant="outlined"
        type="button"
        size="small"
        onClick={scrollToSearch}
      >
        Link answer
      </Button>
    );
  }

  return (
    <Box boxShadow={3} p={1} style={{ backgroundColor: '#e8e8e8' }} borderBottom={1}>
      <Typography variant="body2">Answer</Typography>
      <ReactMarkdown source={answer.text} />
      <Box textAlign="right">
        <Button
          style={{ borderColor: 'red', color: 'red', textTransform: 'none' }}
          type="button"
          variant="outlined"
          size="small"
          onClick={() => unlinkAnswer(record.id)}
        >
          Unlink
        </Button>
      </Box>
    </Box>
  );
};

const FormFields = ({
  languages,
  record,
  setRecord,
  answer,
  setAnswer,
  scrollToSearch,
  unlinkAnswer,
}) => {
  const dataProvider = useDataProvider();
  const {
    input: { value },
  } = useField('fk_answerId');
  let fetching = false;

  const getLang = () => {
    if (!value || !languages[value]) {
      return null;
    }

    return languages[value].code;
  };

  const fetchAnswer = async () => {
    fetching = true;
    try {
      const { data } = await dataProvider.getOne('answers', {
        id: record.fk_answerId,
      });

      setAnswer(data);
    } catch (err) {
      // console.error(err);
    }
    fetching = false;
  };

  React.useEffect(() => {
    if (record) {
      setRecord(record);

      if (!fetching && record.fk_answerId) {
        fetchAnswer();
        setRecord(record);
      }
    }
  }, [record]);

  return (
    <>
      <PlayableTextInput
        label="resources.questions.fields.text"
        source="text"
        validate={required()}
        lang={getLang}
        fullWidth
      />

      <ReferenceInput
        label="resources.questions.fields.fk_topicId"
        source="fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
        filter={{ fk_languageId: value }}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <BooleanInput source="approved" />
      <Answer
        {...{
          answer, unlinkAnswer, record, scrollToSearch,
        }}
      />
    </>
  );
};

const QuestionEdit = ({ dispatch, languages, ...props }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [answer, setAnswer] = React.useState(null);
  const [record, setRecord] = React.useState(null);
  const ref = React.useRef(null);

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
    setAnswer(null);
  };

  const linkAnswer = async (fk_answerId) => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: { fk_answerId },
      });

      notify('The answer has been linked');
      refresh();
      top();
    } catch (err) {
      notify(`Failed to create new answer for the question: ${err.message}`);

      throw err;
    }
  };

  const scrollToSearch = () => ref.current.scrollIntoView();

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
      <Edit
        {...props}
        actions={<CustomTopToolbar />}
        undoable={false}
      >
        <SimpleForm>
          <FormFields
            {...{
              languages,
              setRecord,
              answer,
              setAnswer,
              scrollToSearch,
              unlinkAnswer: unlinkAnswerClicked,
            }}
          />
        </SimpleForm>
      </Edit>
      <Box my={1} p={2} boxShadow={3}>
        <Typography>Related questions</Typography>
        <Box my={2}>
          <RelatedQuestionsTable
            record={record}
            relatedQuestions={answer ? answer.Questions : []}
          />
        </Box>
      </Box>
      <Box my={1} mb={6} p={2} boxShadow={3}>
        <Typography>Search questions/answers to create link</Typography>
        <SearchQuestionsAnswers
          record={record}
          onSelected={linkAnswer}
        />
        <div ref={ref} />
      </Box>
    </>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : [];

  return {
    languages,
  };
};

export default connect(mapStateToProps)(QuestionEdit);
