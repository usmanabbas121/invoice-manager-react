import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import InvoiceForm from './InvoiceForm';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const AddUserView = () => {
  const classes = useStyles();
  const { id } = useParams();
  return (
    <Page
      className={classes.root}
      title={id ? 'Edit Invoice' : 'Add Invoice'}
    >
      <Container className="usmannnnnnn" >
        <Header />
        <Box mt={3}>
          {<InvoiceForm />}
        </Box>
      </Container>
    </Page>
  );
};

export default AddUserView;
