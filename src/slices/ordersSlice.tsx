import { getOrdersApi } from '../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../services/store';

//интерфейс состояния заказов
interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние для заказов
export const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

// Асинхронная функция для получения заказов
const fetchOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

// Создание слайса для управления состоянием заказов
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

// Экспортируем редьюсер для использования в store
export default ordersSlice.reducer;

export { fetchOrders };

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectLoading = (state: RootState) => state.orders.loading;