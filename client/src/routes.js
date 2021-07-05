import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={props => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/reset-password',
    component: lazy(() => import('src/views/auth/ForgotPasswordView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/reset-password/:id/:token',
    component: lazy(() => import('src/views/auth/ResetPasswordView'))
  },
  {
    path: '/app',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [

      {
        exact: true,
        path: '/app/dashboard',
        component: lazy(() => import('src/views/DashboardView'))
      },
      {
        exact: true,
        path: '/app/users',
        component: lazy(() => import('src/views/users/UsersListView'))
      },
      {
        exact: true,
        path: '/app/add-user',
        component: lazy(() => import('src/views/users/AddUserView'))
      },
      {
        exact: true,
        path: '/app/edit-user/:id',
        component: lazy(() => import('src/views/users/AddUserView'))
      },


      {
        exact: true,
        path: '/app/invoices',
        component: lazy(() => import('src/views/invoices/InvoiceListView'))
      },
      {
        exact: true,
        path: '/app/invoice/:id',
        component: lazy(() => import('src/views/invoices/InvoiceDetails/invoiceDetails'))
      },
      {
        exact: true,
        path: '/app/add-invoice',
        component: lazy(() => import('src/views/invoices/AddInvoiceView'))
      },
      {
        exact: true,
        path: '/app/edit-invoice/:id',
        component: lazy(() => import('src/views/invoices/AddInvoiceView'))
      },

      {
        exact: true,
        path: '/app/account-deactivated',
        component: lazy(() => import('src/views/errors/AccountDeactivated'))
      },

   
      {
        component: () => <Redirect to="/404" />
      }
    ]
  },

  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        guard: GuestGuard,
        path: '/',
        component: lazy(() => import('src/views/auth/LoginView'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;
