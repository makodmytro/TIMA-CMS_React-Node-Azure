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
import Switch from '@material-ui/core/Switch';
import {
  Confirm,
  Edit,
  SimpleForm,
  useDataProvider,
  useNotify,
  useRefresh,
  Toolbar,
  SaveButton,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';
import LinksDialog from './links-dialog';
import AnswerMedia from './media/media';

const styles = makeStyles((theme) => ({
  heading: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

const LinksButton = ({ record, onDialogOpen }) => (
  <Button
    type="button"
    onClick={() => onDialogOpen(record)}
    variant="outlined"
    size="medium"
    style={{ marginLeft: '5px' }}
  >
    Links
  </Button>
);

const CustomToolbar = ({ onDialogOpen, ...props }) => (
  <Toolbar {...props}>
    <SaveButton
      label="Save"
      redirect="list"
      submitOnEnter
    />
    <LinksButton onDialogOpen={onDialogOpen} record={props.record} />
  </Toolbar>
);

const RelatedQuestions = ({
  record, onRemoveAnswer, onApproveChange,
  setAnswer,
}) => {
  const classes = styles();

  React.useEffect(() => {
    if (record) {
      setAnswer(record);
    }
  }, [record]);

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
            <TableCell>Approved</TableCell>
            <TableCell>&nbsp;</TableCell>
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
                  <Switch
                    onChange={(e) => {
                      onApproveChange(question.id, e.target.checked);
                    }}
                    checked={question.approved}
                  />
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
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveAnswer(question);
                    }}
                    variant="outlined"
                    size="small"
                    type="button"
                    style={{ color: 'red', borderColor: '#ff0000a6' }}
                  >
                    Unlink answer
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

const AnswerEdit = (props) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [answer, setAnswer] = React.useState(null);
  const [record, setRecord] = React.useState(null);
  const [removeAnswerConfirmOpened, setRemoveAnswerConfirmOpened] = React.useState(false);
  const [opened, setOpened] = React.useState(false);

  const onDialogOpen = (r) => {
    setRecord(r);
    setOpened(true);
  };

  const onRemoveAnswerOpen = (r) => {
    setRecord(r);
    setRemoveAnswerConfirmOpened(true);
  };

  const onRemoveAnswerClose = () => {
    setRecord(null);
    setRemoveAnswerConfirmOpened(false);
  };

  const removeAnswer = async () => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: { fk_answerId: null },
      });

      refresh();
    } catch (err) {
      notify(`Failed to remove the answer: ${err.message}`, 'error');
    }
    onRemoveAnswerClose();
  };

  const updateApproved = async (id, approved) => {
    try {
      await dataProvider.update('questions', {
        id,
        data: { approved },
      });

      notify('The question was updated');
      refresh();
    } catch (err) {
      notify('Failed to update the question');
    }
  };

  return (
    <>
      <Edit {...props} actions={<CustomTopToolbar />}>
        <SimpleForm toolbar={<CustomToolbar onDialogOpen={onDialogOpen} />}>
          <Form {...props} edit />
          <RelatedQuestions
            onRemoveAnswer={onRemoveAnswerOpen}
            onApproveChange={updateApproved}
            setAnswer={setAnswer}
          />
        </SimpleForm>
      </Edit>
      <Confirm
        isOpen={removeAnswerConfirmOpened}
        loading={false}
        title="Unlink answer"
        content="Are you sure you want to unlink the answer from the question?"
        onConfirm={removeAnswer}
        onClose={onRemoveAnswerClose}
      />
      <LinksDialog
        open={opened}
        onClose={() => {
          setRecord(null);
          setOpened(false);
        }}
        record={record}
      />
      {
        props.permissions && props.permissions.allowMediaFiles && (
          <Box my={1} p={2} boxShadow={3}>
            <Typography>Media</Typography>
            <AnswerMedia answer={answer} />
          </Box>
        )
      }
    </>
  );
};

export default AnswerEdit;
