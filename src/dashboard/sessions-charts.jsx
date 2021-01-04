import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const getStacked = (sessions) => {
  const u = (session) => {
    if (!session.avgUnanswered) {
      return 0;
    }

    return Math.ceil((session.avgUnanswered * 100) / session.avgQuestions);
  };

  const a = (session) => {
    if (!session.avgQuestions) {
      return 0;
    }

    return Math.floor((session.avgQuestions - session.avgUnanswered) * 100 / session.avgQuestions);
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
        text: 'Percentage',
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: ( // theme
            Highcharts.defaultOptions.title.style
            && Highcharts.defaultOptions.title.style.color
          ) || 'gray',
        },
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
    tooltip: false,
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
      name: 'Questions each',
      data: sessions.map((session) => a(session)),
      color: '#1861e8',
    }],
  };
};

const getBars = (sessions) => {
  return {
    chart: { type: 'column' },
    title: { text: 'Session average duration' },
    yAxis: {
      title: {
        text: 'Duration',
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
          enabled: true,
          format: '{point.y}',
        },
      },
    },
    series: [{
      name: 'Dates',
      data: sessions.map((session) => ({
        name: 'session.date',
        colorByPoint: true,
        y: session.avgDuration ? Math.floor(session.avgDuration) : 0,
      })),
    }],
  };
};

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
