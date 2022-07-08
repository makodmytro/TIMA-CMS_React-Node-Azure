import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  useTranslate,
  useDataProvider,
  useNotify,
  useRedirect,
} from 'react-admin';
import StepKB from './StepKB';
import StepQNAData from './StepQNAData';
import StepFetchKnowledgebases from './StepFetchKnowledgebases';
import StepAnalyzeKB from './StepAnalyzeKB';
import StepProcessKBResult from './StepProcessKBResult';

const style = makeStyles(() => ({
  label: {
    '& text': {
      fill: 'white',
    },
  }
}));

const ImportData = ({
  onSubmit,
}) => {
  const classes = style();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  const [analyzeKBResult, setAnalyzeKBResult] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [awaitingSync, setAwaitingSync] = React.useState(false);
  const [awaitingSyncFinished, setAwaitingSyncFinished] = React.useState(null);
  const [step, setStep] = React.useState(0);
  const history = useHistory();
  const [state, setState] = React.useState({
    kbIntegration: '1',
    qnaApiEndpoint: 'https://qnaeditor-service-1.cognitiveservices.azure.com',
    qnaSubscriptionKey: '8618314189ce4e39872fc12bca40a603',
    qnaKnowledgeBaseId: '',
    qnaApiVersion: '4',
  });

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

  const onKBDataReady = (analyzeResult) => {
    setAnalyzeKBResult(analyzeResult);
    next();
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
        <Button
          variant="outlined"
          color="primary"
          size="small"
          component={Link}
          to="/topics"
        >
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
          <StepLabel>
            {translate('import.step_kb')}
          </StepLabel>
          <StepContent>
            <StepKB
              initialValues={state}
              onSubmit={onStepSubmit}
            />
          </StepContent>
        </Step>
        <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('import.step_qna')}
          </StepLabel>
          <StepContent>
            <StepQNAData
              initialValues={state}
              onSubmit={onStepSubmit}
              onBack={back}
            />
          </StepContent>
        </Step>
        <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('import.step_fetch_knowledgebases')}
          </StepLabel>
          <StepContent>
            <StepFetchKnowledgebases
              initialValues={state}
              onSubmit={onStepSubmit}
              onBack={back}
            />
          </StepContent>
        </Step>
        <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('import.step_analyze_submit')}
          </StepLabel>
          <StepContent>
            <StepAnalyzeKB
              initialValues={state}
              onKBDataReady={onKBDataReady}
              onBack={back}
            />
          </StepContent>
        </Step>
        <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('import.step_process_kb_result')}
          </StepLabel>
          <StepContent>
            <StepProcessKBResult
              initialValues={state}
              analyzeKBResult={analyzeKBResult}
              onBack={back}
            />
          </StepContent>
        </Step>
      </Stepper>
    </>
  );
};

export default ImportData;
