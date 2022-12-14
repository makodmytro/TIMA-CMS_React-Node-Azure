import React from 'react';
import { Form } from 'react-final-form';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextInput,
  SelectInput,
  useDataProvider,
  useNotify,
  Title,
  useTranslate,
  Link,
  TextField,
} from 'react-admin';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import Typography from '@material-ui/core/Typography';
import { format } from 'date-fns';
import { Dialog, DialogTitle } from '@material-ui/core';

const styles = makeStyles((theme) => ({
  inputContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  date: {
    fontSize: '0.8rem',
    marginRight: '5px',
  },
  followupQuestion: {
    width: 'fit-content',
    marginTop: '10px',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '15px',
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  link: {
    textDecoration: 'underline',
  },
  input: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: '15px',
    padding: theme.spacing(2),
  },
  output: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '15px',
    padding: theme.spacing(2),
    maxWidth: '45%',

  },
  textInput: {
    '&  .MuiFormHelperText-root': {
      display: 'none',
    },
  },
}));

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
  const classes = styles();
  const translate = useTranslate();
  const notify = useNotify();
  const [response, setResponse] = React.useState([]);
  const [questionText, setQuestionText] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  const onSubmit = (values) => {
    setQuestionText((prev) => [...prev, values]);
    setTimeout(async () => {
      setLoading(true);
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

        setResponse((prev) => {
          return [...prev, res.data];
        });
      } catch (err) {
        notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
      }

      setLoading(false);
    }, 500);
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
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
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
              </Grid>
            </form>
          );
        }}
      />
      <Box py={2}>
        <Box p={2}>
          {!!questionText && questionText.map((el, i) => {
            return (
              <Box key={i} my={2}>
                <Box
                  className={classes.inputContainer}
                  mt={1}
                >
                  <div className={classes.input}>
                    <Typography component="span">
                      {el.question}
                    </Typography>
                  </div>
                </Box>
                <Box className={classes.inputContainer}>
                  <Typography variant="body2" component="div" className={classes.date}>
                    {format(el.createdAt, 'yyyy-MM-dd HH:mm')}
                  </Typography>
                </Box>
                {!!response[i] && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box display="flex" flexDirection="column" width="100%">
                      <Box display="flex">
                        <div className={classes.output}>
                          <Typography component="span">
                            {response[i].text}
                          </Typography>

                        </div>
                        <Button onClick={() => setModal(true)}>
                          <InfoIcon />
                        </Button>
                      </Box>
                      <Box display="flex" flexDirection="column">
                        {response[i]?.followupQuestions?.map((followup, index) => {
                          return (
                            <Box key={index} display="flex">
                              <Button
                                className={classes.followupQuestion}
                                onClick={() => {
                                  onSubmit({ createdAt: new Date(), languageId: languages && languages.length ? languages[0].id : '', topicId: '', question: followup.text });
                                }}
                                key={i}
                                component="span"
                              >
                                {index + 1}.{followup.text}?
                              </Button>
                            </Box>
                          );
                        })}
                      </Box>

                    </Box>
                    <Dialog
                      fullWidth
                      open={modal}
                      onClose={() => setModal(false)}
                      aria-label="Show info"
                    >
                      {!loading && (!!response[i]) && (
                        <Box p={2}>
                          <Row label="Score" value={response[i].score} />
                          <Row
                            label={translate('misc.answer_id')}
                            value={
                              !response[i].answerId
                                ? '-'
                                : <Link className={classes.link} to={`/answers/${response[i].answerId}`}>{response[i].answerId}</Link>
                            }
                          />
                          <Row
                            label={translate('misc.question_id')}
                            value={
                              !response[i].questionId
                                ? '-'
                                : <Link className={classes.link} to={`/questions/${response[i].questionId}`}>{response[i].questionId}</Link>
                            }
                          />
                          <Row
                            label={translate('misc.topic_id')}
                            value={
                              !response[i].topicId
                                ? '-'
                                : <Link className={classes.link} to={`/topics/${response[i].topicId}`}>{response[i].topicId}</Link>
                            }
                          />
                          <Row label={translate('misc.request_time_seconds')} value={response[i].requestTimeMs ? response[i].requestTimeMs / 1000 : 0} />
                          {
                            response[i].suggestions && !!response[i].suggestions.length && (
                              <>
                                <Typography variant="h6">{translate('misc.suggestions')}</Typography>
                                {
                                  response[i].suggestions.map((s, index) => (
                                    <Box key={index} boxShadow={3} p={2} mb={2}>
                                      <Row label={translate('misc.answer')} value={s.answer} />
                                      <Row
                                        label="ID"
                                        value={
                                          !s.id || s.id === 'NO_SUGGESTION'
                                            ? '-'
                                            : <Link className={classes.link} to={`/questions/${s.id}`}>{s.id}</Link>
                                        }
                                      />
                                      <Row label={translate('misc.score')} value={s.score} />
                                      <Row label={translate('misc.text')} value={s.text} />
                                      <Row
                                        label={translate('misc.topic_id')}
                                        value={
                                          !s.topicId
                                            ? '-'
                                            : <Link className={classes.link} to={`/topics/${s.topicId}`}>{s.topicId}</Link>
                                        }
                                      />
                                    </Box>
                                  ))
                                }
                              </>
                            )
                          }
                        </Box>
                      )}
                    </Dialog>
                  </Box>
                )}
              </Box>
            );
          })}
          <Form
            onSubmit={onSubmit}
            initialValues={{
              question: '',
              topicId: '',
              createdAt: new Date(),
              languageId: languages && languages.length ? languages[0].id : '',
            }}
            render={({ handleSubmit, valid }) => {
              return (
                <>
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
                      <Grid item xs={10} sm={9} md={11}>
                        <TextInput className={classes.textInput} source="question" label="resources.answers.fields.fk_questionId" margin="dense" fullWidth />
                      </Grid>
                      <Box pt={1.3}>
                        <Button
                          type="submit"
                          disabled={!valid}
                        >
                          <SendIcon />
                        </Button>
                      </Box>
                    </Grid>
                  </form>
                </>
              );
            }}
          />
        </Box>
        {/*<Box py={2}>
        {
          !loading && (!!response) && (
            <Box>
              <Row label={translate('misc.match_found')} value={response[i].matchFound ? translate('misc.yes') : translate('misc.no')} />
              {
                !!response[i].answerId && (
                  <Box display="flex" mb={2} p={2} boxShadow={3}>
                    <Box flex={1}>
                      <TextField record={{ id: response[i].answerId, text: response[i].text, FollowupQuestions: response[i].followupQuestions }} />
                    </Box>
                  </Box>
                )
              }

              <Row label="Score" value={response[i].score} />
              <Row
                label={translate('misc.answer_id')}
                value={
                  !response[i].answerId
                    ? '-'
                    : <Link to={`/answers/${response[i].answerId}`}>{response[i].answerId}</Link>
                }
              />
              <Row
                label={translate('misc.question_id')}
                value={
                  !response[i].questionId
                    ? '-'
                    : <Link to={`/questions/${response[i].questionId}`}>{response[i].questionId}</Link>
                }
              />
              <Row
                label={translate('misc.topic_id')}
                value={
                  !response[i].topicId
                    ? '-'
                    : <Link to={`/topics/${response[i].topicId}`}>{response[i].topicId}</Link>
                }
              />
              <Row label={translate('misc.request_time_seconds')} value={response[i].requestTimeMs ? response[i].requestTimeMs / 1000 : 0} />
              {
                response[i].suggestions && !!response[i].suggestions.length && (
                  <>
                    <Typography variant="h6">{translate('misc.suggestions')}</Typography>
                    {
                      response[i].suggestions.map((s, i) => (
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
                  response[i].flowSteps.map((step, i) => (
                    <Typography key={i} style={{ overflowWrap: 'break-word', display: 'block', wordBreak: 'break-all' }}>{i + 1}. {step}</Typography>
                  ))
                }
              </Box>
            </Box>
          )
        } */}
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  topics: state.custom.topics,
  languages: state.custom.languages,
});

export default connect(mapStateToProps)(TestAsk);