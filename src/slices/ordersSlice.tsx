import { getOrdersApi } from '@api'; 
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; 
import { TOrder } from '@utils-types'; 
import { RootState } from '../services/store'; 

// Тип состояния заказов
type OrdersState = {
  orders: TOrder[]; 
  loading: boolean; 
  error: string | null; 
}

// Начальное состояние для заказов
const initialState: OrdersState = {
  orders: [], 
  loading: false, 
  error: null 
};

// Асинхронная функция для получения заказов
const fetchOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders', 
  async () => getOrdersApi() 
);

// Создание слайса для управления состоянием заказов
export const ordersSlice = createSlice({
  name: 'orders', // Уникальное имя слайса
  initialState, 
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      // Обработка состояния при ожидании выполнения запроса
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки при ожидании
        state.error = null; 
      })
      // Обработка состояния при успешном выполнении запроса
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload; 
        state.loading = false; 
      })
      // Обработка состояния при неудачном выполнении запроса
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки при ошибке
        state.error = action.error.message || 'Failed to fetch orders'; // Устанавливаем сообщение об ошибке
      });
  }
});

// Экспортируем редьюсер для использования в store
export default ordersSlice.reducer;

export { fetchOrders };

export const selectOrders = (state: RootState) => state.orders.orders; 
export const selectLoading = (state: RootState) => state.orders.loading; 