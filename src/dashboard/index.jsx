import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Title } from 'react-admin';
import ActiveSessions from './active-sessions';
import PastSessions from './past-sessions';
import Topics from './topics';
import Map from './map';

const styles = makeStyles((theme) => ({
  title: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    marginBottom: '20px',
  },
}));

const Dashboard = () => {
  const classes = styles();

  return (
    <Box py={2}>
      <Title title="Dashboard" />

      <Box>
        <ActiveSessions />
      </Box>

      <Box mt={3}>
        <Typography variant="h5" className={classes.title}>
          Past sessions
        </Typography>
        <PastSessions />
      </Box>
      <Box mt={3}>
        <Typography variant="h5" className={classes.title}>
          Topics
        </Typography>
        <Topics />
      </Box>
      <Box>
        <Typography variant="h5" className={classes.title}>
          Sessions map
        </Typography>
        <Map />
      </Box>
    </Box>
  );
};

export default Dashboard;
