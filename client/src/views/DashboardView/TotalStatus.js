import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
  makeStyles
} from '@material-ui/core';
import BusinessCenterIcon from '@material-ui/icons/AirplanemodeInactive';

import FindReplaceIcon from '@material-ui/icons/Delete';
import EventBusyIcon from '@material-ui/icons/AirplanemodeActive';
import { useDispatch, useSelector } from 'src/store';
import { getUsers } from 'src/slices/users';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    marginLeft: theme.spacing(1)
  },

  divider: {
    background: 'transparent'
  }
}));

const TotalSatus = ({ className, ...rest }) => {
  const { users } = useSelector(state => state.users);
  const classes = useStyles();
  const dispatch = useDispatch();

  const activeCount = users.filter(item => item.status === 'ACTIVATED').length;
  const deactiveCount = users.filter(item => item.status === 'DEACTIVATED').length;
  const deleteCount = users.filter(item => item.status === 'DELETED').length;

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead key="thead">
          <TableRow>
            <TableCell align="center">
              <BusinessCenterIcon color="primary" />{' '}
              <Divider className={classes.divider} />
              Activated 
            </TableCell>
            <TableCell align="center">
              <EventBusyIcon color="primary" />{' '}
              <Divider className={classes.divider} />
              Deactivated
            </TableCell>
            <TableCell align="center">
              <FindReplaceIcon color="primary" />{' '}
              <Divider className={classes.divider} />
              Deleted
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody key="tbody">
          <TableRow>
            <TableCell align="center">{activeCount}</TableCell>
            <TableCell align="center">{deactiveCount}</TableCell>
            <TableCell align="center">{deleteCount}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TotalSatus.propTypes = {
  className: PropTypes.string
};

export default TotalSatus;
