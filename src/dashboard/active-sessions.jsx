import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {
  useDataProvider,
  useNotify,
} from 'react-admin';
import SessionCharts from './sessions-charts';

const time = () => {
  const d = new Date();

  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

const ActiveSessions = (props) => {
  const [sessions, setSessions] = React.useState([]);

  const countRef = React.useRef(sessions);
  countRef.current = sessions;

  const dataProvider = useDataProvider();
  const notify = useNotify();

  const fetch = async () => {
    try {
      const res = await dataProvider.activeSessions(null, {});
      const { data } = res.data;
      const active = countRef.current.concat([{ ...data, date: time() }]);

      setSessions(active);

      setTimeout(fetch, 30 * 1000);
    } catch (err) {
      notify(`Failed to get active sessions: ${err.message}`, 'error');
    }
  };

  React.useState(() => {
    fetch();
  }, []);

  if (!sessions.length) {
    return null;
  }

  return (
    <SessionCharts sessions={sessions} />
  );
};

export default ActiveSessions;
