import React, { useEffect } from 'react';
import Chart from 'react-google-charts';
import { useDispatch, useSelector } from 'src/store';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';
import { getInvoices } from 'src/slices/invoices';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark
  }
}));

const InvoiceCurrencyPercentage = () => {
  const classes = useStyles();
  const { invoices } = useSelector(state => state.invoices);
  const dispatch = useDispatch();

  const totalInvoicesLength = invoices.length;

  const USDCount = invoices.filter(item => item.currency === 'USD').length;
  const EURCount = invoices.filter(item => item.currency === 'EUR').length;
  const GBPCount = invoices.filter(item => item.currency === 'GBP').length;
  const PKRCount = invoices.filter(item => item.currency === 'PKR').length;

  useEffect(() => {
    dispatch(getInvoices());
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
          ['Currency', 'no of invoices'],
          ['USD', USDCount],
          ['EUR', EURCount],
          ['GBP', GBPCount],
          ['PKR', PKRCount],
        ]}
        options={{
          title: ' Invoice Currency Percentage Graph',
          is3d: true
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
};

export default InvoiceCurrencyPercentage;
