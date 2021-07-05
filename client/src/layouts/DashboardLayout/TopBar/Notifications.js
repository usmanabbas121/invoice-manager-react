import React, {
  useRef,
  useState,
} from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
  makeStyles,
  Grid,
} from '@material-ui/core';
import {
  Bell as BellIcon,
} from 'react-feather';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles((theme) => ({
  popover: {
    width: 450
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  space: {
    margin:7
  },
  set: {
    float:'right'
  },
  overlay: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)'
  },
  root: {
    width: '100%',
    height: 400,
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
  listItems: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 250,
  },
}));

const Notifications = () => {
  const classes = useStyles();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          ref={ref}
          onClick={handleOpen}
        >
          <Badge badgeContent={2} color="error">
          <BellIcon />
          </Badge>
    
        </IconButton>

      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >

      <Grid container>
        <Grid item>
        <Typography
            variant="h5"
            color="textPrimary"
            align="left"
            className={classes.space}  
          >
            Notifications
          </Typography> 
        </Grid>
      </Grid>

          <>
            <List className={classes.listItems} disablePadding>
                  <ListItem onClick={handleClose} divider>          
                    <ListItemText
                    primary={"This is the first notification."} 
                      primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                    />
                    
                    <ListItemText
                    primary={"This is the second notification."} 
                      primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                    />
                  </ListItem>                    
            </List>
    
    
      

          </>
        
      </Popover>
    </>
  );
};

export default Notifications;