import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  makeStyles
} from '@material-ui/core';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from 'src/constants';

const useStyles = makeStyles(() => ({
  root: {},
  notaerror: {
    color: 'green !important'
  }
}));

const JWTResetPassword = ({ className, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const { id, token } = useParams();
  var notIsError = false;

  return (
    <Formik
      initialValues={{
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(7)
          .max(30)
          .required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // await register(values.email, values.name, values.password);
          const { password } = values;

          const data = { password, token };

          axios
            .post(SERVER_URL + '/api/authentication/reset-password/' + id, data)
            .then(res => {
              // then print response status

              setStatus({ success: true });
              setSubmitting(false);
              notIsError = true;
              if (res.data.newUser) {
                setErrors({
                  submit: 'Your password is updated successfully'
                });
                // enqueueSnackbar('Your password is updated successfully', {
                //   variant: 'success'
                // });
              }
            })
            .catch(err => {
              // then print response status
              setStatus({ success: false });
              setErrors({ submit: 'Some thing went wrong' });
              setSubmitting(false);
            });

          // if (isMountedRef.current) {
          //   setStatus({ success: true });
          //   setSubmitting(false);
          // }
        } catch (err) {
          console.error(err);

          if (err.success) {
            setStatus({ success: true });
            enqueueSnackbar(err.message, {
              variant: 'success'
            });
            setSubmitting(false);
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
        values
      }) => (
        <form
          noValidate
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />

          {Boolean(touched.policy && errors.policy) && (
            <FormHelperText error>{errors.policy}</FormHelperText>
          )}
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText
                className={notIsError ? classes.notaerror : ''}
                error
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
              Set New Password
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTResetPassword.propTypes = {
  className: PropTypes.string
};

export default JWTResetPassword;
