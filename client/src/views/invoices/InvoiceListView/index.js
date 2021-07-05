import React, { useState } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from '../../../components/Page';
import Header from './Header';
import ListViewListing from './ListView';
import FolderViewListing from './FolderView';
import { ConfirmProvider } from 'material-ui-confirm';
import useAuth from 'src/hooks/useAuth';
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function ListView() {
  const classes = useStyles();
  const [view, setView] = useState('list');
  const { user } = useAuth();
  return (
    <Page className={classes.root} title="Manage Invoices">
      <ConfirmProvider>
        <Container maxWidth="lg">
          <Header user={user} changeView={view => setView(view)} />
          {user.role === 'ADMIN' && view === 'tree' ? (
            <FolderViewListing user={user} />
          ) : (
            <ListViewListing user={user} />
          )}
        </Container>
      </ConfirmProvider>
    </Page>
  );
}

export default ListView;
