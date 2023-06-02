import { baseApi } from '../httpClient';

const keywordDataProvider = {
  create: (textId, languageId, text) => {
    const url = `${baseApi}/sourcese`;
    const data = {
      fk_sourceTextId: textId,
      fk_languageId: languageId,
      text,
    };
  },
};

export default keywordDataProvider;
