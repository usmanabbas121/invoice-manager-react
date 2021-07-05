import React, { useEffect } from 'react';
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
  Checkbox
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

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
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
  }
}));

const FormFields = ({ className, user, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        role: user.role || '',
        status: user.status || '',
        email: user.email || '',
        name: user.name || '',
        password: '',
        user_id: id,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        role: Yup.string()
          .max(255)
          .required('Role is required'),
        status: Yup.string()
          .max(255)
          .required('Status is required'),
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required')
          .matches(
            /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/,
            'Must be a valid email'
          ),
        name: Yup.string()
          .strict(false)
          .trim()
          .min(2, 'First Name must be at least 2 characters')
          .max(255)
          .required('First Name is required')
          .matches(
            /^[a-zA-Z '.-]+$/,
            'Please use dot, apostrophe and letters only'
          ),
        password: Yup.string()
      })}
      onSubmit={async (
        values,
        { props, resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          // NOTE: Make API request

          dispatch(getUsers());

          const {
            email,
            password,
            name,
            user_id,
            status,
            role
          } = values;

          const created_by = JSON.parse(localStorage.getItem('user')).user_id;

          const body = {
            name,
            email,
            password,
            status,
            role,
            created_by,
            user_id
          };       

          let action = 'register';

          if (id && id !== undefined) {
            action = 'update';
          }

          axios
            .post(SERVER_URL + '/api/authentication/' + action, body)
            .then(res => {
              // then print response status

              resetForm({ values: '' });
              setStatus({ success: true });
              setSubmitting(false);
              const message = id ? 'Edited' : 'Added';

              enqueueSnackbar('User ' + message + ' Successfully', {
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
            enqueueSnackbar('User ' + message + ' Successfully', {
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
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Full Name"
                    name="name"
                    onBlur={handleBlur}
                    required
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={
                      touched.email && errors.email ? errors.email : ''
                    }
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    type="email"
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>

                {!id &&
                   <Grid item md={6} xs={12}>
                   <TextField
                     error={Boolean(touched.password && errors.password)}
                     fullWidth
                     helperText={touched.password && errors.password}
                     label="Password"
                     name="password"
                     type="password"
                     onBlur={handleBlur}
                     inputProps={{
                       autoComplete: 'new-password',
                       form: {
                         autoComplete: 'off'
                       }
                     }}
                     onChange={handleChange}
                     value={values.state}
                     variant="outlined"
                     id="clearthetext"
                   />
               </Grid>
                }
               
                <Grid item md={6} xs={12}>
                  <FormControl className={classes.formControl, classes.overlapping} fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Role *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="role"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.role}
                      defaultValue={values.role}
                      required
                    >
                      <MenuItem value={'ADMIN'}>Admin</MenuItem>
                      <MenuItem value={'MANAGER'}>Manager</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12}>
                  <FormControl
                    className={(classes.formControl, classes.overlapping)}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-label">
                      Status *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="status"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.status}
                      defaultValue={values.status}
                      required
                    >
                      <MenuItem value={'ACTIVATED'}>Activate</MenuItem>
                      <MenuItem value={'DEACTIVATED'}>Deactivate</MenuItem>
                      <MenuItem value={'DELETED'}>Delete</MenuItem>
                    </Select>
                  </FormControl>
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
                {id ? 'Edit  ' : 'Add '} User
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