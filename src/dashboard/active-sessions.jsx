import React from 'react';
import {
  useDataProvider,
  useNotify,
} from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SessionCharts from './sessions-charts';

const styles = makeStyles((theme) => ({
  title: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    marginBottom: '20px',
  },
}));

const time = () => {
  const d = new Date();

  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

const ActiveSessions = () => {
  const classes = styles();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [sessions, setSessions] = React.useState([]);

  const countRef = React.useRef(sessions);
  countRef.current = sessions;
  let timeout = null;

  const fetch = async () => {
    try {
      const res = await dataProvider.activeSessions(null, {});

      if (!res) {
        throw new Error('Unauthenticated');
      }

      const { data } = res.data;
      const active = countRef.current
        .slice(countRef.current.length - 30, countRef.current.length) // keep only 30 elements max
        .concat([{ ...data, date: time() }]);

      setSessions(active);

      timeout = setTimeout(fetch, 30 * 1000);
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
  };

  React.useEffect(() => {
    fetch();

    return () => clearTimeout(timeout);
  }, []);

  if (!sessions.length) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" className={classes.title}>
        Active sessions ({sessions[sessions.length - 1].count})
      </Typography>
      <SessionCharts sessions={sessions} />
    </>
  );
};

export default ActiveSessions;
