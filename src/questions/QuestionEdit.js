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
  usePermissions,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import { Link } from 'react-router-dom'; // eslint-disable-line
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';
import RelatedQuestionsTable from './related-questions-table';
import SearchQuestionsAnswers from './search-questions-answers';
import IgnoreButton from './ignore-button';

const CustomToolbar = (props) => {
  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="Save"
        submitOnEnter
        disabled={props.pristine || (props.permissions && !props.permissions.allowEdit)}
      />
      <Box flex={1}>
        <IgnoreButton record={props.record} justifyContent="flex-end" />
      </Box>
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={props.permissions && !props.permissions.allowDelete}
      />
    </Toolbar>
  );
};

const Answer = ({
  record, answer, unlinkAnswer, scrollToSearch,
}) => {
  const { permissions } = usePermissions();
  const disabled = permissions && !permissions.allowEdit;

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
        disabled={disabled}
      >
        Link answer
      </Button>
    );
  }

  return (
    <Box boxShadow={3} p={1} style={{ backgroundColor: '#e8e8e8' }} borderBottom={1}>
      <Typography variant="body2">
        Answer&nbsp;
        <small><Link to={`/answers/${answer.id}`} target="_blank">View</Link></small>
      </Typography>
      <ReactMarkdown source={answer.text} />
      <Box textAlign="right">
        <Button
          className="error-btn"
          style={{
            textTransform: 'none',
          }}
          type="button"
          variant="outlined"
          size="small"
          onClick={() => unlinkAnswer(record.id)}
          disabled={disabled}
        >
          Unlink
        </Button>
      </Box>
    </Box>
  );
};

const FormFields = ({
  languages,
  topics,
  record,
  setRecord,
  answer,
  setAnswer,
  scrollToSearch,
  unlinkAnswer,
}) => {
  const [tmpLanguageValue, setTmpLanguageValue] = React.useState(null);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const {
    input: { value: fkLanguageId, onChange: changeLanguage },
  } = useField('fk_languageId');
  const {
    input: { value: fkTopicId, onChange: changeTopic },
  } = useField('fk_topicId');

  let fetching = false;

  const onLanguageChangeConfirm = () => {
    changeLanguage(tmpLanguageValue);

    const current = topics[fkTopicId];
    let first = Object.values(topics).find((t) => {
      return t.fk_languageId === tmpLanguageValue && t.topicKey === current.topicKey;
    });

    if (!first) {
      first = Object.values(topics).find((t) => t.fk_languageId === tmpLanguageValue);
    }

    if (first) {
      changeTopic(first.id);
    }

    setTmpLanguageValue(null);
  };

  const onLanguageChangeCancel = () => {
    setTmpLanguageValue(null);
    changeLanguage(record.fk_languageId);
  };

  const getLang = () => {
    if (!fkLanguageId || !languages[fkLanguageId]) {
      return null;
    }

    return languages[fkLanguageId].code;
  };

  const fetchAnswer = async () => {
    fetching = true;
    try {
      const { data } = await dataProvider.getOne('answers', {
        id: record.fk_answerId,
      });

      setAnswer(data);
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
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
      <Confirm
        isOpen={!!tmpLanguageValue}
        loading={false}
        title="Change language"
        content="Changing a question's language will also have an effect in the topic"
        onConfirm={onLanguageChangeConfirm}
        onClose={onLanguageChangeCancel}
        confirm="Proceed"
        cancel="Undo change"
      />
      <PlayableTextInput
        label="resources.questions.fields.text"
        source="text"
        validate={required()}
        lang={getLang}
        fullWidth
      />
      <ReferenceInput
        label="resources.questions.fields.fk_languageId"
        source="fk_languageId"
        reference="languages"
        validate={required()}
        fullWidth
        inputProps={{
          onChange: (e) => {
            e.preventDefault();
            e.stopPropagation();

            setTmpLanguageValue(e.target.value);
          },
        }}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <ReferenceInput
        label="resources.questions.fields.fk_topicId"
        source="fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
        filter={{ fk_languageId: fkLanguageId }}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <BooleanInput source="approved" />
      <BooleanInput source="useAsSuggestion" />
      <Answer
        {...{
          answer, unlinkAnswer, record, scrollToSearch,
        }}
      />
    </>
  );
};

const QuestionEdit = ({
  dispatch, languages, topics,
  ...props
}) => {
  const { permissions } = usePermissions();
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
        onSuccess={() => {
          notify('The record has been updated');
          refresh();
        }}
      >
        <SimpleForm toolbar={<CustomToolbar permissions={permissions} />}>
          <FormFields
            {...{
              languages,
              topics,
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
        />
        <div ref={ref} />
      </Box>
    </>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : {};

  return {
    languages,
    topics,
  };
};

export default connect(mapStateToProps)(QuestionEdit);
