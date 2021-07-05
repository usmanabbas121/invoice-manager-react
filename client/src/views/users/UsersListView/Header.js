import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { useRef, useState } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'src/store';

import {
  Typography,
  makeStyles,
  SvgIcon,
  Button,
  Menu,
  MenuItem,
  Grid
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles(theme => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const Header = (props, { className, ...rest }) => {
  const classes = useStyles();
  const actionRef = useRef(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { users } = useSelector(state => state.users);

  const allusersCount = users.length;
  const adminCount = users.filter(item => item.role === 'ADMIN').length;
  const managerCount = users.filter(item => item.role === 'MANAGER').length;


  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
      spacing={2}
      {...rest}
    >
      <Grid item xs={6}>
        <Typography variant="h3" color="textPrimary">
          Manage Users
        </Typography>
      </Grid>

      <Grid item xs={6} style={{ textAlign: 'right' }}>
        <Button
          color="secondary"
          variant="contained"
          ref={actionRef}
          onClick={() => setMenuOpen(true)}
        >
          <SvgIcon fontSize="Small">
            <FilterListIcon />
          </SvgIcon>{' '}
          Filters
        </Button>
        <StyledMenu
          anchorEl={actionRef.current}
          onClose={() => setMenuOpen(false)}
          onClick={() => setMenuOpen(false)}
          open={isMenuOpen}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <StyledMenuItem onClick={() => props.changeView('All')}>
            <ListItemText primary={'All Users (' + allusersCount + ')'} />
          </StyledMenuItem>
          <StyledMenuItem onClick={() => props.changeView('ADMIN')}>
            <ListItemText primary={'Admin Users(' + adminCount + ')'} />
          </StyledMenuItem>
          <StyledMenuItem onClick={() => props.changeView('MANAGER')}>
            <ListItemText primary={'Manager Users (' + managerCount + ')'} />
          </StyledMenuItem>
        </StyledMenu>

        {/* <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          component={RouterLink}
          to="/app/add-user"
          style={{ marginLeft: 20, marginTop: 8 }}
        >
          Add User
        </Button> */}
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
