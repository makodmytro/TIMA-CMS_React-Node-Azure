import React from 'react';
import { AppBar, useGetList, useTranslate } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { setLanguage } from '../reducer/lngReducer';

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  spacer: {
    flex: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    color: 'white',
  },
}));

const MyAppBar = (props) => {
  const classes = useStyles();
  const { onLanguageChange, language, ...rest } = props;
  const { data, loading, error } = useGetList('languages', null, null, null);
  const translate = useTranslate();

  return (
    <AppBar {...rest}>
      <Typography
        variant="h6"
        color="inherit"
        className={classes.title}
        id="react-admin-title"
      />
      <span className={classes.spacer} />

      {(!loading && data && !error) && (
        <FormControl className={classes.formControl}>
          <InputLabel id="lng-select-label">{translate('appbar.languageSelect')}</InputLabel>
          <Select
            labelId="lng-select-label"
            id="demo-simple-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {Object.values(data)
              .map((d) => (<MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>))}
          </Select>
        </FormControl>
      )}

    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  language: state.lng.language,
});

const mapDispatchToProps = (dispatch) => ({
  onLanguageChange: (lng) => {
    dispatch(setLanguage(lng));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAppBar);
