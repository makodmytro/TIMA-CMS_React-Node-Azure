import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import { Form } from 'react-final-form'; // eslint-disable-line
import {
  useDataProvider,
  useNotify,
  SelectInput,
  ReferenceInput,
} from 'react-admin';
import Alert from '@material-ui/lab/Alert';

const Filters = ({ onSubmit, initialValues }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={initialValues}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <ReferenceInput label="Language" source="fk_languageId" reference="languages" fullWidth allowEmpty>
              <SelectInput optionText="name" allowEmpty emptyText="None" />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box pt={2}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    )}
  />
);

const PastSessions = () => {
  const [form, setForm] = React.useState({
    fk_languageId: null,
  });
  const [pagination, setPagination] = React.useState({
    perPage: 5,
    page: 1,
  });
  const [count, setCount] = React.useState(0);
  const [topics, setTopics] = React.useState([]);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const fetch = async (params, paging = pagination) => {
    try {
      setForm(params);
      const res = await dataProvider.topicStats(null, {
        filters: params,
        pagination: paging,
      });

      if (!res) {
        throw new Error('Unauthenticated');
      }

      const { data, total } = res.data;

      setTopics(data);
      setCount(total);
    } catch (err) {
      console.error(`Failed to fetch past sessions: ${err.message}`);
    }
  };

  const setPage = (page, submit = true) => {
    setPagination({
      ...pagination,
      page: page + 1,
    });

    if (submit) {
      fetch(form, { perPage: pagination.perPage, page: page + 1 });
    }
  };
  const setPageSize = (val) => {
    setPagination({
      page: 1,
      perPage: val,
    });

    fetch(form, { perPage: val, page: 1 });
  };

  React.useEffect(() => {
    fetch(form);
  }, []);

  const options = {
    chart: { type: 'column' },
    title: {
      text: 'Topics',
    },
    xAxis: {
      categories: topics.map((topic) => topic.name),
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Totals',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
        + '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    series: [{
      name: 'Questions',
      data: topics.map((topic) => topic.totalQuestions),
      color: '#1b6ec5',
    }, {
      name: 'Asked',
      data: topics.map((topic) => topic.totalAskedQuestions),
      color: '#2c9e4a',
    }, {
      name: 'Unanswered',
      data: topics.map((topic) => topic.totalUnanswered),
      color: '#d32f2f',
    }],
  };

  return (
    <Box>
      <Box py={2}>
        <Filters
          onSubmit={(values) => {
            setPage(0, false);
            fetch(values, { perPage: pagination.perPage, page: 1 });
          }}
          initialValues={form}
        />
      </Box>
      <Box>
        {
          !!topics.length && (
            <>
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
              />
              <Box textAlign="center">
                <TablePagination
                  component="div"
                  count={count}
                  page={pagination.page - 1}
                  onChangePage={(e, value) => {
                    setPage(value);
                  }}
                  rowsPerPage={pagination.perPage}
                  rowsPerPageOptions={[5, 10, 15]}
                  onChangeRowsPerPage={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setPageSize(value);
                  }}
                />
              </Box>
            </>
          )
        }
        {
          !topics.length && (
            <Alert severity="info" elevation={3}>
              No data found
            </Alert>
          )
        }
      </Box>
    </Box>
  );
};

export default PastSessions;
