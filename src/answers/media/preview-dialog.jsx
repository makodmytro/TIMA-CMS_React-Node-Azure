import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  useDataProvider,
  useNotify,
} from 'react-admin';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Image, Video, Audio } from './file-preview';

const styles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  danger: {
    color: 'red',
    borderColor: 'red',
  },
}));

const PreviewDialog = ({
  media,
  open,
  onClose,
}) => {
  const classes = styles();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [src, setSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getAnswerMedia(null, {
        id: media.fk_answerId,
        mediaId: media.id,
      });

      setSrc(URL.createObjectURL(data));
    } catch (err) {
      notify('Failed to fetch the media', 'error');
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (media) {
      setSrc(null);
      fetch();
    }
  }, [media]);

  if (!media) {
    return null;
  }

  return (
    <>
      <Dialog onClose={onClose} open={open} maxWidth="lg" fullWidth className={classes.root} disableBackdropClick disableEscapeKeyDown>
        <DialogTitle disableTypography className={classes.title}>
          &nbsp;
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.content}>
          {
            loading && (
              <div>Loading...</div>
            )
          }
          {
            !loading && (
              <div>
                {
                  media.type.startsWith('audio') && (
                    <Audio src={src} />
                  )
                }
                {
                  media.type.startsWith('video') && (
                    <Video src={src} />
                  )
                }
                {
                  media.type.startsWith('image') && (
                    <Image src={src} />
                  )
                }
              </div>
            )
          }
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            type="button"
            onClick={onClose}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PreviewDialog;
