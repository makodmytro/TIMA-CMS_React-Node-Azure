import React from 'react';
import {
  TextField,
  useDataProvider,
  useNotify,
} from 'react-admin';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { makeStyles } from '@material-ui/core/styles';
import Audio from '../audio';

const styles = makeStyles((theme) => ({
  play: {
    cursor: 'pointer',
    verticalAlign: 'middle',
  },
}));

const PlayableTextField = ({ text, lang }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const classes = styles();

  const getAudio = async (e) => {
    e.stopPropagation();

    try {
      const { data } = await dataProvider.tts(null, {
        data: {
          text,
          languageCode: lang,
        },
      });

      if (data.audio) {
        notify('Playing audio...');
        Audio.load(data.audio, null);
      }
    } catch (err) {
      notify(`Failed to play audio: ${err.message}`, 'error');
    }
  };

  return (
    <>
      {text}
      &nbsp;
      <PlayArrow size="small" className={classes.play} onClick={getAudio} color="primary" />
    </>
  );
};

export default PlayableTextField;
