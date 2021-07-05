import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Divider,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles
} from '@material-ui/core';
import { Edit as EditIcon } from 'react-feather';
import DeleteIcon from '@material-ui/icons/Delete';
import { SERVER_URL } from 'src/constants';

import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch } from 'src/store';
import { getUsers } from 'src/slices/users';

const useStyles = makeStyles(theme => ({
  root: {},
  queryField: {
    width: 500
  },
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  changedeletebutton: {
    backgroundColor: 'red',
    color: 'white'
  }
}));

const UsersListing = ({ className, users, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const userStorage = JSON.parse(localStorage.getItem('user'));

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const deleteThisUser = (event, id, name) => {
    const requestOptions = {
      method: 'DELETE'
    };
    const userStorage = JSON.parse(localStorage.getItem('user'));

    confirm({
      description: `This action will delete user, named ${name}.`
    })
      .then(() =>
        fetch(
          SERVER_URL +
            '/api/authentication/delete/' +
            id +
            '/' +
            userStorage.user_id,
          requestOptions
        )
          .then(response => {
            return response.json();
          })
          .then(result => {
            // do what you want with the response here
            enqueueSnackbar('User deleted successfully', {
              variant: 'success'
            });
            dispatch(getUsers());
            // window.location.reload();
          })
      )
      .catch(() => console.log('Deletion cancelled.'));
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Divider />

      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                {/* <TableCell>Company</TableCell> */}
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => {
                return (
                  <TableRow hover key={user.user_id}>
                    <TableCell style={{ textTransform: 'capitalize' }}>
                      <Box display="flex" alignItems="center">
                        <div>{user.name}</div>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    {/* <TableCell style={{ textTransform: 'capitalize' }}>
                      {user.company}
                    </TableCell> */}
                    <TableCell style={{ textTransform: 'capitalize' }}>
                      {user.role === 'ADMIN' &&
                        user.role.replace('ADMIN', 'Admin')}
                      {user.role === 'MANAGER' &&
                        user.role.replace('MANAGER', 'Manager')}
                      
                    </TableCell>

                    <TableCell style={{ textTransform: 'capitalize' }}>
                      {capitalizeFirstLetter(user.status.toLowerCase())}
                    </TableCell>
                    <TableCell align="right">
                      {userStorage.user_id !== user.user_id && user.status!== 'DELETED' &&(
                        <div>
                          <IconButton
                            component={RouterLink}
                            to={'/app/edit-user/' + user.user_id}
                          >
                            <SvgIcon fontSize="small">
                              <EditIcon />
                            </SvgIcon>
                          </IconButton>

                          <IconButton
                            onClick={e =>
                              deleteThisUser(
                                e,
                                user.user_id,
                                user.name
                              )
                            }
                          >
                            <SvgIcon fontSize="small">
                              <DeleteIcon />
                            </SvgIcon>
                          </IconButton>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

UsersListing.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

UsersListing.defaultProps = {
  customers: []
};

export default UsersListing;
