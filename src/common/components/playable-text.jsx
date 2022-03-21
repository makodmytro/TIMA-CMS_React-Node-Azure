import React from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import { useSelector } from 'react-redux';
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

const styles = makeStyles(() => ({
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
  } = useField(props.source); // eslint-disable-line

  return (
    <TextInput
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <PlayableText
              text={value}
              lang={isFunction(lang) ? lang(props.record) : lang} // eslint-disable-line
              hideText
            />
          </InputAdornment>
        ),
      }}
    />
  );
};

const PlayableTextField = ({ record, source, getLanguageFromRecord }) => {
  let lang = record.Language ? record.Language.code : null;

  if (getLanguageFromRecord) {
    lang = getLanguageFromRecord(record);
  }

  return (
    <PlayableText
      text={get(record, source)}
      lang={lang}
    />
  );
};

const PlayableText = ({
  el,
  text,
  lang,
  fkLanguageId,
  hideText,
}) => {
  const languages = useSelector((state) => state.admin.resources.languages.data);
  const [playing, setPlaying] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const classes = styles();

  const code = lang || languages[fkLanguageId]?.code || 'de-DE';

  const getAudio = async (e) => {
    e.stopPropagation();

    if (!text) {
      notify('The text is empty. Can not play', 'error');

      return;
    }

    if (!code || !isString(code)) {
      // notify('Missing language. Can not play', 'error');

      return;
    }

    try {
      const { data } = await dataProvider.tts(null, {
        data: {
          text,
          languageCode: code,
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
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
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
          <StopIcon
            size="small"
            className={classes.play}
            onClick={stop}
            color={code ? 'secondary' : 'disabled'}
          />
        )
      }
      {
        !playing && (
          <PlayArrow
            size="small"
            className={classes.play}
            onClick={getAudio}
            color={code ? 'secondary' : 'disabled'}
          />
        )
      }
    </>
  );
};

export { PlayableTextField, PlayableTextInput };
export default PlayableText;
