import React, { useEffect } from 'react';
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
} from '@material-ui/core';
import { InvoiceDetails} from 'src/slices/invoices';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark
  },
  colorClass: {
    color: 'blue',
    backgroundColor: theme.palette.background.dark
  },
  textAreaWidth: {
    minWidth: 320,
    padding: 5
  },
  disablesteps: {
    pointerEvents: 'none',
    opacity: 0.5
  }
}));


const MainTabs = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { invoicedetails } = useSelector(state => state.invoices);
  const dispatch = useDispatch();

  const calculateDateFormate = currentDate => {
    const date = new Date(currentDate);

    return currentDate.length > 0
      ? date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear()
      : '';
  };

  useEffect(() => {
    dispatch(InvoiceDetails(id));
  }, [dispatch,id]);

  return (
    <Paper className={`${classes.table}`} square>

      {invoicedetails && invoicedetails.length >0 &&
       <Grid container >
          <Grid item lg={12}>
            <Table>
                <TableBody>
                  <TableRow>
                      <TableCell className={classes.colorClass}><b>Client Details: </b></TableCell>
                  </TableRow>
                </TableBody>
            </Table>
          </Grid>

            
          <Grid item lg={12}>
              <Table>
                  <TableBody>
                    <TableRow>
                        <TableCell width="15%"><b>Client Name:</b></TableCell>
                        <TableCell width="15%">{invoicedetails[0].client_name?invoicedetails[0].client_name:''}</TableCell>
                        <TableCell width="15%"><b>Client Email:</b></TableCell>
                        <TableCell width="15%">{invoicedetails[0].client_email?invoicedetails[0].client_email:''}</TableCell>
                        <TableCell width="15%"><b>Client Phone:</b></TableCell>
                        <TableCell width="15%">{invoicedetails[0].client_phone?invoicedetails[0].client_phone:''}</TableCell>
                    </TableRow>
                  </TableBody>
              </Table>
          </Grid>

  
          <Grid item lg={12}>
            <Table>
                <TableBody>
                  <TableRow>
                      <TableCell className={classes.colorClass}><b>Team Lead Details: </b></TableCell>
                  </TableRow>
                </TableBody>
            </Table>
          </Grid>
         
          <Grid item lg={12}>
            <Table>
              <TableBody>
                    <TableRow>
                        <TableCell width="15%"><b>Team Lead Name:</b></TableCell>
                        <TableCell width="15%">{invoicedetails[0].team_lead_name?invoicedetails[0].team_lead_name:''} </TableCell>
                        <TableCell width="15%"><b>Team Lead Email:</b></TableCell>
                        <TableCell width="15%">{invoicedetails[0].team_lead_email?invoicedetails[0].team_lead_email:''} </TableCell>
                        <TableCell width="15%"><b>Team Lead Phone:</b></TableCell>
                        <TableCell width="15%">{invoicedetails[0].team_lead_phone?invoicedetails[0].team_lead_phone:''} </TableCell>
                    </TableRow>
              </TableBody>  
            </Table> 
          </Grid>


          <Grid item lg={12}>
            <Table>
                <TableBody>
                  <TableRow>
                      <TableCell className={classes.colorClass}><b>Company Details: </b></TableCell>
                  </TableRow>
                </TableBody>
            </Table>
          </Grid>
         
          <Grid item lg={12}>
            <Table>
              <TableBody>
                    <TableRow>
                      <TableCell width="15%"><b>Company Name:</b></TableCell>
                      <TableCell width="15%">{invoicedetails[0].company_name?invoicedetails[0].company_name:''} </TableCell>
                      <TableCell width="15%"><b>Company Address:</b></TableCell>
                      <TableCell width="15%">{invoicedetails[0]. company_address?invoicedetails[0]. company_address:''} </TableCell>
                      <TableCell width="15%"><b>Service Provider:</b></TableCell>
                      <TableCell width="15%">{invoicedetails[0].service_provider?invoicedetails[0].service_provider:''} </TableCell>
                    </TableRow>
              </TableBody>  
            </Table> 
          </Grid>


          <Grid item lg={12}>
            <Table>
                <TableBody>
                  <TableRow>
                      <TableCell className={classes.colorClass}><b>Project Details: </b></TableCell>
                  </TableRow>
                </TableBody>
            </Table>
          </Grid>
         
          <Grid item lg={12}>
            <Table>
              <TableBody>
                    <TableRow>
                    <TableCell width="15%"><b>Project Name:</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].project_name? invoicedetails[0].project_name:''}</TableCell>
                    <TableCell width="15%"><b>Time Duration:</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].time_duration?invoicedetails[0].time_duration:''} Hrs</TableCell>
                    <TableCell width="15%"><b>Project Tasks:</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].project_tasks?invoicedetails[0].project_tasks:''}</TableCell>
                    </TableRow>
              </TableBody>  
            </Table> 
          </Grid>


          <Grid item lg={12}>
            <Table>
                <TableBody>
                  <TableRow>
                      <TableCell className={classes.colorClass}><b>Billing Details: </b></TableCell>
                  </TableRow>
                </TableBody>
            </Table>
          </Grid>
         
          <Grid item lg={12}>
            <Table>
              <TableBody>
                    <TableRow>
                    <TableCell width="15%"><b>Rate :</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].rate?invoicedetails[0].rate:''} / Hour</TableCell>
                    <TableCell width="15%"><b>Currency:</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].currency?invoicedetails[0].currency:''}</TableCell>
                    <TableCell width="15%"><b>Total Amount:</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].total?invoicedetails[0].total:''}</TableCell>
                    </TableRow>
              </TableBody>  
            </Table> 
          </Grid>

          <Grid item lg={12}>
            <Table>
                <TableBody>
                  <TableRow>
                      <TableCell className={classes.colorClass}><b>Action Dates: </b></TableCell>
                  </TableRow>
                </TableBody>
            </Table>
          </Grid>
         
          <Grid item lg={12}>
            <Table>
              <TableBody>
                    <TableRow>
                    <TableCell width="15%"><b>Created at:</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].created_at?calculateDateFormate(invoicedetails[0].created_at): ''}</TableCell>
                    <TableCell width="15%"><b>Updated at:</b></TableCell>
                    <TableCell width="15%">{invoicedetails[0].updated_at? calculateDateFormate(invoicedetails[0].updated_at): 'not updated yet'}</TableCell>
                    </TableRow>
              </TableBody>  
            </Table> 
          </Grid>

        </Grid>

        }
    </Paper>
  );
};
export default MainTabs;
