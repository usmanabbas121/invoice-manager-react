import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Divider,
  makeStyles
} from '@material-ui/core';
import Receipt from '@material-ui/icons/Receipt';
import { useDispatch, useSelector } from 'src/store';
import { getInvoices } from 'src/slices/invoices';

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

const TotalInvoices = ({ className, ...rest }) => {
  const classes = useStyles();
  const { invoices } = useSelector(state => state.invoices);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead key="thead">
          <TableRow>
            <TableCell align="center">
              <Receipt color="primary" />{' '}
              <Divider className={classes.divider} /> Total Invoices
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody key="tbody">
          <TableRow>
            <TableCell align="center">{invoices.length}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TotalInvoices.propTypes = {
  className: PropTypes.string
};

export default TotalInvoices;
