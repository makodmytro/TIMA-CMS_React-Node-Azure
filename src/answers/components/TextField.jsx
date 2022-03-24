import React from 'react';
import Badge from '@material-ui/core/Badge';
import ReactMarkdown from 'react-markdown';
import PlayableText from '../../common/components/playable-text';
import styles from '../AnswerList/styles';

const TextField = ({ record, hideRelatedQuestions }) => {
  const classes = styles();
  const badgeContent = record.RelatedQuestions?.length
    ? `+${record.RelatedQuestions?.length}`
    : '-';

  return (
    <div className={classes.markdown}>
      {
        !hideRelatedQuestions && (
          <div className={classes.related}>
            <Badge
              badgeContent={badgeContent}
              color="primary"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              &nbsp;
            </Badge>
          </div>
        )
      }
      <div className="second">
        <ReactMarkdown source={record.text} />
      </div>
      <PlayableText
        hideText
        text={record.spokenText || record.text}
        fkLanguageId={record.fk_languageId}
      />
    </div>
  );
};

export default TextField;
