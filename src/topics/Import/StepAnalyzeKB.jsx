import React from 'react';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  useTranslate,
  useNotify,
  useRedirect,
  useDataProvider,
  SelectInput,
  required,
  TextInput,
  BooleanInput,
} from 'react-admin';
import Alert from '@material-ui/lab/Alert';

const StepKB = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [jobId, setJobId] = React.useState(null);
  const [analyzing, setAnalyzing] = React.useState(false);

  const onSingleTopicSubmit = async (values) => {
    try {
      await dataProvider.create('topics', {
        data: {
          ...initialValues,
          ...values,
        },
      });

      notify('Topic created successfully');
      redirect('/topics');
    } catch (err) {
      setError(true);
    }
  };

  const awaitJobID = async (id) => {
    setTimeout(async () => {
      const { data } = await dataProvider.jobStatus(null, {
        jobId: id,
      });

      if (data?.status === 1 || data?.status === 0) {
        awaitJobID(id);
      } else if (data?.status === 3 || data?.status === 4 || data?.status === 5) {
        setError(true);
      } else if (data?.status === 2) {
        setAnalyzing(false);
        setResult({ singleTopic: true });
      }
    }, 5000);
  };

  const analizeKB = async () => {
    try {
      setAnalyzing(true);

      const { data } = await dataProvider.analizeKB(null, {
        data: initialValues,
      });

      if (!data.jobId) {
        throw new Error('FAILED');
      } else {
        setJobId(data.jobId);
        awaitJobID(data.jobId);
      }
    } catch (err) {
      notify('Unexpected error', 'error');
      setError(true);
      setAnalyzing(false);
    }
  };

  if (error) {
    return (
      <Box textAlign="center" p={2}>
        <Alert severity="error" elevation={3}>
          {translate('import.analyze_kb_failed')}
        </Alert>
        <Typography>
          <a href={`mailto:support@tamerin.tech?subject=Problems while importing KB ${jobId}`}>
            {translate('import_analyze_kb_contact_support')}
          </a>
        </Typography>
      </Box>
    );
  }

  if (!analyzing && !!result) {
    if (result.singleTopic) {
      return (
        <Form
          onSubmit={onSingleTopicSubmit}
          initialValues={{
            name: '',
            startSync: true,
          }}
          render={({ handleSubmit, submitting, values, valid }) => {
            return (
              <form onSubmit={handleSubmit} autoComplete="off">
                <Box>
                  <TextInput
                    source="name"
                    label="resources.topics.fields.name"
                    fullWidth
                    validate={required()}
                  />
                  <BooleanInput source="startSync" label="resources.topics.fields.startSync" />
                </Box>
                <Box textAlign="right">
                  <Button type="button" variant="outlined" color="primary" size="small" onClick={() => onBack(values)}>
                    {translate('misc.back')}
                  </Button>
                  &nbsp;
                  <Button type="submit" disabled={!valid || submitting} variant="contained" color="secondary" size="small">
                    {translate('misc.next')}
                  </Button>
                </Box>
              </form>
            );
          }}
        />
      )
    }
  }

  return (
    <Box textAlign="center">
      {
        !analyzing && (
          <Button onClick={analizeKB} variant="contained" color="primary">
            {translate('import.step_analyze_submit_button')}
          </Button>
        )
      }
      {
        analyzing && (
          <Box>
            <Typography>
              {translate('import.analyzing_kb')}
            </Typography>
            <Box p={2}>
              <CircularProgress />
            </Box>
            <Button component={Link} to="/topics" variant="outlined">
              {translate('misc.cancel')}
            </Button>
          </Box>
        )
      }
    </Box>
  );
};

export default StepKB;
