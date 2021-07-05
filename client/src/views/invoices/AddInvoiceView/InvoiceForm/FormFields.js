import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
  Checkbox,
  Typography,
} from '@material-ui/core';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'src/store';
import { getUsers } from 'src/slices/users';
import axios from 'axios';
import { SERVER_URL } from 'src/constants';

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  roota: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  formControl: {
    margin: theme.spacing(1)
  },
  sendemailoption: {
    paddingLeft: 7,
    paddingTop: 5
  },
  checkboxPadding: {
    paddingLeft: 0,
  },
  overlapping: {
    marginTop: 0
  },
  controlemailtext: {
    position: 'relative',
    top: 3
  },
  marginss: {
    marginBottom: 20
}
}));

const FormFields = ({ className, invoice, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [email_from, setEmailfrom] = useState([]);
  const [email_to, setEmailto] = useState([]);
  const [email_cc, setEmailcc] = useState([]);
  const [email_bcc, setEmailbcc] = useState([]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        client_name: invoice.client_name || '',
        client_email: invoice.client_email || '',
        client_phone: invoice.client_phone || '',
        team_lead_name: invoice.team_lead_name || '',
        team_lead_email: invoice.team_lead_email || '',
        team_lead_phone: invoice.team_lead_phone || '',
        company_name: invoice.company_name || '',
        company_address: invoice.company_address || '',
        service_provider: invoice.service_provider || '',
        project_name: invoice.project_name || '',
        project_tasks: invoice.project_tasks || '',
        time_duration: invoice.time_duration || '',
        rate: invoice.rate || '',
        currency: invoice.currency || '',
        total: invoice.total || '',
        invoice_id: id,
        sendemail: true,
        email_subject: '',
        submit: null
      }}

      validationSchema={Yup.object().shape({
        client_name: Yup.string()
          .strict(false)
          .trim()
          .min(2, 'Name must be of at least 2 characters')
          .max(255)
          .required('Client Name is required')
          .matches(
            /^[a-zA-Z '.-]+$/,
            'Please use dot, apostrophe and letters only'
          ),
          client_email: Yup.string()
          .email('Must be a valid Email Address')
          .max(255)
          .required('Client Email Address is required')
          .matches(
            /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/,
            'Must be a valid Email Address'
          ),
          client_phone: Yup.string()
          .required('Phone Number is required')
          .matches(
            /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
            'Must be a valid Phone Number'
          ),
          team_lead_name: Yup.string()
          .strict(false)
          .trim()
          .min(2, 'Name must be of at least 2 characters')
          .max(255)
          .required('Team Lead Name is required')
          .matches(
            /^[a-zA-Z '.-]+$/,
            'Please use dot, apostrophe and letters only'
          ),
          team_lead_email: Yup.string()
          .email('Must be a valid Email Address')
          .max(255)
          .required('Team Lead Email Address is required')
          .matches(
            /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/,
            'Must be a valid Email Address'
          ),
          team_lead_phone: Yup.string()
          .required('Team Lead Phone Number is required')
          .matches(
            /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
            'Must be a valid Phone Number'
          ),
          company_name: Yup.string()
          .strict(false)
          .trim()
          .matches(
            /^[a-zA-Z '.-]+$/,
            'Please use dot, apostrophe and letters only'
          ),
          company_address: Yup.string()
          .strict(false)
          .trim()
          .max(255),
          service_provider: Yup.string()
          .strict(false)
          .trim()
          .max(255)
          .required('Service provider is required'),
          project_name : Yup.string()
          .strict(false)
          .trim()
          .max(255)
          .required('Project Name is required'),
          project_tasks : Yup.string()
          .strict(false)
          .trim()
          .max(255)
          .required('Project Tasks are required'),
          time_duration : Yup.number()
          .required('Time duration is required in Hours'),
          rate : Yup.number()
          .required('Rate per hour is required'),
          currency : Yup.string()
          .max(255)
          .required('Currency is not selected'),
          total : Yup.number()
          .required('total amount is required'),
          email_subject: Yup.string()
          .max(255)
      })}


      onSubmit={async (
        values,
        { props, resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          // NOTE: Make API request

          //dispatch(getUsers());

          
          let reciever_emails = email_to.join();
          let sender_email = email_from.join();
          let cc_email = email_cc.join();
          let bcc_email = email_bcc.join();
          const created_by = JSON.parse(localStorage.getItem('user')).user_id;

          const {
            client_name,
            client_email,
            client_phone,
            team_lead_name,
            team_lead_email,
            team_lead_phone,
            company_name,
            company_address,
            service_provider,
            project_name,
            project_tasks,
            time_duration,
            rate,
            currency,
            total,
            invoice_id,
            email_subject
          } = values;

          const body = {
            client_name,
            client_email,
            client_phone,
            team_lead_name,
            team_lead_email,
            team_lead_phone,
            company_name,
            company_address,
            service_provider,
            project_name,
            project_tasks,
            time_duration,
            rate,
            currency,
            total,
            invoice_id,
            reciever_emails,
            sender_email,
            cc_email,
            bcc_email,
            email_subject,
            created_by
          };       

          let action = 'register';

          if (id && id !== undefined) {
            action = 'update';
          }

          axios
            .post(SERVER_URL + '/api/invoice/' + action, body)
            .then(res => {
              // then print response status

              resetForm({ values: '' });
              setStatus({ success: true });
              setSubmitting(false);
              const message = id ? 'Edited' : 'Added';

              enqueueSnackbar('invoice ' + message + ' Successfully', {
                variant: 'success'
              });
              if (id) {
                window.location.reload();
              }
            })
            .catch(err => {
              // then print response status
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            });

        } catch (err) {
          console.error(err);
          if (err.message === 'success') {
            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            const message = id ? 'Edited' : 'Added';
            enqueueSnackbar('Invoice ' + message + ' Successfully', {
              variant: 'success'
            });
          } else {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        resetForm,
        setFieldValue,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardContent>

        {values.sendemail && 
        
        <Card className={clsx(classes.roota, className)} {...rest}>
        <CardContent>
        <Typography
            variant="h5"
            color="textPrimary"
            className = {classes.marginss}
        >
            Enter Emailing Information
        </Typography>

        <Grid container spacing={4}>
          <Grid item md={6} xs={12}>
              <ReactTagInput 
                tags={email_from} 
                placeholder="Email from"
                maxTags={1}
                onChange={(newEmailfrom) => setEmailfrom(newEmailfrom)}
                validator={(value) => {
                  // Don't actually validate e-mails this way
                  const isEmail = value.indexOf("@") !== -1;
                  if (!isEmail) {
                    alert("Please enter an e-mail address");
                  }
                  return isEmail;
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <ReactTagInput 
                tags={email_to} 
                placeholder="Email to"
                onChange={(newEmailto) => setEmailto(newEmailto)}
                validator={(value) => {
                  // Don't actually validate e-mails this way
                  const isEmail = value.indexOf("@") !== -1;
                  if (!isEmail) {
                    alert("Please enter an e-mail address");
                  }
                  return isEmail;
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <ReactTagInput 
                tags={email_cc} 
                placeholder="cc"
                onChange={(newEmailcc) => setEmailcc(newEmailcc)}
                validator={(value) => {
                  // Don't actually validate e-mails this way
                  const isEmail = value.indexOf("@") !== -1;
                  if (!isEmail) {
                    alert("Please enter an e-mail address");
                  }
                  return isEmail;
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <ReactTagInput 
                tags={email_bcc} 
                placeholder="bcc"
                onChange={(newEmailbcc) => setEmailbcc(newEmailbcc)}
                validator={(value) => {
                  // Don't actually validate e-mails this way
                  const isEmail = value.indexOf("@") !== -1;
                  if (!isEmail) {
                    alert("Please enter an e-mail address");
                  }
                  return isEmail;
                }}
              />
            </Grid>


            <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email_subject && errors.email_subject)}
                    fullWidth
                    helperText={touched.email_subject && errors.email_subject}
                    label="Subject"
                    name="email_subject"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email_subject}
                    variant="outlined"
                  />
                </Grid>
            
          </Grid>
         </CardContent>
        </Card>
          
        }
        
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.client_name && errors.client_name)}
                    fullWidth
                    helperText={touched.client_name && errors.client_name}
                    label="Client Name"
                    name="client_name"
                    onBlur={handleBlur}
                    required
                    onChange={handleChange}
                    value={values.client_name}
                    variant="outlined"
                  />
                </Grid>

             
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.client_email && errors.client_email)}
                    fullWidth
                    helperText={
                      touched.client_email && errors.client_email ? errors.client_email : ''
                    }
                    label="Client Email Address"
                    name="client_email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type="email"
                    value={values.client_email}
                    variant="outlined"
                  />
                </Grid>

                
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.client_phone && errors.client_phone)}
                    fullWidth
                    helperText={touched.client_phone && errors.client_phone}
                    label="Client Phone Number"
                    name="client_phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.client_phone}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.team_lead_name && errors.team_lead_name)}
                    fullWidth
                    helperText={touched.team_lead_name && errors.team_lead_name}
                    label="Team Lead Name"
                    name="team_lead_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.team_lead_name}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.team_lead_email && errors.team_lead_email)}
                    fullWidth
                    helperText={
                      touched.team_lead_email && errors.team_lead_email ? errors.team_lead_email : ''
                    }
                    label="Team Lead Email Address"
                    name="team_lead_email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type="email"
                    value={values.team_lead_email}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.team_lead_phone && errors.team_lead_phone)}
                    fullWidth
                    helperText={touched.team_lead_phone && errors.team_lead_phone}
                    label="Team Lead Phone Number"
                    name="team_lead_phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.team_lead_phone}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.company_name && errors.company_name)}
                    fullWidth
                    helperText={touched.company_name && errors.company_name}
                    label="Company Name"
                    name="company_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.company_name}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.company_address && errors.company_address)}
                    fullWidth
                    helperText={touched.company_address && errors.company_address}
                    label="Company Address"
                    name="company_address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.company_address}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.service_provider && errors.service_provider)}
                    fullWidth
                    helperText={touched.service_provider && errors.service_provider}
                    label="Service Provider"
                    name="service_provider"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.service_provider}
                    variant="outlined"
                  />
                </Grid>

                
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.project_name && errors.project_name)}
                    fullWidth
                    helperText={touched.project_name && errors.project_name}
                    label="Project Name"
                    name="project_name"
                    onBlur={handleBlur}
                    required
                    onChange={handleChange}
                    value={values.project_name}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.project_tasks && errors.project_tasks)}
                    fullWidth
                    helperText={touched.project_tasks && errors.project_tasks}
                    label="Task Description"
                    name="project_tasks"
                    onBlur={handleBlur}
                    required
                    onChange={handleChange}
                    value={values.project_tasks}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.time_duration && errors.time_duration)}
                    fullWidth
                    helperText={touched.time_duration && errors.time_duration}
                    label="Time Duration in Hrs"
                    name="time_duration"
                    onBlur={handleBlur}
                    required
                    onChange={handleChange}
                    value={values.time_duration}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.rate && errors.rate)}
                    fullWidth
                    helperText={touched.rate && errors.rate}
                    label="Rate per Hr"
                    name="rate"
                    onBlur={handleBlur}
                    required
                    onChange={handleChange}
                    value={values.rate}
                    variant="outlined"
                  />
                </Grid>


                <Grid item md={6} xs={12}>
                  <FormControl className={classes.formControl, classes.overlapping} fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Currency *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="currency"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.currency}
                      defaultValue={values.currency}
                      required
                    >
                      <MenuItem value={'USD'}>USD</MenuItem>
                      <MenuItem value={'EUR'}>EUR</MenuItem>
                      <MenuItem value={'GBP'}>GBP</MenuItem>
                      <MenuItem value={'PKR'}>PKR</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>


                <Grid item md={6} xs={12}>        
                  <TextField
                    error={Boolean(touched.total && errors.total)}
                    fullWidth
                    helperText={touched.total && errors.total}
                    label="Total Amount"
                    name="total"
                    onBlur={handleBlur}
                    required
                    onChange={handleChange}
                    // value={id ? values.total : (values.rate * values.time_duration)}
                    value= {values.total}
                    variant="outlined"
                  />
                </Grid>

      
                <Grid
                    item
                    md={12}
                    xs={12}
                    className={classes.sendemailoption}
                  >
                    <Checkbox
                      checked={values.sendemail}
                      className={classes.checkboxPadding}
                      name="sendemail"
                      onChange={handleChange}
                    />
                    <span
                      className={classes.controlemailtext}
                      color="textSecondary"
                    >
                      Want to Email this Invoice ?
                    </span>
                </Grid>

              </Grid>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
            </CardContent>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              <Button
                color="secondary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                {id ? 'Edit  ' : 'Add '} Invoice
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

FormFields.propTypes = {  
  className: PropTypes.string
  //user: PropTypes.object.isRequired
};

export default FormFields;