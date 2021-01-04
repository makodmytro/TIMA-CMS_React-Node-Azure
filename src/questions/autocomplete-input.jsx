import React from 'react';
import { useField } from 'react-final-form'; // eslint-disable-line
import {
  useDataProvider,
  useNotify,
} from 'react-admin';
import debounce from 'lodash/debounce';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const AutocompleteInput = () => {
  const [value, setValue] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const {
    input: { onChange, value: currentValue },
  } = useField('fk_answerId');
  const {
    input: {
      onChange: setInputValue,
      value: inputValue,
    },
  } = useField('answer_text');

  const fetch = React.useMemo(
    () => debounce(async (query, callback) => {
      try {
        setLoading(true);

        const { data } = await dataProvider.getList('answers', {
          pagination: { perPage: 10, page: 1 },
          filter: { q: query },
        });

        setLoading(false);

        return callback(data);
      } catch (err) {
        notify(`Failed to fetch answers: ${err.message}`, 'error');

        return callback(null);
      }
    }, 200),
    [],
  );
  const getPresetAnswer = async () => {
    try {
      const { data } = await dataProvider.getOne('answers', {
        id: currentValue,
      });

      setValue(data);
    } catch (err) {
      notify(`Failed to fetch related answer: ${err.message}`, 'error');
    }
  };

  // handles when the value is changed from outside
  // for example when we create a new answer to go with this question
  React.useEffect(() => {
    if (currentValue && (!value || value.id !== currentValue)) {
      getPresetAnswer();
    }
  }, [currentValue]);

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    if (inputValue.length < 3) {
      return undefined;
    }

    fetch(inputValue, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Box pb={2}>
      <Autocomplete
        id="answers-autocomplete"
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.text)}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        freeSolo
        onChange={(event, newValue) => {
          if (!newValue) {
            setValue(null);
            onChange(null);
          } else if (newValue && (!value || value.id !== newValue.id)) {
            setValue(newValue);
            onChange(newValue.id);
          }
        }}
        onInputChange={(event, newInputValue) => {
          if (event && event.type !== 'click') {
            setInputValue(newInputValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Answer"
            variant="filled"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(option) => option.text}
      />
    </Box>
  );
};

export default AutocompleteInput;
