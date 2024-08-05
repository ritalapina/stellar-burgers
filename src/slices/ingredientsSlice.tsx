import { getIngredientsApi } from '@api'; // Импорт функции для получения ингредиентов
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // Импорт необходимых функций из Redux Toolkit
import { TIngredient } from '@utils-types'; // Импорт типа для ингредиента
import { RootState } from '../services/store'; // Импорт корневого состояния

// Интерфейс состояния ингредиентов
interface IngredientsState {
  ingredients: TIngredient[]; 
  loading: boolean; 
  error: string | null; 
}

// Начальное состояние ингредиентов
const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

// Асинхронная Thunk-функция для получения данных ингредиентов
const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'burger/fetchIngredients',
  async () => await getIngredientsApi() // Возвращаем результат запроса через API
);

// Создание слайса для управления состоянием ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.error = null; 
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
   
        state.loading = false; // Сбрасываем флаг загрузки
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        // Ошибка при получении данных
        state.loading = false; 
        state.error = action.error.message || 'Failed to fetch ingredients'; // Устанавливаем сообщение об ошибке
      });
  }
});

export { fetchIngredients }; 

// Селекторы для извлечения состояния из Redux
export const selectIngredients = (state: RootState) => state.ingredients.ingredients; // Селектор для получения ингредиентов
export const selectLoading = (state: RootState) => state.ingredients.loading; // Селектор для получения состояния загрузки

export default ingredientsSlice.reducer; 