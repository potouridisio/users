import React from 'react';
import { useRecoilState } from 'recoil';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';

import { AccountSelect } from '../account-select/AccountSelect';
import { ApplicationList } from '../application-list/ApplicationList';
import { openState } from './atoms';

export function FormDrawer() {
  const [open, setOpen] = useRecoilState(openState);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer onClose={handleClose} open={open}>
      <List>
        <ListItem>
          <TextField autoFocus fullWidth label="First name" margin="normal" />
        </ListItem>
        <ListItem>
          <TextField fullWidth label="Last name" margin="normal" />
        </ListItem>
        <ListItem>
          <TextField
            fullWidth
            label="Email address"
            margin="normal"
            type="email"
          />
        </ListItem>
        <ListItem>
          {' '}
          <AccountSelect />
        </ListItem>
        <ListItem>
          <ApplicationList />
        </ListItem>
      </List>
    </Drawer>
  );
}
