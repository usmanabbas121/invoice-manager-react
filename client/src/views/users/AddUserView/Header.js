import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Typography,
  makeStyles
} from '@material-ui/core';


const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();
  const { id } = useParams();
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >

      <Typography
        variant="h3"
        color="textPrimary"
      >
        {id ? "Edit  " : "Add "} User
      </Typography>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
