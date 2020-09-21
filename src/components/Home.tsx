import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';

import { FormDrawer } from '../features/form-drawer/FormDrawer';
import { Users } from '../features/users/Users';
import { Status } from './Status';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawer: {
    flexShrink: 0,
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  root: {
    display: 'flex',
  },
}));

export function Home() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Drawer
          anchor="left"
          className={classes.drawer}
          classes={{ paper: classes.drawerPaper }}
          variant="permanent"
        >
          <Status />
        </Drawer>
        <main className={classes.content}>
          <Users />
        </main>
      </div>

      <FormDrawer />
    </React.Fragment>
  );
}

export default Home;
