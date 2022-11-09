import React from 'react';
import {
  useDataProvider,
  useTranslate,
  useNotify,
  DateField,
  TextField,
  FunctionField,
} from 'react-admin';
import { useSelector, useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const notify = useNotify();
  const status = useSelector((state) => state.custom.workflowStatus);
  const history = useSelector((state) => {
    const _a = state.custom.answers?.statusHistory;

    return _a[record?.id] || [];
  });

  const fetch = async () => {
    try {
      const { data } = await dataProvider.answerWorkflow('answers', {
        id: record.id,
      });

      dispatch({
        type: 'CUSTOM_ANSWER_STATUS_HISTORY',
        payload: {
          id: record.id,
          data,
        },
      });
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  React.useEffect(() => {
    if (record) {
      fetch();
    }
  }, [record]);

  if (!history || !history.length) {
    return null;
  }

  const render = (r) => {
    try {
      if (!status.length) {
        if (r.previousStatus) {
          return `${r.previousStatus} -> ${r.newStatus}`;
        }

        return r.newStatus;
      }

      const _new = status.find((s) => s.value === r.newStatus);

      if (r.previousStatus && r.previousStatus !== r.newStatus) {
        const _prev = status.find((s) => s.value === r.previousStatus);

        if (_prev) {
          return `${translate(`resources.users.workflow.status.${_prev?.name}`)} -> ${translate(`resources.users.workflow.status.${_new?.name}`)}`;
        }
      }

      if (!_new) {
        return '-';
      }

      return translate(`resources.users.workflow.status.${_new?.name}`);
    } catch (err) {
      return '';
    }
  };

  return (
    <Box width="100%">
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            {translate('resources.answers.status_history')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box width="100%" flex={1}>
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
                  history.map((row, i) => (
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
