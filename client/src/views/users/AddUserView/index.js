import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import UserForm from './UserForm';
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
      title={id ? 'Edit User' : 'Add User'}
    >
      <Container className="usmannnnnnn" >
        <Header />
        <Box mt={3}>
          {<UserForm />}
        </Box>
      </Container>
    </Page>
  );
};

export default AddUserView;
