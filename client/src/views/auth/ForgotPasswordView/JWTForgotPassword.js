import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  makeStyles
} from '@material-ui/core';

import axios from 'axios';
import { SERVER_URL } from 'src/constants';

const useStyles = makeStyles(() => ({
  root: {},
  notaerror: {
    color: 'green !important'
  }
}));
const JWTForgotPassword = ({ className, ...rest }) => {
  const classes = useStyles();

  var notIsError = false;

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        password: '',
        policy: false,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .min(7)
          .max(30)
          .required('Email is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // await register(values.email, values.name, values.password);
          const { email } = values;

          axios
            .post(SERVER_URL + '/api/authentication/reset-password', { email })
            .then(res => {
              // then print response status

              setStatus({ success: true });
              setSubmitting(false);

              if (res.data.newUser) {
                notIsError = true;
                setErrors({
                  submit:
                    'We have sent you an email with a link. Please check your email.'
                });
                // enqueueSnackbar('Please check your email', {
                //   variant: 'success'
                // });
              }
            })
            .catch(err => {
              // then print response status
              setStatus({ success: false });
              notIsError = false;
              setErrors({ submit: 'Email is not existing.' });
              setSubmitting(false);
            });

          // if (isMountedRef.current) {
          //   setStatus({ success: true });
          //   setSubmitting(false);
          // }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.error });
          setSubmitting(false);
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
        values
      }) => (
        <form
          noValidate
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />

          {Boolean(touched.policy && errors.policy) && (
            <FormHelperText error>{errors.policy}</FormHelperText>
          )}
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText
                error
                className={notIsError ? classes.notaerror : ''}
              >
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Get New Password
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTForgotPassword.propTypes = {
  className: PropTypes.string
};

export default JWTForgotPassword;
