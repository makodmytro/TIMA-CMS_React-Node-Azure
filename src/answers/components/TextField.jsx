import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate, TextField as RATextField } from 'react-admin';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import ReactMarkdown from 'react-markdown';
import PlayableText from '../../common/components/playable-text';

const TextField = ({ record }) => {
  const translate = useTranslate();

  return (
    <Box>
      <Box display="flex" alignContent="flex-end">
        <Box flex={5}>
          <ReactMarkdown source={record.text} />
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
        !!record.FollowupQuestions.length && (
          <Box borderTop="1px solid #e5e5e5">
            <Box component="ul" mt={0}>
              {
                record.FollowupQuestions.map((q, i) => {
                  return (
                    <Box key={i} pt={0.5} component="li">
                      <Box fontSize="0.9rem" lineHeight="14px">
                        {q.text}
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
          <RATextField record={record.RelatedQuestions[0]} source="text" />
        </Box>
        {
          expanded && record.RelatedQuestions.map((rq, i) => {
            if (i === 0) {
              return null;
            }

            return (
              <Box key={i} py={1} borderTop="1px solid #f1f1f1">
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
