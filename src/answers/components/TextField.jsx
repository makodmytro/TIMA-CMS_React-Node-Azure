import React from 'react';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';
import { useTranslate, TextField as RATextField } from 'react-admin';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core';
import ExpandMore from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import QuestionAnswerOutlined from '@material-ui/icons/QuestionAnswerOutlined';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PlayableText from '../../common/components/playable-text';

const allowedTypes = [
  'paragraph',
  'text',
  'strikethrough',
  'strike',
  'delete',
  'emphasis',
  'strong',
  'blockquote',
  'image',
  'link',
  'linkReference',
];
const styles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: '#D5D5D5',
    },
  },
}));

export const FollowupIcon = () => {
  const translate = useTranslate();

  return (
    <>
      <QuestionAnswerOutlined
        style={{ fontSize: '12px' }}
        titleAccess={translate('resources.questions.followup')}
      />
      &nbsp;
    </>
  );
};

const TextField = ({ record }) => {
  const translate = useTranslate();
  const classes = styles();

  return (
    <Box>
      <Box display="flex" alignContent="flex-end">
        <Box flex={5}>
          <Link
            to={{ pathname: `/answers/${record.id}/edit`, key: Math.random(), state: { applied: true } }}
            onClick={(e) => e.stopPropagation()}
            className={classes.link}
          >
            <ReactMarkdown source={record.text} allowedTypes={allowedTypes} plugins={[remarkGfm]} />
          </Link>
        </Box>
        <Box flex={1}>
          <PlayableText
            hideText
            text={record.spokenText || record.text}
            fkLanguageId={record.fk_languageId}
          />
        </Box>
      </Box>
      {
        record.FollowupQuestions?.length > 0 && (
          <Box borderTop="1px solid #e5e5e5">
            <Box mt={0}>
              {
                record.FollowupQuestions.map((q, i) => {
                  return (
                    <Box key={i} pt={0.5} display="flex">
                      <Box flex={1} pr={1}>
                        {
                          q.contextOnly && (
                            <Chip
                              label={translate('resources.questions.fields.contextOnly')}
                              variant="outlined"
                              size="small"
                              style={{ fontSize: '0.5rem', textTransform: 'uppercase' }}
                            />
                          )
                        }
                      </Box>
                      <Box fontSize="0.9rem" lineHeight="14px" flex={4}>
                        &#8226;&nbsp;
                        {
                          q.fk_answerId && (
                            <Link
                              className={classes.link}
                              to={`/answers/${q.fk_answerId}/edit`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {q.text}
                            </Link>
                          )
                        }
                        {
                          !q.fk_answerId && (<>{q.text}</>)
                        }
                      </Box>
                    </Box>
                  );
                })
              }
            </Box>
          </Box>
        )
      }
    </Box>
  );
};

export const AnswerRelatedQuestionField = ({ record }) => {
  const [expanded, setExpanded] = React.useState(false);

  if (!record || !record.RelatedQuestions.length) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center">
      <Box flex={1}>
        {
          record.RelatedQuestions.length > 1 && (
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();

                setExpanded(!expanded);
              }}
            >
              { !expanded && <ExpandMore fontSize="small" /> }
              { expanded && <ExpandLess fontSize="small" /> }
              &nbsp;
            </IconButton>
          )
        }
        {
          record.RelatedQuestions.length <= 1 && (<Box component="span" pl={4}>&nbsp;</Box>)
        }
      </Box>
      <Box flex={11}>
        <Box pb={1}>
          {
            record.RelatedQuestions[0].isFollowup && (
              <FollowupIcon />
            )
          }
          <RATextField record={record.RelatedQuestions[0]} source="text" />
        </Box>
        {
          expanded && record.RelatedQuestions.map((rq, i) => {
            if (i === 0) {
              return null;
            }

            return (
              <Box key={i} py={1} borderTop="1px solid #f1f1f1">
                {
                  rq.isFollowup && <FollowupIcon />
                }
                <RATextField record={rq} source="text" />
              </Box>
            );
          })
        }
      </Box>
    </Box>
  );
};

export default TextField;
