import React, { createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import SplashScreen from 'src/components/SplashScreen';
// import axios from 'src/utils/axios';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { SERVER_URL } from 'src/constants';

const JWT_SECRET = 'aprevo1secret2case';
const JWT_EXPIRES_IN = '12h';

const initialAuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
};

var users = [];
const userStorage = JSON.parse(localStorage.getItem('user'));

if (userStorage !== null) {
  users = [
    {
      id: userStorage.user_id,
      email: userStorage.email,
      name: userStorage.name,
      role: userStorage.role,
      status:userStorage.status
    }
  ];
}

const isValidToken = accessToken => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const loginUser = async config => {
  try {
    const { email, password } = config;

    const body = { email, password };
    const response = await fetch(SERVER_URL + '/api/authentication/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const parseRes = await response.json();

    if (!parseRes.user) {
      return [400, { message: 'Please check your email and passworddddd' }];
    }

    // console.log(parseRes);
    // return;

    // const accessTokenS = parseRes.jwtToken;
    const userr = parseRes.user;

    if (parseRes.jwtToken) {
      localStorage.setItem('jwt_token', parseRes.jwtToken);
      localStorage.setItem('user', JSON.stringify(parseRes.user));
    }

    users.push({
      id: userr.user_id,
      email: userr.email,
      name: userr.name,
      role: userr.role,
      status:userr.status
    });

    const user = users.find(_user => _user.email === email);

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [
      200,
      {
        accessToken,
        user: {
          id: userr.user_id,
          email: userr.email,
          name: userr.name,
          role: userr.role,
          status: userr.status
        }
      }
    ];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
};

const setSession = accessToken => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');

    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALISE': {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      };
    }
    case 'LOGIN': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const login = async (email, password) => {

    const response = await loginUser({ email, password });

    if (response[0] === 400) {
      return [400, { message: 'Please check your email and password' }];
    }

    const { accessToken, user } = response[1];

    // return;

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
    window.location.reload();
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
    dispatch({ type: 'LOGOUT' });
  };

  const checkHeaders = config => {
    try {
      const { Authorization } = config;

      if (!Authorization) {
        return [401, { message: 'Authorization token missing' }];
      }

      const accessToken = Authorization.split(' ')[1];
      const { userId } = jwt.verify(accessToken, JWT_SECRET);

      const user = users.find(_user => _user.id === userId);

      if (!user) {
        return [401, { message: 'Invalid authorization token' }];
      }

      return [
        200,
        {
          user: {
            id: user.id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status
          }
        }
      ];
    } catch (err) {
      console.error(err);
      return [500, { message: 'Internal server error' }];
    }
  };

  useEffect(() => {
    const initialise = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = checkHeaders(axios.defaults.headers.common);
          //const response = await axios.get('/api/account/me');
          const { user } = response[1];

          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialise();
  }, []);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
