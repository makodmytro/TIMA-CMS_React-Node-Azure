import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslate, useDataProvider, useNotify, useRedirect } from 'react-admin';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';

const style = makeStyles(() => ({
  label: {
    '& text': {
      fill: 'white',
    },
  },
}));

const SteppedForm = ({ onSubmit }) => {
  const classes = style();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [awaitingSync, setAwaitingSync] = React.useState(false);
  const [awaitingSyncFinished, setAwaitingSyncFinished] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const { search } = useLocation();
  const querystring = new URLSearchParams(search);
  const [state, setState] = React.useState({
    fk_languageId: null,
    fk_parentTopicId:
      querystring.get('fk_parentTopicId') && parseInt(querystring.get('fk_parentTopicId'), 10)
        ? parseInt(querystring.get('fk_parentTopicId'), 10)
        : null,
    name: '',
    kbIntegration: '1',
    qnaMetadataKey: '',
    qnaMetadataValue: '',
    qnaApiEndpoint: '',
    qnaApiVersion: '4',
    qnaSubscriptionKey: '',
    qnaKnowledgeBaseId: '',
    startSync: false,
    fk_managedByGroupId: null,
  });
  const _languages = useSelector((s) => s.custom.languages);

  const f = async () => {
    const { data } = await dataProvider.me();

    if (data && data.Groups) {
      if (data.Groups.length === 1) {
        setState({
          ...state,
          fk_managedByGroupId: data.Groups[0].id,
        });
      } else {
        setGroups(data.Groups);
      }
    }
  };

  React.useEffect(() => {
    f();
  }, []);

  React.useEffect(() => {
    if (_languages.length && !state.fk_languageId) {
      setState({
        ...state,
        fk_languageId: _languages[0].id,
      });
    }
  }, [_languages, state.fk_languageId]);

  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      qnaMetadataValue: prevState.name.toLocaleLowerCase(),
    }));
  }, [state.name]);

  const back = (values) => {
    setState({
      ...state,
      ...values,
    });
    setStep((s) => s - 1 || 0);
  };

  const next = () => setStep((s) => s + 1);

  const onStepSubmit = (values) => {
    setState({
      ...state,
      ...values,
    });
    setStep((s) => s + 1);
  };

  const awaitSync = async (id) => {
    setTimeout(async () => {
      const { data } = await dataProvider.getOne('topics', {
        id,
      });

      if (data && !data.sync) {
        setAwaitingSync(false);
        setAwaitingSyncFinished(id);
      } else {
        awaitSync(id);
      }
    }, 5000);
  };

  const onFinalStepSubmit = async (values) => {
    const data = { ...state, ...values };

    setState(data);
    setLoading(true);

    try {
      const { data: created } = await dataProvider.create('topics', {
        data,
      });

      if (data.startSync) {
        setLoading(false);
        setAwaitingSync(true);
        awaitSync(created.id);
      } else {
        notify('Topic created successfully');
        redirect(`/topics/${created.id}`);
      }
    } catch (err) {
      notify(err?.body?.message || 'Failed to create the topic', 'error');
    }
  };

  if (awaitingSync) {
    return (
      <Box textAlign="center" py={2}>
        <CircularProgress />
        <Typography>{translate('misc.processing')}...</Typography>
      </Box>
    );
  }

  if (awaitingSyncFinished) {
    return (
      <Box textAlign="center" py={2}>
        <Typography>{translate('misc.done')}</Typography>
        <Button variant="outlined" color="primary" size="small" component={Link} to="/topics">
          {translate('misc.back')}
        </Button>
        &nbsp;
        <Button
          variant="contained"
          color="secondary"
          size="small"
          component={Link}
          to={`/answers?filter=${encodeURIComponent(JSON.stringify({ fk_topicId: [awaitingSyncFinished] }))}`}
        >
          {translate('misc.show_answers')}
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Stepper activeStep={step} orientation="vertical">
        <Step classes={{ root: classes.label }}>
          <StepLabel>{translate('resources.topics.steps.basic')}</StepLabel>
          <StepContent>
            <StepOne
              initialValues={{
                fk_languageId: state.fk_languageId,
                name: state.name,
              }}
              onSubmit={onStepSubmit}
            />
          </StepContent>
        </Step>
        {/*
         <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('resources.topics.steps.parent')}
          </StepLabel>
          <StepContent>
            <StepTwo
              initialValues={state}
              onSubmit={onStepSubmit}
              onBack={back}
            />
          </StepContent>
        </Step>*/}
        <Step classes={{ root: classes.label }}>
          <StepLabel>{translate('resources.topics.steps.kb_integration')}</StepLabel>
          <StepContent>
            <StepThree initialValues={{}} onSubmit={next} onBack={back} />
          </StepContent>
        </Step>
        {/*
          groups.length > 1 && (
            <Step classes={{ root: classes.label }}>
              <StepLabel>
                {translate('resources.topics.steps.group')}
              </StepLabel>
              <StepContent>
                <StepFive
                  initialValues={{ fk_managedByGroupId: state.fk_managedByGroupId }}
                  groups={groups}
                  onSubmit={next}
                  onBack={back}
                />
              </StepContent>
            </Step>
          )*/}
        <Step classes={{ root: classes.label }}>
          <StepLabel>{translate('resources.topics.steps.qna')}</StepLabel>
          <StepContent>
            <StepFour initialValues={state} onSubmit={onFinalStepSubmit} onBack={back} />
            {loading && (
              <Box textAlign="center" py={2}>
                <CircularProgress />
              </Box>
            )}
          </StepContent>
        </Step>
      </Stepper>
    </>
  );
};

export default SteppedForm;
