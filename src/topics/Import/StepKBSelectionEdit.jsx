import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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
  const [options, setOptions] = React.useState([]);
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
            };
          });

          return acc.concat(inner);
        }, [])
    );
  }, []);

  const onSubmit = async (values) => {
    console.log(values);
  };

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">
          {translate('import.error_fetching_knowledgebases')}
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
