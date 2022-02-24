import React from 'react';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  Confirm,
} from 'react-admin';
import { connect } from 'react-redux';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Alert from '@material-ui/lab/Alert';
import WarningIcon from '@material-ui/icons/Warning';
import { PlayableTextField } from '../../common/components/playable-text';
import { Text } from '../../answers/AnswerList';
import AnswerDiffTopicDialog from './answer-diff-topic.dialog';
import Filters from './filters-form';
import CreateForm from './answer-create-form';
import { useDisabledEdit } from '../../hooks';

const LinksDialog = ({
  record,
  languages,
}) => {
  const disabled = useDisabledEdit(record?.fk_topicId);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [topics, setTopics] = React.useState({});
  const [results, setResults] = React.useState(null);
  const [pagination, setPagination] = React.useState({
    perPage: 5,
    page: 1,
  });
  const [form, setForm] = React.useState({
    q: '',
    type: 'questions',
    all_topics: false,
    ignored: false,
    approved: '__none__',
  });
  const [count, setCount] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [dialogs, setDialogs] = React.useState({
    confirmation: false,
    answers: false,
  });

  const start = () => {
    setResults(null);
    setPagination({
      perPage: 5,
      page: 1,
    });
    setForm({
      q: '',
      type: 'questions',
      all_topics: false,
      ignored: false,
      approved: '__none__',
    });
    setSelected(null);
    setDialogs({
      confirmation: false,
      answers: false,
    });
  };

  const linkAnswer = async (fk_answerId, fk_topicId) => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: {
          fk_answerId,
          fk_topicId,
        },
      });

      notify('The answer has been linked');
      refresh();
      window.scroll(0, 0);
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }

      throw err;
    }
  };

  const fetchTopics = async () => {
    const { data } = await dataProvider.getList('topics', {
      pagination: { perPage: 100, page: 1 },
    });

    setTopics(
      data.reduce((acc, cur) => {
        acc[cur.id] = cur;

        return acc;
      }, {}),
    );
  };

  React.useEffect(() => {
    start();
    fetchTopics();
  }, []);

  if (!record) {
    return null;
  }

  const onSubmit = async (values, paging = pagination) => {
    setForm(values);

    const {
      type, approved, all_topics, ignored, ...rest
    } = values;

    const { data, total } = await dataProvider.getList(type, {
      filter: {
        ...rest,
        ...(approved !== '__none__' && type === 'questions' ? { approved } : {}),
        ...(
          all_topics ? {} : { fk_topicId: record.fk_topicId }
        ),
        ...(
          type === 'questions'
            ? { fk_answerId: '!NULL' }
            : {}
        ),
        ...(type === 'questions' ? { ignored } : {}),
      },
      pagination: paging,
    });

    setResults(data);
    setCount(total);
  };

  const setPage = (page, submit = true) => {
    setPagination({
      ...pagination,
      page: page + 1,
    });

    if (submit) {
      onSubmit(form, { perPage: pagination.perPage, page: page + 1 });
    }
  };

  const setPageSize = (val) => {
    setPagination({
      page: 1,
      perPage: val,
    });

    onSubmit(form, { perPage: val, page: 1 });
  };

  const createAnswer = async (values) => {
    try {
      const { data } = await dataProvider.create('answers', {
        data: {
          ...values,
          fk_languageId: record.fk_languageId,
          fk_topicId: record.fk_topicId,
        },
      });

      linkAnswer(data.id, data.fk_topicId);
      start();
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
  };

  const selectToLink = (result) => {
    if (result.fk_topicId !== record.fk_topicId) {
      if (form.type === 'questions') {
        setDialogs({
          confirmation: true,
          answers: false,
        });
      } else if (form.type === 'answers') {
        setDialogs({
          confirmation: false,
          answers: true,
        });
      }

      setSelected(result);

      return;
    }

    linkAnswer(result.fk_answerId || result.id, result.fk_topicId);
    start();
  };

  const onConfirm = () => {
    linkAnswer(selected.fk_answerId || selected.id, selected.fk_topicId);
    start();
  };

  const onClose = () => {
    setSelected(null);
    setDialogs({
      confirmation: false,
      answers: false,
    });
  };

  return (
    <>
      {
        dialogs.answers && (
          <AnswerDiffTopicDialog
            open={dialogs.answers}
            onUpdate={onConfirm}
            onDuplicate={() => {
              createAnswer({
                text: selected.text,
              });
              onClose();
            }}
            {...{
              topics,
              selected,
              onClose,
              record,
            }}
          />
        )
      }
      <Confirm
        isOpen={dialogs.confirmation}
        loading={false}
        title="Link"
        content={
          selected
            ? `The selected record is linked to topic "${topics[selected.fk_topicId].name}". Linking will change the question's topic. Proceed?`
            : 'Confirm'
        }
        onConfirm={onConfirm}
        onClose={onClose}
      />
      <Filters
        onSubmit={(values) => {
          setPage(0, false);
          return onSubmit(values, { perPage: pagination.perPage, page: 1 });
        }}
        initialValues={form}
      />
      {
        !results && (
          <Box py={2}>
            <Alert severity="info">
              Use the filters to search for answers or questions
            </Alert>
          </Box>
        )
      }
      {
        results && !results.length && (
          <Box py={2}>
            <Alert severity="info">
              No records were found
            </Alert>
          </Box>
        )
      }
      {
        results && !!results.length && (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Text</TableCell>
                  <TableCell>Topic</TableCell>
                  {
                    form.type === 'questions' && (
                      <TableCell>Answer</TableCell>
                    )
                  }
                  <TableCell>&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  results.map((result, i) => (
                    <TableRow key={i}>
                      <TableCell style={{ width: '25%' }}>
                        {
                          form.type === 'questions' && (
                            <PlayableTextField
                              source="text"
                              record={result}
                              getLanguageFromRecord={(r) => {
                                return languages[r.fk_languageId]
                                  ? languages[r.fk_languageId].code
                                  : null;
                              }}
                            />
                          )
                        }
                        {
                          form.type === 'answers' && (
                            <Text
                              record={result}
                              hideRelatedQuestions
                            />
                          )
                        }
                      </TableCell>
                      <TableCell>
                        {
                          !!result.fk_topicId && result.fk_topicId !== record.fk_topicId && (
                            <WarningIcon
                              color="error"
                              style={{ verticalAlign: 'middle' }}
                            />
                          )
                        }
                        {
                          topics[result.fk_topicId]
                            ? topics[result.fk_topicId].name
                            : result.fk_topicId
                        }
                      </TableCell>
                      {
                        form.type === 'questions' && (
                          <TableCell style={{ width: '25%' }}>
                            {
                              result.fk_answerId && (
                                <Text
                                  record={result.Answer}
                                  hideRelatedQuestions
                                />
                              )
                            }
                          </TableCell>
                        )
                      }
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          type="button"
                          onClick={() => {
                            selectToLink(result);
                          }}
                          disabled={disabled}
                        >
                          Link to answer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <Box textAlign="right">
              <TablePagination
                component="div"
                count={count}
                page={pagination.page - 1}
                onChangePage={(e, value) => {
                  setPage(value);
                }}
                rowsPerPage={pagination.perPage}
                rowsPerPageOptions={[1, 5, 10, 15]}
                onChangeRowsPerPage={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setPageSize(value);
                }}
              />
            </Box>
          </>
        )
      }
      <hr />
      <CreateForm
        onSubmit={(v) => createAnswer(v)}
        disabled={disabled}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  return {
    languages,
  };
};

export default connect(mapStateToProps)(LinksDialog);
