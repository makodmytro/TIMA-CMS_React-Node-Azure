import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const secondsToTime = (seconds) => {
  if (!seconds) {
    return '00:00';
  }

  const minutes = Math.floor(seconds / 60) > 0
    ? Math.floor(seconds / 60)
    : '00';
  const left = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(left).padStart(2, '0')}`;
};

const getStacked = (sessions) => {
  const u = (session) => {
    if (!session.totalUnanswered) {
      return 0;
    }

    return session.totalUnanswered;
  };

  const a = (session) => {
    if (!session.totalQuestions) {
      return 0;
    }

    return session.totalQuestions - session.totalUnanswered;
  };

  return {
    chart: { type: 'column' },
    title: {
      text: 'Questions / unanswered',
    },
    xAxis: {
      categories: sessions.map((session) => session.date),
    },
    yAxis: {
      min: 0,
      title: {
        text: '# Questions',
      },
      stackLabels: {
        enabled: false,
      },
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [{
      name: 'Questions unanswered',
      data: sessions.map((session) => u(session)),
      color: '#d32f2f',
    }, {
      name: 'Questions answered',
      data: sessions.map((session) => a(session)),
      color: '#1861e8',
    }],
  };
};

const getBars = (sessions) => ({
  chart: { type: 'column' },
  title: { text: 'Session average duration' },
  yAxis: {
    title: {
      text: 'Duration',
    },
    labels: {
      formatter: (e) => secondsToTime(e.value),
    },
  },
  xAxis: {
    categories: sessions.map((session) => session.date),
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      borderWidth: 0,
      dataLabels: {
        enabled: false,
      },
    },
  },
  tooltip: {
      formatter: function () { // eslint-disable-line
      return `<b>Duration: </b> ${secondsToTime(this.y)}`;
    },
  },
  series: [{
    name: 'Duration',
    data: sessions.map((session) => ({
      colorByPoint: true,
      y: session.avgDuration ? Math.floor(session.avgDuration) : 0,
    })),
  }],
});

const SessionGraphs = ({ sessions }) => {
  const stacked = getStacked(sessions);
  const bars = getBars(sessions);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <HighchartsReact
            highcharts={Highcharts}
            options={stacked}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <HighchartsReact
            highcharts={Highcharts}
            options={bars}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionGraphs;
