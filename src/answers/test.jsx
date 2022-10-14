import React from 'react';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  TextInput,
  SelectInput,
  useDataProvider,
  useNotify,
  Title,
  useTranslate,
} from 'react-admin';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from './components/TextField';

const Row = ({ label, value }) => (
  <Box display="flex" pb={1} mb={2} style={{ borderBottom: '1px solid #00000042' }}>
    <Box flex={1}>
      <Typography component="div">{label}</Typography>
    </Box>
    <Box flex={1}>
      <Typography component="div" align="right">{value}</Typography>
    </Box>
  </Box>
);

const TestAsk = ({ languages, topics }) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    setResponse(null);

    try {
      const lang = languages.find((l) => l.id === values.languageId);

      let res = await dataProvider.startSession(null, {
        data: {
          topicId: values.topicId,
          language: lang.code,
          isTest: true,
          silentMode: true,
        },
      });

      const { accessToken } = res.data;

      res = await dataProvider.ask(null, {
        data: {
          token: accessToken,
          text: values.question,
        },
      });

      setResponse(res.data);
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }

    setLoading(false);
  };

  return (
    <Box p={2} boxShadow={3}>
      <Title title={translate('misc.test_ask')} />
      <Form
        onSubmit={onSubmit}
        initialValues={{
          question: '',
          topicId: '',
          languageId: languages && languages.length ? languages[0].id : '',
        }}
        validate={(values) => {
          const errors = {};

          //TODO - only if using multi level topics
          //also fix the section for topics selection (multie level) and make it optional
          ['question', /*'topicId',*/ 'languageId'].forEach((field) => {
            if (!values[field]) {
              errors[field] = translate('Required');
            }
          });

          return errors;
        }}
        render={({ handleSubmit, valid }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                {
                  languages && languages.length > 1 && (
                    <Grid item xs={12} sm={6} md={2}>
                      <SelectInput
                        source="languageId"
                        label="resources.answers.fields.fk_languageId"
                        choices={languages}
                        optionText="name"
                        optionValue="id"
                        margin="dense"
                        fullWidth
                      />
                    </Grid>
                  )
                }
                <Grid item xs={12} sm={6} md={2}>
                  <SelectInput
                    source="topicId"
                    label="resources.answers.fields.fk_topicId"
                    choices={topics.filter((t) => !t.fk_parentTopicId)}
                    optionText="name"
                    optionValue="id"
                    margin="dense"
                    allowEmpty
                    emptyText={translate('misc.none')}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={5}>
                  <TextInput source="question" label="resources.answers.fields.fk_questionId" margin="dense" fullWidth />
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                  <Box pt={1.3}>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      disabled={!valid}
                      fullWidth
                      size="large"
                    >
                      {translate('misc.test')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          );
        }}
      />
      <Box py={2}>
        {
          loading && (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          )
        }
        {
          !loading && (!!response) && (
            <Box>
              <Row label={translate('misc.match_found')} value={response.matchFound ? translate('misc.yes') : translate('misc.no')} />
              {
                !!response.answerId && (
                  <Box display="flex" mb={2} p={2} boxShadow={3}>
                    <Box flex={1}>
                      <TextField record={{ id: response.answerId, text: response.text, FollowupQuestions: response.followupQuestions }} />
                    </Box>
                  </Box>
                )
              }

              <Row label="Score" value={response.score} />
              <Row
                label={translate('misc.answer_id')}
                value={
                  !response.answerId
                    ? '-'
                    : <Link to={`/answers/${response.answerId}`}>{response.answerId}</Link>
                }
              />
              <Row
                label={translate('misc.question_id')}
                value={
                  !response.questionId
                    ? '-'
                    : <Link to={`/questions/${response.questionId}`}>{response.questionId}</Link>
                }
              />
              <Row
                label={translate('misc.topic_id')}
                value={
                  !response.topicId
                    ? '-'
                    : <Link to={`/topics/${response.topicId}`}>{response.topicId}</Link>
                }
              />
              <Row label={translate('misc.request_time_seconds')} value={response.requestTimeMs ? response.requestTimeMs / 1000 : 0} />
              {
                response.suggestions && !!response.suggestions.length && (
                  <>
                    <Typography variant="h6">{translate('misc.suggestions')}</Typography>
                    {
                      response.suggestions.map((s, i) => (
                        <Box key={i} boxShadow={3} p={2} mb={2}>
                          <Row label={translate('misc.answer')} value={s.answer} />
                          <Row
                            label="ID"
                            value={
                              !s.id || s.id === 'NO_SUGGESTION'
                                ? '-'
                                : <Link to={`/questions/${s.id}`}>{s.id}</Link>
                            }
                          />
                          <Row label={translate('misc.score')} value={s.score} />
                          <Row label={translate('misc.text')} value={s.text} />
                          <Row
                            label={translate('misc.topic_id')}
                            value={
                              !s.topicId
                                ? '-'
                                : <Link to={`/topics/${s.topicId}`}>{s.topicId}</Link>
                            }
                          />
                        </Box>
                      ))
                    }
                  </>
                )
              }
              <Typography variant="h6">{translate('misc.steps')}</Typography>
              <Box boxShadow={3} p={2} mb={2}>
                {
                  response.flowSteps.map((step, i) => (
                    <Typography key={i} style={{ overflowWrap: 'break-word', display: 'block', wordBreak: 'break-all' }}>{i + 1}. {step}</Typography>
                  ))
                }
              </Box>
            </Box>
          )
        }
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  topics: state.custom.topics,
  languages: state.custom.languages,
});

export default connect(mapStateToProps)(TestAsk);
