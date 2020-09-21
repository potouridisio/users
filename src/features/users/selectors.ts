import qs from 'qs';
import { selectorFamily } from 'recoil';

import { orderByState, orderState, pageState, statusState } from './atoms';

const paramsState = selectorFamily({
  get: (debouncedSearchText: string) => ({ get }) => {
    const order = get(orderState);
    const orderBy = get(orderByState);
    const page = get(pageState);
    const status = get(statusState);

    return {
      direction: order,
      page: page + 1,
      search: debouncedSearchText || null,
      sort_by: orderBy,
      status,
    };
  },
  key: 'paramsState',
});

export const paramsStringState = selectorFamily({
  get: (debouncedSearchText: string) => ({ get }) => {
    return qs.stringify(get(paramsState(debouncedSearchText)), {
      addQueryPrefix: true,
      skipNulls: true,
    });
  },
  key: 'paramsStringState',
});
