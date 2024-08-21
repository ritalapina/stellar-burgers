import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { fetchFeed, initialState } from './feedSlice';
import { TFeedsResponse } from '../utils/burger-api';


const createTestStore = (preloadedState = initialState) =>
  configureStore({
    reducer: { feed: feedReducer }
  });

describe('тестируем feedSlice', () => {
  it('тестирум fetchFeed.pending', () => {
    // создаём стор
    const store = createTestStore();
    // запускаем fetchFeed в состоянии pending
    store.dispatch({ type: fetchFeed.pending.type });
    // получаем feed из стейта
    const state = store.getState().feed;
    // проверяем, что loading является true
    expect(state.loading).toBe(true);
    // проверяем, что нет ошибки
    expect(state.error).toBe(null);
  });

  it('тестирум fetchFeed.fulfilled', () => {
    const store = createTestStore();
    // мок серверного ответа на запрос 
    const mockFeedResponse: TFeedsResponse = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Test Order',
          createdAt: '2024-08-09T12:34:56Z',
          updatedAt: '2024-08-09T12:34:56Z',
          number: 1,
          ingredients: ['ingredient1', 'ingredient2']
        }
      ],
      total: 100,
      totalToday: 10
    };
  
    store.dispatch({
      type: fetchFeed.fulfilled.type,
      payload: mockFeedResponse
    });

    const state = store.getState().feed;
    // проверяем, что loading false
    expect(state.loading).toBe(false);
    // првоеряем, что feed содержит наши моковые данные
    expect(state.feed).toEqual(mockFeedResponse);
    // проверяем, что ошибки нет
    expect(state.error).toBe(null);
  });

  it('тестирум fetchFeed.rejected', () => {
    const store = createTestStore();
    // мокаем ошибку
    const mockError = 'Failed to fetch feed';

    store.dispatch({
      type: fetchFeed.rejected.type,
      error: { message: mockError }
    });

    const state = store.getState().feed;

    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
  });
});
