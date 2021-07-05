import React, { useEffect,useState } from 'react';
import { Grid, Container, Breadcrumbs, makeStyles,Button } from '@material-ui/core';
import Page from '../../../components/Page';
import MainTabs from './MainTabs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { InvoiceDetails} from 'src/slices/invoices';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  root2:{
      marginTop:20
  }
}));

const ManageUsers = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { invoicedetails } = useSelector(state => state.invoices);
  const dispatch = useDispatch();
    
  useEffect(() => {
    dispatch(InvoiceDetails(id));
  }, [dispatch,id]);

  return (
    <Page className={classes.root} title="Case Detail">
      <Container maxWidth="lg">
        <Grid spacing={5}>
            {invoicedetails && invoicedetails.length >0 &&
                <Grid item md={12}>
                <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                >
                <h3>Invoice # {invoicedetails[0].invoice_id}</h3>
                <br />
                </Breadcrumbs>
            </Grid>
           }
          <Grid item md={12} className={classes.root2}>
            <MainTabs />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ManageUsers;
