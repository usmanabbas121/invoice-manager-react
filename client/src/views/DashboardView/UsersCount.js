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
import BusinessCenterIcon from '@material-ui/icons/SupervisorAccount';
import EventBusyIcon from '@material-ui/icons/Person';
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

const UsersCount = ({ className, ...rest }) => {
  const { users } = useSelector(state => state.users);
  const classes = useStyles();
  const dispatch = useDispatch();

  const adminCount = users.filter(item => item.role === 'ADMIN').length;
  const managerCount = users.filter(item => item.role === 'MANAGER').length;

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
              Admin Users
            </TableCell>
            <TableCell align="center">
              <EventBusyIcon color="primary" />{' '}
              <Divider className={classes.divider} />
              Manager Users
            </TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody key="tbody">
          <TableRow>
            <TableCell align="center">{adminCount}</TableCell>
            <TableCell align="center">{managerCount}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

UsersCount.propTypes = {
  className: PropTypes.string
};

export default UsersCount;
