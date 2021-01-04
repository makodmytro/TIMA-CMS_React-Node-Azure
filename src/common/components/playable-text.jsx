import React from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import {
  useDataProvider,
  useNotify,
  TextInput,
} from 'react-admin';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useField } from 'react-final-form'; // eslint-disable-line
import PlayArrow from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
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

const PlayableTextInput = ({ lang, ...props }) => {
  const {
    input: { value },
  } = useField(props.source);

  return (
    <TextInput
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <PlayableText
              text={value}
              lang={isFunction(lang) ? lang(props.record) : lang}
              hideText
            />
          </InputAdornment>
        ),
      }}
    />
  );
};

const PlayableTextField = ({ record, source }) => (
  <PlayableText text={get(record, source)} lang={record.Language ? record.Language.code : 'en-US'} />
);

const PlayableText = ({
  el,
  text,
  lang,
  hideText,
}) => {
  const [playing, setPlaying] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const classes = styles();

  const getAudio = async (e) => {
    e.stopPropagation();

    if (!text) {
      notify('The text is empty. Can not play', 'error');

      return;
    }

    if (!lang || !isString(lang)) {
      notify('Missing language. Can not play', 'error');

      return;
    }

    try {
      const { data } = await dataProvider.tts(null, {
        data: {
          text,
          languageCode: lang,
        },
      });

      if (data.audio) {
        notify('Playing audio...');
        setPlaying(true);
        Audio.load(data.audio, null, () => {
          setPlaying(false);
        });
      }
    } catch (err) {
      notify(`Failed to play audio: ${err.message}`, 'error');
    }
  };

  const stop = (e) => {
    e.stopPropagation();

    Audio.pause();
    setPlaying(false);
  };

  return (
    <>
      {
        !hideText && (
          <>
            {el || text}
          </>
        )
      }
      &nbsp;
      {
        playing && (
          <StopIcon size="small" className={classes.play} onClick={stop} color="secondary" />
        )
      }
      {
        !playing && (
          <PlayArrow size="small" className={classes.play} onClick={getAudio} color="secondary" />
        )
      }
    </>
  );
};

export { PlayableTextField, PlayableTextInput };
export default PlayableText;
