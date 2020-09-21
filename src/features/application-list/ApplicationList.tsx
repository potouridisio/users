import includes from 'ramda/src/includes';
import symmetricDifference from 'ramda/src/symmetricDifference';
import React from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import useSWR from 'swr';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MuiListItemText, {
  ListItemTextProps,
} from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Skeleton from '@material-ui/lab/Skeleton';

import { valueState as selectedAccountState } from '../account-select/atoms';
import { checkedState } from './atoms';

export interface Data {
  id: number;
  name: string;
  sfid: string;
}

interface Response {
  applications: Data[];
  meta: { search: string | null; total: number };
}

function ListItemText({ primary, ...rest }: ListItemTextProps) {
  return (
    <MuiListItemText {...rest} primary={primary || <Skeleton width="25%" />} />
  );
}

export function ApplicationList() {
  const [checked, setChecked] = useRecoilState(checkedState);
  const selectedAccount = useRecoilValue(selectedAccountState);
  const resetChecked = useResetRecoilState(checkedState);
  const shouldFetch = selectedAccount?.sfid !== undefined;
  const { data } = useSWR<Response>(
    shouldFetch
      ? '/api/v1/applications?account_sfid' + selectedAccount?.sfid
      : null
  );

  React.useEffect(() => {
    return function cleanup() {
      resetChecked();
    };
  }, [resetChecked]);

  const handleToggle = (application: Data) => () => {
    setChecked(symmetricDifference([application]));
  };

  if (!shouldFetch) return null;

  return (
    <List
      subheader={
        <ListSubheader disableGutters disableSticky>
          Assign access
        </ListSubheader>
      }
    >
      {(data?.applications || Array.from({ length: 10 })).map(
        (application, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem
              button
              key={index}
              divider
              onClick={handleToggle(application)}
              role={undefined}
            >
              <ListItemIcon>
                <Checkbox
                  disabled={application === undefined}
                  disableRipple
                  checked={includes(application, checked)}
                  edge="start"
                  inputProps={{ 'aria-labelledby': labelId }}
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={application?.name} />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={<Switch />}
                  disabled={
                    application === undefined || !includes(application, checked)
                  }
                  label="Admin"
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        }
      )}
    </List>
  );
}
