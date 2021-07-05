import React, { useEffect } from 'react';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';
import FormFields from './FormFields';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'src/store';
import { getUsers } from 'src/slices/users';

const useStyles = makeStyles(() => ({
  root: {}
}));

const UserForm = ({ className, ...rest }) => {
  const classes = useStyles();
  const { users } = useSelector(state => state.users);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const activeUser = users.find(item => item.user_id == id);

  return (
    <Grid className={clsx(classes.root, className)} container {...rest}>
      <Grid item lg={12} md={6} xl={9} xs={12}>   
        <FormFields user={activeUser ? activeUser : ''} />
      </Grid>
    </Grid>
  );
};

UserForm.propTypes = {
  className: PropTypes.string
};

export default UserForm;
