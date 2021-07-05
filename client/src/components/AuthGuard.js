import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const AuthGuard = ({ children }) => {
  let { isAuthenticated, user } = useAuth();

  if (user && user.role === 'ENGINEER') {
    console.log('authhhhhhhhhhhhhhhh', user, window.location.pathname);
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
