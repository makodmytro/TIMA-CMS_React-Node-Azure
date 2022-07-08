import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  useTranslate,
  useNotify,
  useDataProvider,
} from 'react-admin';
import Alert from '@material-ui/lab/Alert';

const StepAnalyzeKB = ({
  initialValues,
  onKBDataReady,
}) => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [error, setError] = React.useState(null);
  const [jobId, setJobId] = React.useState(null);
  const [analyzing, setAnalyzing] = React.useState(false);

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
        onKBDataReady(data);
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
            {translate('import.analyze_kb_contact_support')}
          </a>
        </Typography>
      </Box>
    );
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

export default StepAnalyzeKB;
