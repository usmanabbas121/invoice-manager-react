import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_URL } from 'src/constants';

const initialState = {
  users: [],
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsers(state, action) {
      const { users } = action.payload;

      state.users = users;
    },
  }
});

export const reducer = slice.reducer;

export const getUsers = () => async dispatch => {
  const response = await axios.get(SERVER_URL + '/api/authentication/users');
  dispatch(slice.actions.getUsers(response.data));
};


export default slice;
