/// <reference types="cypress" />

import ingredients from './ingredients.json';

describe('проверяем, что при клике в конструктор добавляется булка и начинка', () => {
  beforeEach(() => {
    // мок серверного запроса ингредиентов
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as(
      'getIngredients'
    );
    // идём на главную страницу
    cy.visit('/');
    // ждём, пока выполнится запрос ингредиентов
    cy.wait('@getIngredients');
  });

  it('добавление булки в конструктор', () => {
    // берём первую булку из моковых данных
    const bun = ingredients.data.find((item) => item.type === 'bun');
    // кликаем на кнопку добавления первой булки
    cy.get('.add-button-bun').first().click({ force: true });
    // проверяем, что в конструкторе вверху появилась та самая булка
    cy.get('.constructor-element_pos_top').should('contain', bun!.name);
    // проверяем, что в конструкторе внизу появилась та самая булка
    cy.get('.constructor-element_pos_bottom').should('contain', bun!.name);
  });

  it('добавление начинки в конструктор', () => {
    // забираем первый основной ингредиент
    const mainIng = ingredients.data.find((item) => item.type === 'main');
    // кликаем на кнопку добавления первой основной начинки
    cy.get('.add-button-main').first().click({ force: true });
    // проверяем, что в конструкторе среди начинок появился тот самый ингредиент
    cy.get('.constructor-element__row').should('contain', mainIng!.name);
  });
});
