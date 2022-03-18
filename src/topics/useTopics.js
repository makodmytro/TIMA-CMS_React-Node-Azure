import React from 'react';
import { useDataProvider } from 'react-admin';
import { useSelector, useDispatch } from 'react-redux';

export const useTopicsTree = () => {
  const dataProvider = useDataProvider();
  const dispatch = useDispatch();
  const topics = useSelector((state) => state.custom.topicsTree);
  const timestamp = useSelector((state) => state.custom.topicsTreeTimestamp);
  const loading = useSelector((state) => state.custom.loading);

  const fetch = async () => {
    dispatch({ type: 'CUSTOM_TOPICS_TREE_FETCH_REQUEST' });

    try {
      const { data } = await dataProvider.topicTree('topics', {
        pagination: { perPage: 200, page: 1 },
      });

      dispatch({ type: 'CUSTOM_TOPICS_TREE_FETCH_SUCCESS', payload: data });
    } catch (e) {
      dispatch({ type: 'CUSTOM_TOPICS_TREE_FETCH_FAILED' });
    }
  };

  React.useEffect(() => {
    const now = +new Date();

    if (!loading) {
      if (!topics.length || (!timestamp || (now - timestamp) / 1000 > 120)) {
        fetch();
      }
    }
  }, []);

  return { topics, fetch, loading };
};
