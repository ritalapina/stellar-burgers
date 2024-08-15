import {
  getUserApi,
  registerUserApi,
  TAuthResponse,
  loginUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  TUserResponse,
  logoutApi
  } from '@api';
  import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
  import { TUser } from '@utils-types';
  import { RootState } from '../services/store';
  import { deleteCookie, setCookie } from '../utils/cookie';
  
  // Интерфейс состояния пользователя
  interface UserState {
  user: TUser | null; 
  loading: boolean;
  error: string | null; 
  }
  
  // Начальное состояние
  const initialState: UserState = {
  user: null,
  loading: false,
  error: null
  };
  
  // Асинхронные функции для работы с пользователем
  const fetchUser = createAsyncThunk<{ user: TUser }>('user/fetchUser', getUserApi);
  const loginUser = createAsyncThunk<TAuthResponse, TLoginData>('user/loginUser', loginUserApi);
  const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>('user/registerUser', registerUserApi);
  const updateUser = createAsyncThunk<TUserResponse, Partial<TRegisterData>>('user/updateUser', updateUserApi);
  const logoutUser = createAsyncThunk<{ success: boolean }>('user/logoutUser', logoutApi);
  
  export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

  // Обработчик загрузки пользователя
  builder
  .addCase(fetchUser.pending, (state) => {
  state.loading = true; 
  state.error = null; 
  })

  .addCase(fetchUser.fulfilled, (state, action) => {
  state.user = action.payload.user; // Сохраняем данные пользователя
  state.loading = false; // Сбрасываем флаг загрузки
  })

  .addCase(fetchUser.rejected, (state, action) => {
  state.loading = false; 
  state.error = action.error.message || 'Failed to fetch user'; // Сообщение об ошибке
  })

  // Обработка регистрации пользователя
  .addCase(registerUser.pending, (state) => {
  state.loading = true; // Устанавливаем флаг загрузки
  state.error = null; 
  })

  .addCase(registerUser.fulfilled, (state, action) => {
  state.user = action.payload.user; // Сохраняем данные пользователя
  state.loading = false; 

  setCookie('accessToken', action.payload.accessToken); 
  localStorage.setItem('refreshToken', action.payload.refreshToken); 
  })

  .addCase(registerUser.rejected, (state, action) => {
  state.loading = false; 
  state.error = action.error.message || 'Failed to register user'; 
  })

  // Обработка входа пользователя
  .addCase(loginUser.pending, (state) => {
  state.loading = true; 
  state.error = null; 
  })

  .addCase(loginUser.fulfilled, (state, action) => {
  state.user = action.payload.user; 
  state.loading = false; 

  setCookie('accessToken', action.payload.accessToken); 
  localStorage.setItem('refreshToken', action.payload.refreshToken); 
  })

  .addCase(loginUser.rejected, (state, action) => {
  state.loading = false; // Сбрасываем флаг загрузки
  state.error = action.error.message || 'Failed to login'; 
  })
  
  .addCase(updateUser.pending, (state) => {
  state.loading = true; // Устанавливаем флаг загрузки
  state.error = null; // Сбрасываем сообщение об ошибке
  })

  .addCase(updateUser.fulfilled, (state, action) => {
  state.user = action.payload.user; 
  state.loading = false; 
  })

  .addCase(updateUser.rejected, (state, action) => {
  state.loading = false; 
  state.error = action.error.message || 'Failed to update user'; 
  })

  // Обработка выхода пользователя
  .addCase(logoutUser.pending, (state) => {
  state.loading = true; 
  state.error = null; 
  })

  .addCase(logoutUser.fulfilled, (state) => {
  state.user = null; // Убираем пользователя при логауте
  localStorage.removeItem('refreshToken'); 
  deleteCookie('accessToken'); 
  state.loading = false;
  })

  .addCase(logoutUser.rejected, (state, action) => {
  state.loading = false; 
  state.error = action.error.message || 'Failed to logout user'; 
  });
  }
  });
  
  
  export { fetchUser, registerUser, loginUser, updateUser, logoutUser };
  
  export const selectUser = (state: RootState) => state.user.user; 
  export const selectLoading = (state: RootState) => state.user.loading; 
  export const selectError = (state: RootState) => state.user.error; 
  
  export default userSlice.reducer;