import { atom } from 'recoil';

import { Data } from './AccountSelect';

export const valueState = atom<Data | null>({
  default: null,
  key: 'valueState',
});
