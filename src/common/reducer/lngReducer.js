const initialState = {
  language: localStorage.getItem('language') || '',
};

export const setLanguage = (lng) => ({
  type: 'SET_LANGUAGE',
  payload: lng,
});

export default (previousState = initialState, { type, payload }) => {
  if (type === 'SET_LANGUAGE') {
    localStorage.setItem('language', payload);
    return {
      ...previousState,
      language: payload,
    };
  }

  return previousState;
};
