import React from 'react';
import {
  useTranslate,
  useDataProvider,
  TextField,
} from 'react-admin';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';

const TOPICS_TREE_CHILD_COLOR = process.env.REACT_APP_TOPICS_TREE_CHILD_COLOR || '498ca752';

const Row = ({
  record,
  topicsChildren,
  onFetchChildren,
  selected,
  toggleSelected,
  expanded,
  toggleExpanded,
  level,
}) => {
  const bg = !level ? 'initial' : `#${(parseInt(TOPICS_TREE_CHILD_COLOR, 16) + 32 * level).toString(16)}`;
  const isExpanded = expanded.includes(record.id);

  return (
    <>
      <TableRow style={{ backgroundColor: bg, cursor: 'pointer' }}>
        <TableCell>
          {
            !!record.childCount && record.childCount > 0 && (
              <>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();

                    return toggleExpanded(record.id);
                  }}
                >
                  { !isExpanded && <AddIcon fontSize="small" /> }
                  { isExpanded && <MinusIcon fontSize="small" /> }
                </IconButton>
              </>
            )
          }
        </TableCell>
        <TableCell style={level ? { paddingLeft: `${30 * level}px` } : {}}>
          <TextField record={record} source="name" />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={selected.includes(record.id)}
            onChange={() => toggleSelected(record)}
          />
        </TableCell>
      </TableRow>
      {
        isExpanded && record.childCount > 0 && topicsChildren[record.id] && !!topicsChildren[record.id].length && (
          <>
            {
              topicsChildren[record.id].map((child, iii) => (
                <Row
                  record={child}
                  {...{
                    topicsChildren,
                    onFetchChildren,
                    selected,
                    toggleSelected,
                    expanded,
                    toggleExpanded,
                  }}
                  key={iii}
                  level={(level || 0) + 1}
                />
              ))
            }
          </>
        )
      }
    </>
  );
};

export default function TopicSelectDialog({
  open,
  onConfirm,
  onClose,
  initialValues,
}) {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [topicsChildren, setChildren] = React.useState({});
  const [topics, setTopics] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [expanded, setExpanded] = React.useState([]);

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList('topics', {
        pagination: { perPage: 200, page: 1 },
        filter: { topLevelOnly: '1' },
      });

      setTopics(data);
    } catch (e) {} // eslint-disable-line
  };

  const toggleSelected = async (topic) => {
    if (selected.includes(topic.id)) {
      setSelected(selected.filter((s) => s !== topic.id));
    } else {
      let ids = [topic.id];

      if (topic.childCount && !expanded.includes(topic.id)) {
        toggleExpanded(topic.id);
      }

      setSelected(selected.concat(ids));
    }
  };

  const onFetchChildren = async (id) => {
    try {
      const { data } = await dataProvider.getOne('topics', { id });

      setChildren({
        ...topicsChildren,
        [id]: data?.ChildTopics || [],
      });
    } catch (e) {} // eslint-disable-line
  };

  const toggleExpanded = async (id) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((e) => e !== id));
    } else {
      setExpanded(expanded.concat([id]));

      if (!topicsChildren[id]) {
        onFetchChildren(id);
      }
    }
  };

  React.useEffect(() => {
    if (open && !topics.length) {
      fetch();
    }
  }, [open]);

  React.useEffect(() => {
    if (!selected.length) {
      setSelected(initialValues);
    }
  }, [initialValues]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title">{translate('resources.topics.filter_by_topics')}</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {
                topics.map((record, i) => (
                  <Row
                    key={i}
                    record={record}
                    {...{
                      topicsChildren,
                      onFetchChildren,
                      selected,
                      toggleSelected,
                      expanded,
                      toggleExpanded,
                    }}
                  />
                ))
              }
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelected([]);
              onConfirm([]);
            }}
            color="default"
            variant="outlined"
            size="small"
          >
            {translate('misc.clear')}
          </Button>
          <Button
            onClick={onClose}
            color="secondary"
            variant="outlined"
            size="small"
          >
            {translate('misc.cancel')}
          </Button>
          <Button
            onClick={() => onConfirm(selected)}
            color="primary"
            variant="outlined"
            size="small"
          >
            {translate('misc.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}