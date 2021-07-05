import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  Link,
  Button,
  Breadcrumbs,
  Grid,
  makeStyles,
  SvgIcon
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles(theme => ({
  root: {},
  rightAlign: {
    float: 'right'
  },
  action: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },
  blueicon: {
    color: 'blue'
  },
  blackicon: {
    color: 'black'
  }
}));

function Header(props, { className, ...reset }) {
  const classes = useStyles();
  const [txt, managetext] = useState('List');
  const { user } = useAuth();
  const handleFolder = () => {
    props.changeView('tree');
    managetext('Folder');
  };

  const handleList = () => {
    props.changeView('list');
    managetext('List');
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Breadcrumbs
          speratator={<NavigateNextIcon fontsize="small" />}
          aria-label="breadcrumb"
        >
          <Link variant="body1" color="inherit" to="">
            {' '}
            Invoices
          </Link>
          <Link variant="body1" color="inherit" to="">
            {txt} View
          </Link>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={6} justify="right">
        <div className={classes.rightAlign}>

            <Button
              color="secondary"
              variant="contained"
              className={classes.action}
              component={RouterLink}
              to="/app/add-invoice"
            >
              Add Invoice
            </Button>
          
        </div>
      {user.role === 'ADMIN' &&

        <Button
          fontSize="large"
          className={classes.rightAlign}
          onClick={handleList}
        >
        <SvgIcon
            className={txt === 'List' ? classes.blueicon : classes.blackicon}
        >
          <ListIcon />
        </SvgIcon>
        </Button>
      }
        

      {user.role === 'ADMIN' && 
         <Button
            fontSize="large"
            className={classes.rightAlign}
            onClick={handleFolder}
         >
        <SvgIcon
            className={txt === 'Folder' ? classes.blueicon : classes.blackicon}
          >
            <FolderOutlinedIcon />
          </SvgIcon>
      </Button>
    }
      </Grid>
    </Grid>
  );
}

export default Header;
