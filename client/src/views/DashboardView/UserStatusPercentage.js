import React, { useEffect } from 'react';
import Chart from 'react-google-charts';
import { useDispatch, useSelector } from 'src/store';
import { getUsers } from 'src/slices/users';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark
  }
}));

const UserStatusPercentage = () => {
  const classes = useStyles();
  const { users } = useSelector(state => state.users);
  const dispatch = useDispatch();

  const activatedCount = users.filter(item => item.status === 'ACTIVATED').length;
  const deactivatedCount = users.filter(item => item.status === 'DEACTIVATED').length;
  const deletedCount = users.filter(item => item.status === 'DELETED').length;


  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="PieChart"
        loader={
          <div>
            {' '}
            <CircularProgress />{' '}
          </div>
        }
        data={[
          ['Status', 'Status Percentage'],
          ['Activated', activatedCount],
          ['Deactived', deactivatedCount],
          ['Deleted', deletedCount],
        ]}
        options={{
          title: 'User Account Satus Percentage Graph',
          is3d: true
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
};

export default UserStatusPercentage;
