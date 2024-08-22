import * as reduxToolkit from '@reduxjs/toolkit';
import burgerSlice from '../slices/burgerSlice';
import userSlice from '../slices/userSlice';
import ingredientsSlice from '../slices/ingredientsSlice';
import ordersSlice from '../slices/ordersSlice';
import feedSlice from '../slices/feedSlice';

// мокируем все слайсы
jest.mock('../slices/burgerSlice', () => jest.fn(() => ({})));
jest.mock('../slices/userSlice', () => jest.fn(() => ({})));
jest.mock('../slices/ingredientsSlice', () => jest.fn(() => ({})));
jest.mock('../slices/ordersSlice', () => jest.fn(() => ({})));
jest.mock('../slices/feedSlice', () => jest.fn(() => ({})));

// мокируем @reduxjs/toolkit
jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  combineReducers: jest.fn() // мок combineReducers
}));

describe('тест корневого редьюсера', () => {
  it('должен правильно комбинировать все редьюсеры', () => {
    // фейковый стейт стора
    const fakeState = {
      burger: { someData: 'burger' },
      user: { someData: 'user' },
      ingredients: { someData: 'ingredients' },
      orders: { someData: 'orders' },
      feed: { someData: 'feed' }
    };

    // настраиваем combineReducers, чтобы он вернул функциию, которая вернёт наш фейковый стейт (имитация работы combineReducers)
    const mockCombineReducers = jest.fn(() => () => fakeState);
    (reduxToolkit.combineReducers as jest.Mock).mockImplementation(
      mockCombineReducers
    );

    const { default: store } = require('./store');

    // проверяем, что combineReducers был вызван с нашими функциями
    expect(reduxToolkit.combineReducers).toHaveBeenCalledWith({
      burger: burgerSlice,
      user: userSlice,
      ingredients: ingredientsSlice,
      orders: ordersSlice,
      feed: feedSlice
    });

    expect(store.getState()).toEqual(fakeState);
  });
});
