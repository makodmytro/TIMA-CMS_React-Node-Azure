import React from 'react';
import {
  useDataProvider,
  useNotify,
  Confirm,
  FileInput,
  useTranslate,
} from 'react-admin';
import { Form } from 'react-final-form'; // eslint-disable-line
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AudioIcon from '@material-ui/icons/PlayCircleFilled';
import VideoIcon from '@material-ui/icons/Videocam';
import ImageIcon from '@material-ui/icons/Image';
import FilePreview from './file-preview';
import PreviewDialog from './preview-dialog';
import useAnswer from '../useAnswer';

const Icon = ({ media }) => {
  if (media.type.startsWith('image')) {
    return (
      <ImageIcon />
    );
  }

  if (media.type.startsWith('audio')) {
    return (
      <AudioIcon />
    );
  }

  return (
    <VideoIcon />
  );
};

const MediaList = ({ answer }) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const { refresh } = useAnswer();
  const [media, setMedia] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState({
    id: null,
    delete: false,
  });

  const onOpen = (m) => {
    setMedia(m);
    setOpen(true);
  };

  const onClose = () => {
    setMedia(null);
    setOpen(false);
  };

  const deleteMediaClicked = (id) => {
    setConfirmation({
      id,
      delete: true,
    });
  };

  const deleteMediaClosed = () => {
    setConfirmation({
      id: null,
      delete: false,
    });
  };

  const destroy = async () => {
    try {
      await dataProvider.deleteAnswerMedia(null, {
        id: answer.id,
        mediaId: confirmation.id,
      });

      refresh();
      notify('The media was deleted');
      deleteMediaClosed();
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  const upload = async (values) => { // eslint-disable-line
    try {
      await dataProvider.uploadAnswerMedia(null, {
        id: answer.id,
        data: {
          binary: values.file.rawFile,
        },
      });
      notify('The file was uploaded');
      refresh();

      return Promise.resolve();
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  if (!answer || !answer.AnswerMedia) {
    return null;
  }

  return (
    <Box>
      <Confirm
        isOpen={confirmation.delete}
        loading={false}
        title={translate('misc.delete_media')}
        content={translate('dialogs.confirm_media_delete')}
        onConfirm={destroy}
        onClose={deleteMediaClosed}
      />
      <PreviewDialog
        open={open}
        onClose={onClose}
        media={media}
      />
      {
        !answer.AnswerMedia.length && (
          <Alert severity="info" elevation={3}>
            {translate('resources.answers.no_media')}
          </Alert>
        )
      }
      {
        !!answer.AnswerMedia.length && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{translate('misc.type')}</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                answer.AnswerMedia.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        onClick={() => onOpen(m)}
                        size="small"
                        variant="outlined"
                      >
                        <Icon media={m} /> {translate('misc.view')}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        style={{ borderColor: 'red', color: 'red' }}
                        size="small"
                        type="button"
                        onClick={() => deleteMediaClicked(m.id)}
                        variant="outlined"
                      >
                        {translate('ra.action.delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        )
      }
      <Box my={2}>
        <hr />
        <Typography>{translate('resources.answers.upload_media')}</Typography>
        <Form
          onSubmit={upload}
          initialValues={{
            file: null,
          }}
          render={({
            handleSubmit, values, form, submitting,
          }) => {
            return (
              <form onSubmit={(e) => handleSubmit(e).then(form.reset)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FileInput source="file" label={null} accept=".mp3,.wav.ogg,.mp4,.mpeg,.mpeg4,.avi,.mov,.wmv,.png,.jpg,.jpeg,.bmp,.gif">
                      <FilePreview />
                    </FileInput>
                  </Grid>
                  <Grid item xs={12} container justify="center">
                    <Grid item xs={12} sm={4}>
                      <Box pt={2}>
                        <Button
                          type="submit"
                          color="primary"
                          variant="contained"
                          fullWidth
                          disabled={!values.file || submitting}
                        >
                          {
                            submitting
                              ? translate('misc.uploading')
                              : translate('misc.upload')
                          }
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default MediaList;
