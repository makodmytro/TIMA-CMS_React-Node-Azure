import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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

export const Image = ({ src }) => {
  const classes = styles();

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
};

export const ImagePreview = ({ file }) => {
  const [src, setSrc] = React.useState(null);

  React.useEffect(() => {
    const fr = new FileReader();
    fr.onload = function Loaded() {
      setSrc(fr.result);
    };
    fr.readAsDataURL(file);
  }, [file]);

  return (<Image src={src} />);
};

export const Audio = ({ src }) => {
  const classes = styles();

  return (
    <div className={classes.previewContainer}>
      <div>
        <audio controls>
          <source src={src} />
        </audio>
      </div>
    </div>
  );
};

export const AudioPreview = ({ file }) => {
  const [src, setSrc] = React.useState(null);

  React.useEffect(() => {
    setSrc(URL.createObjectURL(file));
  }, [file]);

  return (<Audio src={src} />);
};

export const Video = ({ src }) => {
  const classes = styles();

  return (
    <div className={classes.previewContainer}>
      <div>
        <video controls>
          <source src={src} />
        </video>
      </div>
    </div>
  );
};

export const VideoPreview = ({ file }) => {
  const [src, setSrc] = React.useState(null);

  React.useEffect(() => {
    setSrc(URL.createObjectURL(file));
  }, [file]);

  return (<Video src={src} />);
};

const FilePreview = (props) => {
  if (!props.record || !props.record.rawFile) {
    return null;
  }

  const { rawFile } = props.record;

  if (rawFile.type.startsWith('image/')) {
    return (
      <ImagePreview file={rawFile} />
    );
  }

  if (rawFile.type.startsWith('audio/')) {
    return (
      <AudioPreview file={rawFile} />
    );
  }

  if (rawFile.type.startsWith('video/')) {
    return (
      <VideoPreview file={rawFile} />
    );
  }

  return null;
};

export default FilePreview;
