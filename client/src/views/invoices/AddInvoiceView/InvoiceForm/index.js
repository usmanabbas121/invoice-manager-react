import React, { useEffect } from 'react';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';
import FormFields from './FormFields';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'src/store';
import { getInvoices } from 'src/slices/invoices';

const useStyles = makeStyles(() => ({
  root: {}
}));

const UserForm = ({ className, ...rest }) => {
  const classes = useStyles();
  const { invoices } = useSelector(state => state.invoices);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const activeInvoice = invoices.find(item => item.invoice_id == id);

  return (
    <Grid className={clsx(classes.root, className)} container {...rest}>
      <Grid item lg={12} md={6} xl={9} xs={12}>   
        <FormFields invoice={activeInvoice ? activeInvoice : ''} />
      </Grid>
    </Grid>
  );
};

UserForm.propTypes = {
  className: PropTypes.string
};

export default UserForm;
