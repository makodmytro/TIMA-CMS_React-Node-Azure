import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { keyBy } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: '1 1 auto',
    padding: theme.spacing(2, 1),
  },
  word: {
    cursor: 'pointer',
    padding: theme.spacing(1),
  },
  marked: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const SourceKeywordEdit = ({ record }) => {
  const classes = useStyles();
  const dataProvider = useDataProvider();

  const [keywords, setKeywords] = useState({});

  useEffect(() => {
    if (record && record.SourceKeywords) {
      setKeywords(keyBy(record.SourceKeywords, 'text'));
    }
  }, [record]);

  if (!record) {
    return <Card className={classes.container} />;
  }

  const handleWordClick = (word) => async () => {
    if (keywords[word]) {
      const { data } = await dataProvider.delete('keywords', { id: keywords[word].id });

      const newKeywords = { ...keywords };
      delete newKeywords[data.text];
      setKeywords(newKeywords);
    } else {
      const { data } = await dataProvider.create('keywords', {
        data: {
          fk_sourceTextId: record.id,
          fk_languageId: record.fk_languageId,
          text: word,
        },
      });

      setKeywords({ ...keywords, [data.text]: data });
    }
  };

  const renderText = () => record.text.split(' ').map((word) => (
    <span
      key={`${Math.random()}-${word}`}
      className={classNames(classes.word, { [classes.marked]: keywords[word] })}
      onClick={handleWordClick(word)}
    >
      {word}
    </span>
  ));

  return (
    <Card className={classes.container}>
      {renderText()}
    </Card>

  );
};

export default SourceKeywordEdit;
