/// <reference types="cypress" />

import ingredients from './ingredients.json';

const SELECTORS = {
  ingredientLink: '[data-test="ingredient-link"]',
  ingredientModal: '[data-test="ingredient-modal"]',
  modalCloseButton: '[data-test="modal-close-button"]',
  modalOverlay: '[data-test="modal-overlay"]'
};

describe('Взаимодействие с модальными окнами',  () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('модальное окно открывается', () => {
    cy.get(SELECTORS.ingredientLink).first().click(); // Клик по первому ингредиенту
    cy.get(SELECTORS.ingredientModal).should('be.visible'); // Проверка видимости модального окна
    cy.get(SELECTORS.ingredientModal)
      .contains('Детали ингредиента') // Проверка наличия текста в модальном окне
      .should('be.visible');
  });

  it('модальное окно закрывается по клику на кнопку закрытия', () => {
    cy.get(SELECTORS.ingredientLink).first().click(); // Клик по первому ингредиенту
    cy.get(SELECTORS.modalCloseButton).click(); // Клик по кнопке закрытия
    cy.get(SELECTORS.ingredientModal).should('not.exist'); // Проверка, что модальное окно закрыто
  });

  it('модальное окно закрывается по клику на оверлей', () => {
    cy.get(SELECTORS.ingredientLink).first().click(); // Клик по первому ингредиенту
    cy.get(SELECTORS.modalOverlay).click({ force: true }); // Клик по оверлею
    cy.get(SELECTORS.ingredientModal).should('not.exist'); // Проверка, что модальное окно закрыто
  });
});