/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  ListSubheader,
  makeStyles
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountIcon from '@material-ui/icons/AccountBalance';
import InvoiceIcon from '@material-ui/icons/Receipt';
import Logo from 'src/components/Logo';
import NavItem from './NavItem';
import Search from 'src/layouts/DashboardLayout/TopBar/Search';


let user = [];
if (localStorage.user) {
  user = JSON.parse(localStorage.user);
}

let sections;
if (user.role === 'MANAGER' && user.status === 'ACTIVATED') {
  sections = [
    {
      items: [
        {
          title: 'Manage Invoices',
          icon: InvoiceIcon,
          href: '/app/invoices',
          items: [
            {
              title: 'Manage Invoices',
              href: '/app/invoices'
            },
            {
              title: 'Add Invoice',
              href: '/app/add-invoice'
            }
          ]
        }
      ]
    }
  ];
} else if (user.role === 'ADMIN' && user.status === 'ACTIVATED') {
  sections = [
    {
      items: [
        {
          title: 'Dashboard',
          icon: DashboardIcon,
          href: '/app/dashboard'
        },
        {
          title: 'Users Data',
          icon: PeopleIcon,
          href: '/app/users',
          items: [
            {
              title: 'Manage Users',
              href: '/app/users'
            },
            // {
            //   title: 'Add User',
            //   href: '/app/add-user'
            // }
          ]
        },

        {
          title: 'Invoices Data',
          icon: InvoiceIcon,
          href: '/app/invoices',
          items: [
            {
              title: 'Manage Invoices',
              href: '/app/invoices'
            },
            {
              title: 'Add Invoice',
              href: '/app/add-invoice'
            }
          ]
        }

      ]
    }
  ];
} else if (user.status === 'DEACTIVATED'){
  sections = [
    {
      items: [
        {
          title: 'Account Info',
          icon: AccountIcon,
          href: '/app/account-deactivated'
        },
        {
          title: 'Invoices Data',
          icon: InvoiceIcon,
          href: '/app/invoices',
          items: [
            {
              title: 'Manage Invoices',
              href: '/app/invoices'
            },
            {
              title: 'Add Invoice',
              href: '/app/add-invoice'
            }
          ]
        }

      ]
    }
  ];
}

function renderNavItems({ items, pathname, depth = 0 }) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({ acc, pathname, item, depth }) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box p={2} display="flex" justifyContent="center">
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>

        <Box p={2}>
          <Search />
        </Box>

        <Divider />
        <Box p={2}>
          {sections.map((section, index) => (
            <List
              key={index}
              subheader={
                <ListSubheader disableGutters disableSticky>
                  {section.subheader}
                </ListSubheader>
              }
            >
              {renderNavItems({
                items: section.items,
                pathname: location.pathname
              })}
            </List>
          ))}
        </Box>
        <Divider />
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
