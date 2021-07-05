import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'src/store';
import { getInvoices } from 'src/slices/invoices';
import { InvoicesPerDay } from 'src/slices/invoices';
import { InvoicesClientWise } from 'src/slices/invoices';
import { InvoicesServiceWise } from 'src/slices/invoices';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { SERVER_URL } from 'src/constants';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { AiFillFolder } from 'react-icons/ai';
import { AiFillFolderOpen } from 'react-icons/ai';
import {
  Box,
  Card,
  Link,
  IconButton,
  SvgIcon,
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.light
  },
  tree: {
    height: window.innerHeight - 200,
    flexGrow: 1
  }
}));

const Results = ({ className, user, products, ...rest }) => {
  const classes = useStyles();
  const { invoices } = useSelector(state => state.invoices);
  const { invoicesperday } = useSelector(state => state.invoices);
  const { invoicesclientwise } = useSelector(state => state.invoices);
  const { invoicesservicewise } = useSelector(state => state.invoices);
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  let filteredInvoices = [];
  filteredInvoices =
    user.role === 'ADMIN'
      ? invoices
      : invoices.filter(el => el.created_by === user.id);

  var a = Math.floor(Math.random() * 100000 + 1);
  var b = Math.floor(Math.random() * 100000 + 120);
  var c = Math.floor(Math.random() * 100000 + 180);

  useEffect(() => {
    dispatch(getInvoices());
    dispatch(InvoicesPerDay());
    dispatch(InvoicesClientWise());
    dispatch(InvoicesServiceWise());

  }, [dispatch]);

const deleteThisInvoice = (event, id) => {
    const requestOptions = {
      method: 'DELETE'
    };
    const userStorage = JSON.parse(localStorage.getItem('user'));

    confirm({ description: `This action will delete this invoice ` })
      .then(() =>
        fetch(
          SERVER_URL + '/api/invoice/delete/' + id + '/' + userStorage.user_id,
          requestOptions
        )
          .then(response => {
            return response.json();
          })
          .then(result => {
            // do what you want with the response here
            enqueueSnackbar('Invoice deleted successfully', {
              variant: 'success'
            });
            dispatch(getInvoices());
            // window.location.reload();
          })
      )
      .catch(() => console.log('Deletion cancelled.'));
  };

  const calculateDateFormate = currentDate => {
    const date = new Date(currentDate);

    var mm = date.getMonth() + 1; //January is 0!
    var yyyy = date.getFullYear();
    var dd = date.getDate();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
          mm = '0' + mm;
    }
        //return dd + '/' + mm + '/' + yyyy;
    return mm + '/' + dd + '/' +yyyy;
  };

  return (
    <Card className={classes.root} {...rest}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right" width="10%">
                Client
            </TableCell>
            <TableCell align="right" width="10%">
                Team Lead
            </TableCell>
            <TableCell align="right" width="10%">
                Company
            </TableCell>
            <TableCell align="right" width="10%">
                Service
            </TableCell>
            <TableCell align="right" width="10%">
                Project
            </TableCell>
            <TableCell align="center" width="10%">
                Rate
            </TableCell>
            <TableCell align="center" width="10%">
                Hours
            </TableCell>
            <TableCell align="center" width="10%">
                Currency
            </TableCell>
            <TableCell align="center" width="10%">
                Amount
            </TableCell>
            <TableCell align="left" width="10%">
                Actions
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <PerfectScrollbar>
        <Box minWidth={1200}>
          {filteredInvoices.length > 0 ? (
            <TreeView
              className={classes.tree}
              defaultCollapseIcon={<AiFillFolderOpen />}
              defaultExpandIcon={<AiFillFolder />}
              defaultExpanded={['5','6','7']}
            >
              <TreeItem nodeId="5" label="Date Wise Invoices">
                    {invoicesperday.map(invoice_Date => {
                      var folderdata = filteredInvoices.filter(
                        item => calculateDateFormate(item.created_at)  === invoice_Date.date
                      );
                      var y = Math.floor(Math.random() * 100000 + 1);
                      var z = Math.floor(Math.random() * 100000 + 1);

                      return (
                        <TreeItem nodeId={a + y}  label={invoice_Date.date}>
                          {folderdata.map(invoice_single => {
                            return (
                              <TreeItem
                                nodeId={a + z}
                                label={
                                  <Table>
                                    <TableBody>
                                      <TableRow hover>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.client_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.team_lead_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.company_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.service_provider}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.project_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.rate}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.time_duration}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.currency}
                                        </TableCell>
                                        <TableCell align="left" width="5%">
                                            {invoice_single.total}
                                        </TableCell>
                                        {user.status === 'ACTIVATED' &&

                                              <TableCell align="left" width="15%">   
                                              <Link
                                                  component={RouterLink}
                                                  to={'/app/edit-invoice/' + invoice_single.invoice_id}
                                              >
                                                  <IconButton>
                                                      <SvgIcon fontSize="small">
                                                      <EditIcon />
                                                      </SvgIcon>
                                                  </IconButton>
                                              </Link>

                                              <Link
                                                  component={RouterLink}
                                                  to={'/app/invoice/' + invoice_single.invoice_id}
                                              >
                                                  <IconButton>
                                                  <SvgIcon fontSize="small">
                                                      <VisibilityIcon />
                                                  </SvgIcon>
                                                  </IconButton>
                                              </Link>

                                              <IconButton
                                                  onClick={e => deleteThisInvoice(e, invoice_single.invoice_id)}
                                              >
                                                  <SvgIcon fontSize="small">
                                                  <DeleteIcon />
                                                  </SvgIcon>
                                              </IconButton>
                                              </TableCell>

                                        }
                                          </TableRow>
                                    </TableBody>
                                  </Table>
                                }
                              />
                            );
                          })}
                        </TreeItem>
                      );
                    })}
                  </TreeItem>
                  <br/>
                  <TreeItem nodeId="6" label="Client Wise Invoices">
                    {invoicesclientwise.map(invoice_client => {
                      var folderdata = filteredInvoices.filter(
                        item => item.client_name  === invoice_client.client_name
                      );
                      var y = Math.floor(Math.random() * 100000 + 1);
                      var z = Math.floor(Math.random() * 100000 + 1);

                      return (
                        <TreeItem nodeId={b + y}  label={invoice_client.client_name}>
                          {folderdata.map(invoice_single => {
                            return (
                              <TreeItem
                                nodeId={b + z}
                                label={
                                  <Table>
                                    <TableBody>
                                      <TableRow hover>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.client_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.team_lead_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.company_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.service_provider}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.project_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.rate}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.time_duration}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.currency}
                                        </TableCell>
                                        <TableCell align="left" width="5%">
                                            {invoice_single.total}
                                        </TableCell>
                                        {user.status === 'ACTIVATED' &&
                                           <TableCell align="left" width="15%">   
                                            <Link
                                                component={RouterLink}
                                                to={'/app/edit-invoice/' + invoice_single.invoice_id}
                                            >
                                                <IconButton>
                                                    <SvgIcon fontSize="small">
                                                    <EditIcon />
                                                    </SvgIcon>
                                                </IconButton>
                                            </Link>
                                        
                                            <Link
                                                component={RouterLink}
                                                to={'/app/invoice/' + invoice_single.invoice_id}
                                            >
                                                <IconButton>
                                                <SvgIcon fontSize="small">
                                                    <VisibilityIcon />
                                                </SvgIcon>
                                                </IconButton>
                                            </Link>

                                            <IconButton
                                                onClick={e => deleteThisInvoice(e, invoice_single.invoice_id)}
                                            >
                                                <SvgIcon fontSize="small">
                                                <DeleteIcon />
                                                </SvgIcon>
                                            </IconButton>
                                        </TableCell>
                                        }
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                }
                              />
                            );
                          })}
                        </TreeItem>
                      );
                    })}
                  </TreeItem>
                  <br/>
                  <TreeItem nodeId="7" label="Service Wise Invoices">
                    {invoicesservicewise.map(invoice_service => {
                      var folderdata = filteredInvoices.filter(
                        item => item.service_provider  === invoice_service.service_provider
                      );
                      var y = Math.floor(Math.random() * 100000 + 1);
                      var z = Math.floor(Math.random() * 100000 + 1);

                      return (
                        <TreeItem nodeId={c + y}  label={invoice_service.service_provider}>
                          {folderdata.map(invoice_single => {
                            return (
                              <TreeItem
                                nodeId={c + z}
                                label={
                                  <Table>
                                    <TableBody>
                                      <TableRow hover>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.client_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.team_lead_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.company_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.service_provider}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.project_name}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.rate}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.time_duration}
                                        </TableCell>
                                        <TableCell align="left" width="10%">
                                            {invoice_single.currency}
                                        </TableCell>
                                        <TableCell align="left" width="5%">
                                            {invoice_single.total}
                                        </TableCell>
                                        {user.status === 'ACTIVATED' &&
                                        <TableCell align="left" width="15%">   
                                            <Link
                                                component={RouterLink}
                                                to={'/app/edit-invoice/' + invoice_single.invoice_id}
                                            >
                                                <IconButton>
                                                    <SvgIcon fontSize="small">
                                                    <EditIcon />
                                                    </SvgIcon>
                                                </IconButton>
                                            </Link>
                                        
                                            <Link
                                                component={RouterLink}
                                                to={'/app/invoice/' + invoice_single.invoice_id}
                                            >
                                                <IconButton>
                                                <SvgIcon fontSize="small">
                                                    <VisibilityIcon />
                                                </SvgIcon>
                                                </IconButton>
                                            </Link>

                                            <IconButton
                                                onClick={e => deleteThisInvoice(e, invoice_single.invoice_id)}
                                            >
                                                <SvgIcon fontSize="small">
                                                <DeleteIcon />
                                                </SvgIcon>
                                            </IconButton>
                                        </TableCell>
                                        }
                                     </TableRow>
                                    </TableBody>
                                  </Table>
                                }
                              />
                            );
                          })}
                        </TreeItem>
                      );
                    })}
                  </TreeItem>
                 

            </TreeView>
          ) : (
            <h1 align="center">No Invoice Found!</h1>
          )}
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};
Results.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array.isRequired
};

Results.defaultProps = {
  products: []
};
export default Results;
