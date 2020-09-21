import { atom } from 'recoil';
import { Data } from './ApplicationList';

export const checkedState = atom<Data[]>({
  default: [],
  key: 'checkedState',
});
