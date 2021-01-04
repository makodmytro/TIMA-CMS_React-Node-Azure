import React from 'react';
import get from 'lodash/get';
import {
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

    '&:hover': {
      backgroundColor: '#b8d2cc5e',
    },
  },
}));

const PlayableTextField = ({ record, source }) => (
  <PlayableText text={get(record, source)} lang={record.Language ? record.Language.code : 'en-US'} />
);

const PlayableText = ({ el, text, lang }) => {
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
      {el || text}
      &nbsp;
      <PlayArrow size="small" className={classes.play} onClick={getAudio} color="secondary" />
    </>
  );
};

export { PlayableTextField };
export default PlayableText;
