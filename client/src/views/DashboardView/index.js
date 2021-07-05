import React from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  makeStyles,
} from '@material-ui/core';

import Page from '../../components/Page';
import Header from './Header';
import TotalInvoices from './TotalInvoices';
import TotalSatus from './TotalStatus';
import UsersCount from './UsersCount';
import InvoiceCurrencyPercentage from './InvoiceCurrencyPercentage';
import UserStatusPercentage from './UserStatusPercentage';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const DashboardView = () => {
  const classes = useStyles();
  const { user } = useAuth();

  console.log('31', user.role);
  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Header />
        {(user.role === 'ADMIN' || user.role === 'ENGINEER') && (
          <Grid container spacing={3}>
            <Grid item lg={4} sm={6} xs={12}>
              <UsersCount />
            </Grid>
            <Grid item lg={4} sm={6} xs={12}>
              <TotalSatus/>
            </Grid>
            <Grid item lg={4} sm={6} xs={12}>
              <TotalInvoices />
            </Grid>
            <Grid item lg={6} xs={12}>
              <UserStatusPercentage />
              <Card></Card>
            </Grid> 
            <Grid item lg={6} xs={12}>
              <Card>
                <InvoiceCurrencyPercentage />
              </Card>
            </Grid>   

          </Grid>
        )}
      </Container>
    </Page>
  );
};

export default DashboardView;
