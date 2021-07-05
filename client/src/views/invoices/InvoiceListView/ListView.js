import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Link,
  Card,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles
} from '@material-ui/core';
import { Edit as EditIcon } from 'react-feather';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'src/store';
import { getInvoices } from 'src/slices/invoices';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { SERVER_URL } from 'src/constants';

const useStyles = makeStyles(theme => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 500
  },
  categoryField: {
    flexBasis: 200
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));
const ListViewListing = ({ className, user, ...rest }) => {
  const classes = useStyles();
  const { invoices } = useSelector(state => state.invoices);
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  let filteredInvoices = [];
  filteredInvoices =
    user.role === 'ADMIN'
      ? invoices
      : invoices.filter(el => el.created_by === user.id);

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const deleteThisInvoice = (event, id) => {
    const requestOptions = {
      method: 'DELETE'
    };
    const userStorage = JSON.parse(localStorage.getItem('user'));

    confirm({ description: `This action will delete this invoice. ` })
      .then(() =>
        fetch(
          SERVER_URL + '/api/invoice/delete/' + id + '/' + userStorage.user_id,
          requestOptions
        )
          .then(response => {
            return response.json();
          })
          .then(result => {
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

    return currentDate.length > 0
      ? date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear()
      : '';
  };

  return (
    <Card className={classes.root} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1200}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Team Lead</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map(invoice_single => {
                return (
                  <TableRow style={{ textTransform: 'capitalize' }} hover>
                    <TableCell>{invoice_single.client_name}</TableCell>
                    <TableCell>{invoice_single.team_lead_name}</TableCell>
                    <TableCell>{invoice_single.company_name}</TableCell>
                    <TableCell>{invoice_single.service_provider}</TableCell>
                    <TableCell>{invoice_single.project_name}</TableCell>
                    <TableCell>{invoice_single.rate}</TableCell>
                    <TableCell>{invoice_single.time_duration}</TableCell>
                    <TableCell>{invoice_single.currency}</TableCell>
                    <TableCell>{invoice_single.total}</TableCell>

                    {user.status === 'ACTIVATED' &&
                        <TableCell align="right">
                        
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
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};
ListViewListing.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array.isRequired
};

ListViewListing.defaultProps = {
  products: []
};
export default ListViewListing;