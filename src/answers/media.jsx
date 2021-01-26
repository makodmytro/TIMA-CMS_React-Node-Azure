import React from 'react';
import {
  useDataProvider,
  useNotify,
  Confirm,
  FileInput,
} from 'react-admin';
import { Form } from 'react-final-form'; // eslint-disable-line
import { makeStyles } from '@material-ui/core/styles';
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

const styles = makeStyles((theme) => ({
  previewContainer: {
    margin: '0 auto',

    '& div': {
      maxWidth: '50%',
      border: '1px solid #bdbdbd',
      padding: theme.spacing(1),
      margin: '0 auto',
    },

    '& img': {
      width: '100%',
    },
    '& audio': {
      width: '100%',
    },
    '& video': {
      width: '100%',
    },
  },
}));

const FilePreview = (props) => {
  const classes = styles();
  const [src, setSrc] = React.useState(null);
  const [type, setType] = React.useState(null);

  if (!props.record || !props.record.rawFile) {
    return null;
  }

  const { rawFile } = props.record;

  React.useEffect(() => {
    if (props.record) {
      if (rawFile.type.startsWith('image/')) {
        setType('image');

        const fr = new FileReader();
        fr.onload = function (e) {
          setSrc(fr.result);
        };
        fr.readAsDataURL(rawFile);
      }

      if (rawFile.type.startsWith('audio/')) {
        setType('audio');
        setSrc(URL.createObjectURL(rawFile));
      }

      if (rawFile.type.startsWith('video/')) {
        setType('video');
        setSrc(URL.createObjectURL(rawFile));
      }
    }
  }, [props.record]);

  if (type === 'image') {
    return (
      <div className={classes.previewContainer}>
        <div>
          <img
            src={src}
            alt="preview"
          />
        </div>
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className={classes.previewContainer}>
        <div>
          <audio controls>
            <source src={src} />
          </audio>
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={classes.previewContainer}>
        <div>
          <video controls>
            <source src={src} />
          </video>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.previewContainer}>
      123123
    </div>
  );
};

const MediaList = (props) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { answerId } = props;
  const [media, setMedia] = React.useState([]);
  const [confirmation, setConfirmation] = React.useState({
    id: null,
    delete: false,
  });

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getAnswerMedia(null, {
        id: answerId,
      });

      setMedia(
        [{
          id: '123123',
          url: 'bla@bla.com',
          type: 'image/png',
          position: 1,
        }, {
          id: '123123',
          url: 'bla@bla.com',
          type: 'image/png',
          position: 1,
        }],
      );
    } catch (err) {
      notify(`Failed to fetch media: ${err.message}`, 'error');
    }
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
        id: answerId,
        mediaId: confirmation.id,
      });

      fetch();
      notify('The media was deleted');
      deleteMediaClosed();
    } catch (err) {
      notify(`Failed to delete media: ${err.message}`, 'error');
    }
  };

  const upload = (values) => new Promise((resolve) => { // eslint-disable-line
    try {
      const fr = new FileReader();
      fr.onload = function () {
        console.log(fr.result);

        return resolve();
      };
      fr.readAsBinaryString(values.file.rawFile);

      notify('The file was uploaded');
      fetch();
    } catch (err) {
      notify(`Failed to upload: ${err.message}`, 'error');

      return resolve();
    }
  });

  React.useEffect(() => {
    fetch();
  }, []);

  return (
    <Box>
      <Confirm
        isOpen={confirmation.delete}
        loading={false}
        title="Delete media"
        content="Are you sure you want to delete this media file?"
        onConfirm={destroy}
        onClose={deleteMediaClosed}
      />
      {
        !media.length && (
          <Alert severity="info" elevation={3}>
            There is no media for this answer
          </Alert>
        )
      }
      {
        !!media.length && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>URL</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                media.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>{m.url}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>
                      <Button
                        style={{ borderColor: 'red', color: 'red' }}
                        size="small"
                        type="button"
                        onClick={() => deleteMediaClicked(m.id)}
                        variant="outlined"
                      >
                        Delete
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
        <Typography>Upload new file</Typography>
        <Form
          onSubmit={upload}
          initialValues={{
            file: null,
          }}
          render={({ handleSubmit, values, reset }) => {
            return (
              <form
                onSubmit={(e) => {
                  handleSubmit.then(() => {
                    console.log('then');

                    reset();
                  });
                }}
              >
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
                          disabled={!values.file}
                        >
                          Upload
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
