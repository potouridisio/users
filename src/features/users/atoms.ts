import { atom } from 'recoil';

import { Data } from './Users';

export const countState = atom({
  default: 0,
  key: 'countState',
});

type Order = 'asc' | 'desc';

export const orderState = atom<Order>({
  default: 'desc',
  key: 'orderState',
});

export const orderByState = atom<keyof Data>({
  default: 'id',
  key: 'orderByState',
});

export const pageState = atom({
  default: 0,
  key: 'pageState',
});

export const searchTextState = atom({
  default: '',
  key: 'searchTextState',
});

export type Status = 'active' | 'inactive' | null;

export const statusState = atom<Status>({
  default: null,
  key: 'statusState',
});
