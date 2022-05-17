import * as React from 'react';
import { cloneElement } from 'react';
import {
  CreateButton,
  ExportButton,
  sanitizeListRestProps,
  TopToolbar,
  useListContext,
} from 'react-admin';
import ColumnConfig from './ColumnConfig';
import defaultColumns from '../../default-columns.json';
import { useDisabledCreate, useIsAdmin } from '../../hooks';

const DEFAULT_COLUMNS_ANSWERS = process.env.REACT_APP_DEFAULT_COLUMNS_ANSWERS || null;
const DEFAULT_COLUMNS_QUESTIONS = process.env.REACT_APP_DEFAULT_COLUMNS_QUESTIONS || null;
const DEFAULT_COLUMNS_TOPICS = process.env.REACT_APP_DEFAULT_COLUMNS_TOPICS || null;
const DEFAULT_COLUMNS_LANGUAGES = process.env.REACT_APP_DEFAULT_COLUMNS_LANGUAGES || null;
const DEFAULT_COLUMNS_SESSIONS = process.env.REACT_APP_DEFAULT_COLUMNS_SESSIONS || null;
const DEFAULT_COLUMNS_USERS = process.env.REACT_APP_DEFAULT_COLUMNS_USERS || null;
const DEFAULT_COLUMNS_GROUPS = process.env.REACT_APP_DEFAULT_COLUMNS_GROUPS || null;

const config = {
  answers: DEFAULT_COLUMNS_ANSWERS ? DEFAULT_COLUMNS_ANSWERS.split(',') : null,
  questions: DEFAULT_COLUMNS_QUESTIONS ? DEFAULT_COLUMNS_QUESTIONS.split(',') : null,
  topics: DEFAULT_COLUMNS_TOPICS ? DEFAULT_COLUMNS_TOPICS.split(',') : null,
  languages: DEFAULT_COLUMNS_LANGUAGES ? DEFAULT_COLUMNS_LANGUAGES.split(',') : null,
  sessions: DEFAULT_COLUMNS_SESSIONS ? DEFAULT_COLUMNS_SESSIONS.split(',') : null,
  users: DEFAULT_COLUMNS_USERS ? DEFAULT_COLUMNS_USERS.split(',') : null,
  groups: DEFAULT_COLUMNS_GROUPS ? DEFAULT_COLUMNS_GROUPS.split(',') : null,
};

export const getVisibleColumns = (columns, resource, defaults = []) => {
  const savedConfig = localStorage.getItem(`tima-cms-columns-${resource}`);

  if (savedConfig) {
    return JSON.parse(savedConfig);
  }

  if (defaults.length > 0) {
    return columns.filter((c) => defaults.includes(c.key)).map((c) => c.key);
  }

  if (config[resource] && config[resource].length) {
    return columns.filter((c) => config[resource].includes(c.key)).map((c) => c.key);
  }

  if (defaultColumns && defaultColumns[resource] && defaultColumns[resource].length) {
    return columns.filter((c) => defaultColumns[resource].includes(c.key)).map((c) => c.key);
  }

  return columns.filter((c) => c.key !== 'updatedAt').map((c) => c.key);
};

export const handleColumnsChange = (resource, callback) => (columns) => {
  localStorage.setItem(`tima-cms-columns-${resource}`, JSON.stringify(columns));
  callback(columns);
};

const ListActions = (props) => {
  const {
    className,
    exporter,
    filters,
    maxResults,
    columns,
    visibleColumns,
    onColumnsChange,
    createButtonLabel,
    ...rest
  } = props;
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    basePath,
    showFilter,
    total,
  } = useListContext();
  let disabled = false;

  if (resource === 'questions' || resource === 'answers') {
    disabled = useDisabledCreate();
  } else if (['topics', 'languages', 'users', 'groups', 'audit'].includes(resource)) {
    disabled = !useIsAdmin();
  }

  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters && cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      })}
      { /* some rendering bug probably */ }
      { disabled && <CreateButton basePath={basePath} disabled {...(createButtonLabel ? { label: createButtonLabel } : {})} />}
      { !disabled && <CreateButton basePath={basePath} {...(createButtonLabel ? { label: createButtonLabel } : {})} />}

      <ExportButton
        disabled={total === 0 || disabled}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
      {columns && (
        <ColumnConfig
          resource={resource}
          columns={columns}
          visible={visibleColumns}
          onChange={onColumnsChange}
        />
      )}

    </TopToolbar>
  );
};

export default ListActions;
