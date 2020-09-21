import React from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import useSWR from 'swr';

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useDebounce } from '../../utils/useDebounce';
import { valueState } from './atoms';

export interface Data {
  descr: string | null;
  id: number;
  name: string;
  sfid: string;
}

interface Response {
  accounts: Data[];
  meta: { search: string; total: number };
}

export function AccountSelect() {
  const [inputValue, setInputValue] = React.useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const [value, setValue] = useRecoilState(valueState);
  const resetValue = useResetRecoilState(valueState);
  const shouldFetch = ![debouncedInputValue, inputValue].includes(
    value?.name || ''
  );
  const { data } = useSWR<Response>(
    shouldFetch ? '/api/v1/accounts?search=' + debouncedInputValue : null
  );
  const loading = shouldFetch && data === undefined;

  React.useEffect(() => {
    return function cleanup() {
      resetValue();
    };
  }, [resetValue]);

  return (
    <Autocomplete
      fullWidth
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => option.name === value.name}
      inputValue={inputValue}
      loading={loading}
      onChange={(_event, newValue) => {
        setValue(newValue);
      }}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={data?.accounts || []}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          label="Account"
          margin="normal"
        />
      )}
      value={value}
    />
  );
}
