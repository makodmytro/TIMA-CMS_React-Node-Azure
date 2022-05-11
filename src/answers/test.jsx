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

const TestAsk = ({ languages }) => {
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
      <Title title="Test ask" />
      <Form
        onSubmit={onSubmit}
        initialValues={{
          question: '',
          topicId: '',
          languageId: '',
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
              <Row label="Match found" value={response.matchFound ? 'Yes' : 'No'} />
              <Row label="Score" value={response.score} />
              <Row
                label="Answer ID"
                value={
                  !response.answerId
                    ? '-'
                    : <Link to={`/answers/${response.answerId}`} target="_blank">{response.answerId}</Link>
                }
              />
              <Row
                label="Question ID"
                value={
                  !response.questionId
                    ? '-'
                    : <Link to={`/questions/${response.questionId}`} target="_blank">{response.questionId}</Link>
                }
              />
              <Row
                label="Topic ID"
                value={
                  !response.topicId
                    ? '-'
                    : <Link to={`/topics/${response.topicId}`} target="_blank">{response.topicId}</Link>
                }
              />
              <Row label="Request time (seconds)" value={response.requestTimeMs ? response.requestTimeMs / 1000 : 0} />
              <Row label="Text" value={response.text} />
              {
                response.suggestions && !!response.suggestions.length && (
                  <>
                    <Typography variant="h6">Suggestions</Typography>
                    {
                      response.suggestions.map((s, i) => (
                        <Box key={i} boxShadow={3} p={2} mb={2}>
                          <Row label="Answer" value={s.answer} />
                          <Row
                            label="ID"
                            value={
                              !s.id || s.id === 'NO_SUGGESTION'
                                ? '-'
                                : <Link to={`/questions/${s.id}`} target="_blank">{s.id}</Link>
                            }
                          />
                          <Row label="Score" value={s.score} />
                          <Row label="Text" value={s.text} />
                          <Row
                            label="Topic ID"
                            value={
                              !s.topicId
                                ? '-'
                                : <Link to={`/topics/${s.topicId}`} target="_blank">{s.topicId}</Link>
                            }
                          />
                        </Box>
                      ))
                    }
                  </>
                )
              }
              <Typography variant="h6">Steps</Typography>
              <Box boxShadow={3} p={2} mb={2}>
                {
                  response.flowSteps.map((step, i) => (
                    <Typography key={i}>{i + 1}. {step}</Typography>
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
