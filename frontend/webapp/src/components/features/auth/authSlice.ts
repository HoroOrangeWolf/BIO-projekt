import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser } from '../../services/api.ts';

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return rejectWithValue(error.response?.data);
    }
  },
);

const initialState = {
  isAuthenticated: false,
  user: null,
  status: 'idle',
  error: null,
  authCheckComplete: false, // Nowe pole
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = 'succeeded';
      state.authCheckComplete = true;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
      state.authCheckComplete = true;
    },
    setAuthCheckComplete: (state, action) => {
      state.authCheckComplete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
        state.authCheckComplete = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.authCheckComplete = true;
      });
  },
});

export const { setUser, clearUser, setAuthCheckComplete } = authSlice.actions;

export default authSlice.reducer;
