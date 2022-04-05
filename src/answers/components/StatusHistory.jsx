import React from 'react';
import {
  useDataProvider,
  useTranslate,
  DateField,
  TextField,
  FunctionField,
} from 'react-admin';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from '@material-ui/core/AccordionDetails';

const StatusHistory = ({ record }) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const status = useSelector((state) => state.custom.workflowStatus)
  const [history, setHistory] = React.useState(null);

  const fetch = async () => {
    try {
      const { data } = await dataProvider.answerWorkflow('answers', {
        id: record.id,
      });

      setHistory(data);
    } catch (err) {} // eslint-disable-line
  };

  React.useEffect(() => {
    if (record) {
      fetch();
    }
  }, [record]);

  if (!history || !history.length) {
    return null;
  }

  const filtered = history.filter((h) => h.previousStatus !== h.newStatus);

  if (!filtered.length) {
    return null;
  }

  const render = (r) => {
    if (!status.length) {
      if (r.previousStatus) {
        return `${r.previousStatus} -> ${r.newStatus}`;
      }

      return r.newStatus;
    }

    const _new = status.find((s) => s.value === r.newStatus);

    if (r.previousStatus) {
      const _prev = status.find((s) => s.value === r.previousStatus);

      if (_prev) {
        return `${translate(`resources.users.workflow.status.${_prev.name}`)} -> ${translate(`resources.users.workflow.status.${_new.name}`)}`;
      }
    }

    if (!_new) {
      return '-';
    }

    return translate(`resources.users.workflow.status.${_new.name}`);
  };

  return (
    <Box width="100%">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>
            {translate('resources.answers.status_history')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box flex={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{translate('resources.answers.status.createdAt')}</TableCell>
                  <TableCell>{translate('resources.answers.status.updatedBy')}</TableCell>
                  <TableCell>{translate('resources.answers.status.status')}</TableCell>
                  <TableCell>{translate('resources.answers.status.comment')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filtered.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <DateField record={row} source="createdAt" showTime />
                      </TableCell>
                      <TableCell>
                        <TextField record={row} source="updatedBy" />
                      </TableCell>
                      <TableCell>
                        <FunctionField record={row} render={render} />
                      </TableCell>
                      <TableCell>
                        <TextField record={row} source="comment" />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default StatusHistory;
