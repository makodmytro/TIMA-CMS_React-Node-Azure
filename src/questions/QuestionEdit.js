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
  Toolbar,
  SaveButton,
  DeleteButton,
  useTranslate,
} from 'react-admin';
import { Link } from 'react-router-dom'; // eslint-disable-line
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ReactMarkdown from 'react-markdown';
import TopicSelect from '../topics/components/TopicSelect';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';
import RelatedQuestionsTable from './components/related-questions-table';
import SearchQuestionsAnswers from './search-questions-answers';
import IgnoreButton from './components/ignore-button';
import { useDisabledEdit, useDisabledDelete } from '../hooks';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const CustomToolbar = (props) => {
  const disableEdit = /*useDisabledEdit(props?.record?.fk_topicId) ||*/ props?.record?.allowEdit === false;
  const disableDelete = /*useDisabledDelete(props?.record?.fk_topicId) ||*/ props?.record?.allowEdit === false;

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="ra.action.save"
        submitOnEnter
        disabled={props.pristine || disableEdit}
      />
      <Box flex={1}>
        <IgnoreButton record={props.record} justifyContent="flex-end" disabled={disableEdit} />
      </Box>
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={disableDelete}
      />
    </Toolbar>
  );
};

const Answer = ({
  record, answer, unlinkAnswer, scrollToSearch, disabled,
}) => {
  const translate = useTranslate();

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
        disabled={disabled === true}
      >
        {translate('resources.questions.link')}
      </Button>
    );
  }

  return (
    <Box boxShadow={3} p={1} style={{ backgroundColor: '#e8e8e8' }} borderBottom={1}>
      <Typography variant="body2">
        {translate('misc.answer')}&nbsp;
        <small><Link to={`/answers/${answer.id}`} target="_blank">{translate('misc.view')}</Link></small>
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
          disabled={disabled === true}
        >
          {translate('misc.unlink_answer')}
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
  const translate = useTranslate();
  const notify = useNotify();
  const {
    input: { value: fkLanguageId, onChange: changeLanguage },
  } = useField('fk_languageId');
  const {
    input: { value: fkTopicId, onChange: changeTopic },
  } = useField('fk_topicId');
  const disableEdit = useDisabledEdit(record?.fk_topicId);

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
        title={translate('misc.change_language')}
        content={translate('dialogs.change_language_confirmation')}
        onConfirm={onLanguageChangeConfirm}
        onClose={onLanguageChangeCancel}
        confirm={translate('misc.proceed')}
        cancel={translate('misc.undo_change')}
      />
      <PlayableTextInput
        label="resources.questions.fields.text"
        source="text"
        validate={required()}
        lang={getLang}
        fullWidth
        disabled={disableEdit}
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
        disabled={disableEdit}
      >
        <SelectInput
          optionText="name"
          disabled={disableEdit}
        />
      </ReferenceInput>
      <TopicSelect
        label="resources.questions.fields.fk_topicId"
        source="fk_topicId"
        isRequired
        filter={{ fk_languageId: fkLanguageId }}
        disabled={disableEdit}
      />
      {
        !USE_WORKFLOW && (
          <>
            <BooleanInput label="resources.questions.fields.approved" source="approved" disabled={disableEdit} />
            <BooleanInput label="resources.questions.fields.useAsSuggestion" source="useAsSuggestion" disabled={disableEdit} />
          </>
        )
      }
      <Answer
        {...{
          answer, unlinkAnswer, record, scrollToSearch,
        }}
        disabled={disableEdit}
      />
      <ReferenceInput
        label="resources.questions.fields.fk_parentQuestionId"
        source="fk_parentQuestionId"
        reference="questions"
        filter={{ fk_topicId: fkTopicId }}
        disabled={!fkTopicId}
        fullWidth
        allowEmpty
      >
        <SelectInput optionText="text" emptyText="None" />
      </ReferenceInput>
    </>
  );
};

const QuestionEdit = ({
  dispatch, languages, topics,
  ...props
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();
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
        title={translate('misc.unlink_answer')}
        content={translate('dialogs.unlink_confirmation')}
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
        <SimpleForm toolbar={<CustomToolbar />}>
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
        <Typography>{translate('resources.questions.fields.fk_questionId')}</Typography>
        <Box my={2}>
          <RelatedQuestionsTable
            record={record}
            relatedQuestions={answer ? answer.RelatedQuestions : []}
          />
        </Box>
      </Box>
      <Box my={1} mb={6} p={2} boxShadow={3}>
        <Typography>{translate('misc.search_questions_answers_link')}</Typography>
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
