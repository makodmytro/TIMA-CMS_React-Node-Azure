import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Form } from 'react-final-form'; // eslint-disable-line
import {
  useDataProvider,
  SelectInput,
  required,
  useNotify,
  useTranslate,
} from 'react-admin';
import { format, sub } from 'date-fns';
import Alert from '@material-ui/lab/Alert';
import SessionCharts from './sessions-charts';
import { DateInput } from '../common/components/datetime-picker';

const Filters = ({ onSubmit, initialValues }) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      validate={(values) => {
        const errors = {};

        ['period', 'from', 'until'].forEach((field) => {
          if (!values[field]) {
            errors[field] = translate('Required');
          }
        });

        return errors;
      }}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3}>
              <SelectInput
                source="period"
                label="Period"
                choices={[
                  { id: 'days', name: translate('Days') },
                  { id: 'weeks', name: translate('Weeks') },
                  { id: 'months', name: translate('Months') },
                ]}
                validate={required()}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <DateInput
                source="from"
                fullWidth
                clearable={false}
                inputVariant="filled"
                label="From"
                disableFuture
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <DateInput
                source="until"
                fullWidth
                clearable={false}
                inputVariant="filled"
                label="To"
                disableFuture
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Box pt={2}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  {translate('misc.search')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
};

const PastSessions = () => {
  const [sessions, setSessions] = React.useState([]);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();

  const initialValues = {
    period: 'days',
    from: format(sub(new Date(), { months: 1 }), 'yyyy-MM-dd'),
    until: format(new Date(), 'yyyy-MM-dd'),
  };

  const fetch = async (params) => {
    try {
      const res = await dataProvider.pastSessions(null, {
        ...params,
        from: format(new Date(params.from), 'yyyy-MM-dd'),
        until: format(new Date(params.until), 'yyyy-MM-dd'),
      });

      if (!res) {
        throw new Error('Unauthenticated');
      }

      const data = res.data.data.sort((a, b) => new Date(a.date) - new Date(b.date));

      setSessions(data);
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  React.useEffect(() => {
    fetch(initialValues);
  }, []);

  return (
    <Box>
      <Box py={2}>
        <Filters onSubmit={fetch} initialValues={initialValues} />
      </Box>
      <Box>
        {
          !!sessions.length && (
            <SessionCharts sessions={sessions} />
          )
        }
        {
          !sessions.length && (
            <Alert severity="info" elevation={3}>
              {translate('resources.sessions.no_results')}
            </Alert>
          )
        }
      </Box>
    </Box>
  );
};

export default PastSessions;
