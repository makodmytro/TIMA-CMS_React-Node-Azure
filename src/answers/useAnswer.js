import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  useDataProvider,
  useNotify,
} from 'react-admin';

const useAnswer = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const dataProvider = useDataProvider();
  const dispatch = useDispatch();
  const notify = useNotify();
  const answer = useSelector((state) => {
    return state.custom?.answers?.data[id];
  });

  const refresh = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await dataProvider.getOne('answers', { id });

      dispatch({
        type: 'CUSTOM_SET_ANSWER',
        payload: {
          id, data,
        },
      });
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }

    setLoading(false);
  };

  return { answer, loading, refresh };
};

export default useAnswer;
