import React from 'react';
import { Form } from 'react-final-form';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  useTranslate,
  SelectInput,
  required,
} from 'react-admin';
import Alert from '@material-ui/lab/Alert';

const StepKB = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const translate = useTranslate();
  const [options, setOptions] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const f = async () => {
    let url = initialValues.qnaApiVersion === '4'
      ? `${initialValues.qnaApiEndpoint}/qnamaker/v4.0/knowledgebases`
      : `${initialValues.qnaApiEndpoint}/qnamaker/knowledgebases`;

    fetch(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': initialValues.qnaSubscriptionKey,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          setError(true);
        } else if (r.knowledgebases) {
          setOptions(r.knowledgebases);
        }
      })
      .catch((e) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    f();
  }, []);

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
      initialValues={initialValues}
      render={({
        handleSubmit, valid, values, submitting,
      }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <SelectInput
                source="qnaKnowledgeBaseId"
                label="resources.topics.fields.qnaKnowledgeBaseId"
                choices={options.map((o) => ({
                  name: `${o.name} (${o.language})`,
                  id: o.id,
                }))}
                validate={required()}
                optionText="name"
                optionValue="id"
                margin="dense"
                disabled={!options.length}
                fullWidth
              />
            </Box>
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

export default StepKB;
