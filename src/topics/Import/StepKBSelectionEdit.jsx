import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import arrayMutators from 'final-form-arrays'; // eslint-disable-line
import {
  useTranslate,
  SelectInput,
  required,
  TextInput,
  useDataProvider,
  useRedirect,
  useNotify,
} from 'react-admin';
import Alert from '@material-ui/lab/Alert';

const StepKBSelectionEdit = ({
  selectedKBKeys,
  analyzeKBResult,
  initialValues,
  onBack,
}) => {
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const [jobId, setJobId] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [topics, setTopics] = React.useState([]);

  React.useEffect(() => {
    setTopics(
      analyzeKBResult.data
        .filter((d) => selectedKBKeys.includes(d.key))
        .reduce((acc, d) => {
          const inner = d.values.map((v) => {
            return {
              qnaMetadataKey: d.key,
              qnaMetadataValue: v,
              ...initialValues,
              name: d.key,
              startSync: true,
            };
          });

          return acc.concat(inner);
        }, [])
    );
  }, []);

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
        notify('Topics imported successfully');
        redirect('/topics');
      }
    }, 5000);
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const { data } = await dataProvider.bulkCreateTopic(null, {
        data: values.topics,
      });

      if (!data.jobId) {
        setError(true);
      } else {
        setJobId(data.jobId);
        awaitJobID(data.jobId);
      }
    } catch (err) {
      notify(err?.body?.message || 'Failed to create the topic', 'error');
      setError(true);
      setLoading(false);
    }
  };

  if (error) {
    if (jobId) {
      if (error) {
        return (
          <Box textAlign="center" p={2}>
            <Alert severity="error" elevation={3}>
              {translate('import.create_bulk_topics_failed')}
            </Alert>
            <Typography>
              <a href={`mailto:support@tamerin.tech?subject=Problems while importing KB ${jobId}`}>
                {translate('import.create_bulk_topics_failed_contact_support')}
              </a>
            </Typography>
          </Box>
        );
      }
    }

    return (
      <Box p={2}>
        <Alert severity="error">
          {translate('import.create_bulk_topics_failed')}
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={2} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        topics,
      }}
      mutators={{
        ...arrayMutators
      }}
      render={({
        handleSubmit, valid, values, submitting,
      }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            {
              topics.map((topic, i) => {
                return (
                  <Box key={i} boxShadow={3} p={2} mb={2}>
                    <TextInput source={`topics.${i}.qnaMetadataKey`} label="resources.topics.fields.qnaMetadataKey" disabled fullWidth />
                    <TextInput source={`topics.${i}.qnaMetadataValue`} label="resources.topics.fields.qnaMetadataValue" disabled fullWidth />
                    <TextInput source={`topics.${i}.name`} label="resources.topics.fields.name" fullWidth />
                  </Box>
                );
              })
            }
            <Box textAlign="right">
              <Button type="button" variant="outlined" color="primary" size="small" onClick={() => onBack(values)}>
                {translate('misc.back')}
              </Button>
              &nbsp;
              <Button
                type="submit"
                disabled={!valid || submitting}
                variant="contained"
                color="secondary"
                size="small"
              >
                {translate('misc.next')}
              </Button>
            </Box>
          </form>
        );
      }}
    />
  );
};

export default StepKBSelectionEdit;
