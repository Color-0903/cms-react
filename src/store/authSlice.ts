import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { axiosInstance } from '../apis';

export interface AuthState {
  loading: boolean;
  error: string;
  userType?: 'administrator' | 'user';
  authUser?: any;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: (): AuthState => {
    let initState: AuthState = {
      loading: false,
      error: '',
    };

    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      initState.authUser = JSON.parse(authUser);
    }

    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
    }

    return initState;
  },
  reducers: {
    login: (state, action: PayloadAction<{ token: string }>) => {
      localStorage.setItem('authUser', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.token);
      axiosInstance.defaults.headers.Authorization = action.payload.token ? `Bearer ${action.payload.token}` : '';
    },
    updateMe: (state, action: PayloadAction<any>) => {
      state.authUser = action.payload;
    },
    logout: (state) => {
      state.authUser = undefined;
      localStorage.removeItem('token');
    },
  },
});

export const { logout, login, updateMe } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
