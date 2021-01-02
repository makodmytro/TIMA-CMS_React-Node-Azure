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
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const {
    input: { onChange, value: currentValue },
    meta: { touched, error },
  } = useField('fk_answerId');

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

  React.useEffect(() => {
    if (currentValue) {
      getPresetAnswer();
    }
  }, []);

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
        disableClearable
        value={value}
        onChange={(event, newValue) => {
          if (newValue) {
            onChange(newValue.id);
            setValue(newValue);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
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
