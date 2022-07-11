import React from 'react';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
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
import CloseIcon from '@material-ui/icons/Close';

const MetadataValues = ({ data }) => {
  const translate = useTranslate();
  const [open, setOpen] = React.useState(null);

  return (
    <>
      <Typography>
        {translate('import.metadata_value_label')}:
      </Typography>
      {
        data.topQnaPairs.map((value, i) => {
          return (
            <Box key={i}>
              <Typography component="span">
                <b>{value.metadataValue}</b>&nbsp;-&nbsp;
              </Typography>
              <Typography component="span" style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setOpen(i)}>
                {translate('import.metadata_value_view_content')}
              </Typography>
            </Box>
          );
        })
      }
      {
        open !== null && (
          <Dialog open={open !== null} onClose={() => setOpen(null)} size="md" maxWidth>
            <Box textAlign="right" p={2}>
              <IconButton onClick={() => setOpen(null)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box p={2}>
              {
                data.topQnaPairs[open].qnaPairs.map((qna, i) => {
                  return (
                    <Box key={i} boxShadow={3} p={2} mb={1}>
                      <Typography>
                        {
                          qna.questions.map((q, ii) => (<div key={ii}><b>{q}</b></div>))
                        }
                      </Typography>
                      <br />
                      <Typography>
                        {qna.answer}
                      </Typography>
                    </Box>
                  );
                })
              }
            </Box>
          </Dialog>
        )
      }
    </>
  );
};

const StepProcessKBResult = ({
  initialValues,
  analyzeKBResult,
  onBack,
  onSubmit,
}) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [error, setError] = React.useState(null);
  const [selected, setSelected] = React.useState([]);

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

  if (error || !analyzeKBResult) {
    return (
      <Box textAlign="center" p={2}>
        <Alert severity="error" elevation={3}>
          {translate('import.analyze_kb_failed')}
        </Alert>
        <Typography>
          <a href="mailto:support@tamerin.tech?subject=Problems while importing KB">
            {translate('import.analyze_kb_contact_support')}
          </a>
        </Typography>
      </Box>
    );
  }

  if (analyzeKBResult.singleTopic) {
    return (
      <Box>
        <Typography>
          {translate('import.ready_to_process_single_topic')}
        </Typography>
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
      </Box>
    );
  }

  return (
    <Box>
      <Box>
        {
          analyzeKBResult.data.map((data, i) => {
            return (
              <Box key={i} p={2} boxShadow={3} mb={2}>
                <Box textAlign="right">
                  <Checkbox
                    checked={selected.includes(data.key)}
                    value={selected.includes(data.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected((_s) => _s.concat([data.key]));
                      } else {
                        setSelected((_s) => _s.filter((key) => key !== data.key));
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography>
                    {translate('import.metadata_key_label')}: <b>{data.key}</b>
                  </Typography>
                  <MetadataValues data={data} />
                </Box>
              </Box>
            );
          })
        }
        <Box textAlign="right">
          <Button type="button" variant="outlined" color="primary" size="small" onClick={() => onBack()}>
            {translate('misc.back')}
          </Button>
          &nbsp;
          <Button disabled={!selected.length} variant="contained" color="secondary" size="small" onClick={() => onSubmit(selected)}>
            {translate('misc.next')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StepProcessKBResult;
