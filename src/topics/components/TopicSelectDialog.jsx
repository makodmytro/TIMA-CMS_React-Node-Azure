import React from 'react';
import { useTranslate, TextField } from 'react-admin';
import isEqual from 'lodash/isEqual';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import IndeterminateCheckBox from '@material-ui/icons/IndeterminateCheckBox';
import { useTopicsTree } from '../useTopics';

const TOPICS_TREE_CHILD_COLOR = process.env.REACT_APP_TOPICS_TREE_CHILD_COLOR || '498ca752';

const Row = ({ record, selected, toggleSelected, expanded, toggleExpanded, level }) => {
  const bg = !level ? 'initial' : `#${(parseInt(TOPICS_TREE_CHILD_COLOR, 16) + 32 * level).toString(16)}`;
  const isExpanded = expanded.includes(record.id);

  const childrenSelected = record.ChildTopics.filter((ct) => selected.includes(ct.id)).length;
  const indeterminateChildren = !!childrenSelected && childrenSelected !== record.ChildTopics.length && record.ChildTopics.length > 0;

  let grandChildren = 0;
  const grandChildrenSelected = record.ChildTopics.reduce((acc, ct) => {
    grandChildren += ct.ChildTopics.length;

    return acc + ct.ChildTopics.filter((ctt) => selected.includes(ctt.id)).length;
  }, 0);
  const indeterminateGrandchildren =
    grandChildrenSelected && grandChildrenSelected + childrenSelected !== grandChildren + record.ChildTopics.length && grandChildren > 0;

  return (
    <>
      <TableRow style={{ backgroundColor: bg, cursor: 'pointer' }}>
        <TableCell>
          {!!record.ChildTopics && record.ChildTopics.length > 0 && (
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();

                  return toggleExpanded(record.id);
                }}
              >
                {!isExpanded && <AddIcon fontSize="small" />}
                {isExpanded && <MinusIcon fontSize="small" />}
              </IconButton>
            </>
          )}
        </TableCell>
        <TableCell style={level ? { paddingLeft: `${30 * level}px` } : {}}>
          <TextField record={record} source="name" />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={selected.includes(record.id)}
            onChange={() => toggleSelected(record)}
            indeterminate={indeterminateChildren || indeterminateGrandchildren}
            indeterminateIcon={<IndeterminateCheckBox color="secondary" />}
            color="secondary"
          />
        </TableCell>
      </TableRow>
      {isExpanded && record.ChildTopics && record.ChildTopics.length > 0 && (
        <>
          {record.ChildTopics.map((child, iii) => (
            <Row
              record={child}
              {...{
                selected,
                toggleSelected,
                expanded,
                toggleExpanded,
              }}
              key={iii}
              level={(level || 0) + 1}
            />
          ))}
        </>
      )}
    </>
  );
};

export default function TopicSelectDialog({ open, onConfirm, onClose, initialValues }) {
  const translate = useTranslate();
  const { topics, loading } = useTopicsTree();
  const [selected, setSelected] = React.useState([]);
  const [expanded, setExpanded] = React.useState([]);

  const toggleSelected = async (topic) => {
    if (selected.includes(topic.id)) {
      const ids = [topic.id];

      if (topic.ChildTopics && topic.ChildTopics.length) {
        topic.ChildTopics.forEach((tc) => {
          if (selected.includes(tc.id)) {
            ids.push(tc.id);
          }

          if (tc.ChildTopics && tc.ChildTopics.length) {
            tc.ChildTopics.forEach((tc2) => {
              if (selected.includes(tc2.id)) {
                ids.push(tc2.id);
              }
            });
          }
        });
      }

      setSelected(selected.filter((s) => !ids.includes(s)));
    } else {
      const ids = [topic.id];
      const idsToExpand = [];

      if (!expanded.includes(topic.id)) {
        idsToExpand.push(topic.id);
      }

      if (topic.ChildTopics && topic.ChildTopics.length) {
        let children = topic.ChildTopics;

        children = children.reduce((acc, child) => {
          if (child.ChildTopics && child.ChildTopics.length) {
            return acc.concat(child.ChildTopics);
          }

          return acc;
        }, children);

        children.forEach((c) => {
          if (!selected.includes(c.id)) {
            ids.push(c.id);
          }

          if (c.ChildTopics && c.ChildTopics.length && !expanded.includes(c.id)) {
            idsToExpand.push(c.id);
          }
        });
      }

      setSelected(selected.concat(ids));
      setExpanded(expanded.concat(idsToExpand));
    }
  };

  const toggleExpanded = async (id) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((e) => e !== id));
    } else {
      setExpanded(expanded.concat([id]));
    }
  };

  React.useEffect(() => {
    if (isEqual(selected, initialValues)) {
      return;
    }

    const ids = [];
    const idsToDeselect = [];

    topics.forEach((topic) => {
      let grandChildren = 0;
      let childrenSelected = 0;
      const grandChildrenSelected = topic.ChildTopics.reduce((acc, ct) => {
        grandChildren += ct.ChildTopics.length;

        if (selected.includes(ct.id)) {
          childrenSelected += 1;
        }

        const gcSelected = ct.ChildTopics.filter((ctt) => selected.includes(ctt.id)).length;

        if (ct.ChildTopics.length && ct.ChildTopics.length === gcSelected && !selected.includes(ct.id)) {
          ids.push(ct.id);
        }

        if (ct.ChildTopics.length && !gcSelected && selected.includes(ct.id)) {
          idsToDeselect.push(ct.id);
        }

        return acc + gcSelected;
      }, 0);

      if (
        topic.ChildTopics.length &&
        childrenSelected === topic.ChildTopics.length &&
        grandChildren === grandChildrenSelected &&
        !selected.includes(topic.id)
      ) {
        ids.push(topic.id);
      }

      if (grandChildren + topic.ChildTopics.length && childrenSelected + grandChildrenSelected === 0 && selected.includes(topic.id)) {
        idsToDeselect.push(topic.id);
      }
    });

    if (ids.length || idsToDeselect.length) {
      setSelected((s) => s.filter((id) => !idsToDeselect.includes(id)).concat(ids));
    }
  }, [selected]);

  React.useEffect(() => {
    if (!selected.length) {
      setSelected(initialValues);
    }

    if (topics.length) {
      let ids = [];

      topics.forEach((topic) => {
        const children = topic.ChildTopics.reduce((acc, c) => {
          if (initialValues.includes(c.id)) {
            acc.push(c.id);
          }

          c.ChildTopics.forEach((cc) => {
            if (initialValues.includes(cc.id)) {
              acc.push(cc.fk_parentTopicId);
              acc.push(cc.id);
            }
          });

          return acc;
        }, []);

        if ((initialValues.includes(topic.id) || children.length) && !expanded.includes(topic.id)) {
          ids.push(topic.id);
        }

        ids = ids.concat(children);
      });

      setExpanded((e) => Array.from(new Set(e.concat(ids))));
    }
  }, [initialValues, topics]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="form-dialog-title">
          <Box display="flex">
            <Box flex={2}>{translate('resources.topics.filter_by_topics')}</Box>
            <Box flex={1} textAlign="right">
              {loading > 0 && <CircularProgress color="primary" size={20} />}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {topics.map((record, i) => (
                <Row
                  key={i}
                  record={record}
                  {...{
                    selected,
                    toggleSelected,
                    expanded,
                    toggleExpanded,
                  }}
                />
              ))}
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
          <Button onClick={onClose} color="secondary" variant="outlined" size="small">
            {translate('misc.cancel')}
          </Button>
          <Button onClick={() => onConfirm(selected)} color="primary" variant="outlined" size="small">
            {translate('misc.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
