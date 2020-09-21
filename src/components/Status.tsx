import React from 'react';
import { useRecoilState } from 'recoil';

import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';

import { Status as StatusType, statusState } from '../features/users/atoms';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

export const Status = React.memo(() => {
  const [status, setStatus] = useRecoilState(statusState);
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEqual = event.target.name === status;
    setStatus(isEqual ? null : (event.target.name as StatusType));
  };

  return (
    <FormControl className={classes.formControl} component="fieldset">
      <FormLabel component="legend" focused={false}>
        Status
      </FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={status === 'active'}
              name="active"
              onChange={handleChange}
            />
          }
          label="Active"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={status === 'inactive'}
              name="inactive"
              onChange={handleChange}
            />
          }
          label="Inactive"
        />
      </FormGroup>
    </FormControl>
  );
});
