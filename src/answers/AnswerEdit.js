import React from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import {
  Edit, SimpleForm,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';

const styles = makeStyles((theme) => ({
  heading: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

const RelatedQuestions = ({ record }) => {
  const classes = styles();
  if (!record || !record.Questions || !record.Questions.length) {
    return null;
  }

  return (
    <Box p={1} boxShadow={1}>
      <Typography className={classes.heading}>
        Related questions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Text</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            record.Questions.map((question, i) => (
              <TableRow key={i}>
                <TableCell>
                  {question.text}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    type="button"
                    component={Link}
                    to={`/questions/${question.id}`}
                    color="primary"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </Box>
  );
};

const AnswerEdit = (props) => (
  <Edit {...props} actions={<CustomTopToolbar />}>
    <SimpleForm>
      <Form />
      <RelatedQuestions />
    </SimpleForm>
  </Edit>
);

export default AnswerEdit;
