import React, { useState, useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import UsersListing from './UsersListing';
import { ConfirmProvider } from 'material-ui-confirm';
import { useDispatch, useSelector } from 'src/store';
import { getUsers } from 'src/slices/users';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function UsersListView() {
  const classes = useStyles();
  const { users } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const [view, setView] = useState('All');

  const adminUsers = users.filter(item => item.role === 'ADMIN');
  const managerUsers = users.filter(item => item.role === 'MANAGER');

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <Page className={classes.root} title="Manage Users">
      <Container maxWidth={false}>
        <Header changeView={view => setView(view)} />
        <ConfirmProvider>
          <Box mt={3}>
            {view === 'All' && <UsersListing users={users} />}
            {view === 'ADMIN' && <UsersListing users={adminUsers} />}
            {view === 'MANAGER' && <UsersListing users={managerUsers} />}
          </Box>
        </ConfirmProvider>
      </Container>
    </Page>
  );
}

export default UsersListView;
