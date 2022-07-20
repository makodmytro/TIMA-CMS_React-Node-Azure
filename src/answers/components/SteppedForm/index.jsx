import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  useTranslate,
  useDataProvider,
  useNotify,
  useRedirect,
} from 'react-admin';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

const style = makeStyles(() => ({
  label: {
    '& text': {
      fill: 'white',
    },
  }
}))
const SteppedForm = ({
  onSubmit,
}) => {
  const classes = style();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [state, setState] = React.useState({
    fk_languageId: null,
    fk_topicId: null,
    questions: [{
      text: '',
    }, {
      text: '',
    }, {
      text: '',
    }],
    text: '',
    spokenText: '',
    tags: '',
  });
  const _languages = useSelector((s) => s.custom.languages);
  const topicsThree = useSelector((s) => s.custom.topicsTree);

  React.useEffect(() => {
    if (topicsThree.length) {
      if (topicsThree.some((t) => t.allowCreateContent)) {
        redirect('/answers');
      }
    }
  }, [topicsThree]);

  React.useEffect(() => {
    if (_languages.length && !state.fk_languageId) {
      setState({
        ...state,
        fk_languageId: _languages[0].id,
      });
    }
  }, [_languages, state.fk_languageId]);

  const back = (values) => {
    setState({
      ...state,
      ...values,
    });
    setStep((s) => s - 1 || 0);
  };

  const onStepOneSubmit = (values) => {
    setState({
      ...state,
      ...values,
    });
    setStep(1);
  };
  const onStepTwoSubmit = (values) => {
    setState({
      ...state,
      ...values,
    });
    setStep(2);
  };

  const createQuestion = async (_data) => {
    try {
      await dataProvider.create('questions', {
        data: _data,
      })
    } catch (e) {} // eslint-disable-line
  };

  const onStepThreeSubmit = async (values) => {
    const merged = {
      ...state,
      ...values,
    };
    setState(merged);
    setLoading(true);

    const {
      fk_languageId, fk_topicId, text, tags, spokenText, questions,
    } = merged;

    try {
      const { data } = await dataProvider.create('answers', {
        data: {
          fk_languageId, fk_topicId, text, tags, spokenText,
        },
      });

      await Promise.all(
        questions.map((q) => createQuestion({
          fk_languageId, fk_topicId, text: q.text, fk_answerId: data.id,
        })),
      );

      setLoading(false);
      notify('The answer was created successfully');
      redirect(`/answers/${data.id}/edit`);
    } catch (e) {
      setLoading(false);
      notify(e?.body?.message, 'error');
    }
  };

  return (
    <>
      <Stepper activeStep={step} orientation="vertical">
        <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('resources.answers.steps.topic')}
          </StepLabel>
          <StepContent>
            <StepOne
              initialValues={{
                fk_languageId: state.fk_languageId,
                fk_topicId: state.fk_topicId,
              }}
              onSubmit={onStepOneSubmit}
            />
          </StepContent>
        </Step>

        <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('resources.answers.steps.questions')}
          </StepLabel>
          <StepContent>
            <StepTwo
              initialValues={{
                questions: state.questions,
                fk_languageId: state.fk_languageId,
                fk_topicId: state.fk_topicId,
              }}
              onSubmit={onStepTwoSubmit}
              onBack={back}
            />
          </StepContent>
        </Step>
        <Step classes={{ root: classes.label }}>
          <StepLabel>
            {translate('resources.answers.steps.answer')}
          </StepLabel>
          <StepContent>
            <StepThree
              initialValues={{
                text: state.text,
                spokenText: state.spokenText,
                tags: state.tags,
              }}
              onSubmit={onStepThreeSubmit}
              onBack={back}
            />
            {
              loading && (
                <Box pt={2} textAlign="center">
                  <CircularProgress color="primary" />
                </Box>
              )
            }
          </StepContent>
        </Step>
      </Stepper>
    </>
  );
};

export default SteppedForm;
