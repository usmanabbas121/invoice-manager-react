import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_URL } from 'src/constants';

const initialState = {
    invoices: [],
    invoicedetails: [],
    invoicesperday: [],
    invoicesclientwise: [],
    invoicesservicewise: []
  };
  
  const slice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
      getInvoices(state, action) {
        const { invoices } = action.payload;
        state.invoices = invoices;
      },
      InvoiceDetails(state, action) {
        const { invoicedetails } = action.payload;
        state.invoicedetails = invoicedetails;
      },
      InvoicesPerDay(state, action){
        const { invoicesperday } = action.payload;
        state.invoicesperday = invoicesperday;
      },
      InvoicesClientWise(state, action){
        const { invoicesclientwise } = action.payload;
        state.invoicesclientwise = invoicesclientwise;
      },
      InvoicesServiceWise(state, action){
        const { invoicesservicewise } = action.payload;
        state.invoicesservicewise = invoicesservicewise;
      }
  
    }
  });

  export const reducer = slice.reducer;

  export const getInvoices = () => async dispatch => {
    const response = await axios.get(SERVER_URL + '/api/invoice/invoice-list');
    dispatch(slice.actions.getInvoices(response.data));
  };

  export const InvoiceDetails = id => async dispatch => {
    const response = await axios.get(
      SERVER_URL + '/api/invoice/invoice-details-page/' + id
    );
    dispatch(slice.actions.InvoiceDetails(response.data));
  };

  export const InvoicesPerDay = () => async dispatch => {
    const response = await axios.get(SERVER_URL + '/api/invoice/invoices-per-day');
    dispatch(slice.actions.InvoicesPerDay(response.data));
  };

  export const InvoicesClientWise = () => async dispatch => {
    const response = await axios.get(SERVER_URL + '/api/invoice/invoices-client-wise');
    dispatch(slice.actions.InvoicesClientWise(response.data));
  };

  export const InvoicesServiceWise = () => async dispatch => {
    const response = await axios.get(SERVER_URL + '/api/invoice/invoices-service-wise');
    dispatch(slice.actions.InvoicesServiceWise(response.data));
  };
  

  export default slice;