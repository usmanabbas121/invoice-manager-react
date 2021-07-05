import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, Container, Divider, Link, Typography, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Logo from 'src/components/Logo';
import useAuth from 'src/hooks/useAuth';
import JWTForgotPassword from './JWTForgotPassword';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  banner: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  bannerChip: {
    marginRight: theme.spacing(2)
  },
  methodIcon: {
    height: 30,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 80,
  },
  cardContent: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400
  },
  currentMethodIcon: {
    height: 40,
    '& > img': {
      width: 'auto',
      maxHeight: '100%'
    }
  }
}));

const ForgotPasswordView = () => {
  const classes = useStyles();
  const { method } = useAuth();
  const refreshThePage = (event) => {
    window.location = '/';
  }
  return (
    <Page
      className={classes.root}
      title="Reset Password"
    >

      <Container
        className={classes.cardContainer}
        maxWidth="sm"
      >
        <Box
          mb={8}
          display="flex"
          justifyContent="center"
        >
          <RouterLink onClick={(e) => refreshThePage(e)}  to="/">
            <Logo />
          </RouterLink>
        </Box>
        <Card>
          <CardContent className={classes.cardContent}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              mb={3}
            >
              <div>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h2"
                >
                  Reset Password
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  Please enter your email address. You will receive a link to create a new password via email.
                </Typography>
              </div>

            </Box>
            <Box
              flexGrow={1}
              mt={3}
            >
              {method === 'JWT' && <JWTForgotPassword />}
            </Box>
            <Box my={3}>
              <Divider />
            </Box>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              color="textSecondary"
            >
              Back To Login
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default ForgotPasswordView;
