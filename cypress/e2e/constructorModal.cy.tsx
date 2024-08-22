import ingredients from './ingredients.json';

const SELECTORS = {
  ingredientLink: '[data-test="ingredient-link"]',
  ingredientModal: '[data-test="ingredient-modal"]',
  modalCloseButton: '[data-test="modal-close-button"]',
  modalOverlay: '[data-test="modal-overlay"]',
};

describe('Проверка открытия и закрытия модального окна с ингредиентом', () => {
  beforeEach(() => {
    // Мокаем серверный запрос для получения ингредиентов
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');
    // Переходим на главную страницу
    cy.visit('/');
    // Ждем завершения запроса на получение ингредиентов
    cy.wait('@getIngredients');
  });

  it('открывает модальное окно при клике на контейнер с ингредиентом', function () {
    // Кликаем на первый ингредиент
    cy.get(SELECTORS.ingredientLink).first().click({ force: true });
    // Проверяем, что модальное окно открыто
    cy.get(SELECTORS.ingredientModal).should('exist');
  });

  it('закрывает модальное окно при нажатии на кнопку закрытия', () => {
    // Открываем модальное окно
    cy.get(SELECTORS.ingredientLink).first().click({ force: true });
    // Удаляем оверлей, если он существует
    cy.get('iframe').then($iframe => {
      if ($iframe.length) {
        $iframe.remove();
      }
    });
    // Кликаем на кнопку закрытия
    cy.get(SELECTORS.modalCloseButton).click();

    // Ждем, пока модальное окно закроется
    cy.get(SELECTORS.ingredientModal).should('not.exist'); // Ожидание удаления модального окна из DOM
  });

  it('закрывает модальное окно при нажатии клавиши Escape', function () {
    // Открываем модальное окно
    cy.get(SELECTORS.ingredientLink).first().click({ force: true });
    // Проверяем, что модальное окно открыто
    cy.get(SELECTORS.ingredientModal).should('exist');
    // Нажимаем клавишу Escape
    cy.get('body').type('{esc}');
    // Проверяем, что модальное окно закрыто
    cy.get(SELECTORS.ingredientModal).should('not.exist');
  });

  it('закрывает модальное окно при клике на оверлей', function () {
    // Открываем модальное окно
    cy.get(SELECTORS.ingredientLink).first().click({ force: true });
    // Проверяем, что модальное окно открыто
    cy.get(SELECTORS.ingredientModal).should('exist');
    // Удаляем оверлей, если он существует
    cy.get('iframe').then($iframe => {
      if ($iframe.length) {
        $iframe.remove();
      }
    });
    // Кликаем на оверлей
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    // Проверяем, что модальное окно закрыто
    cy.get(SELECTORS.ingredientModal).should('not.exist');
  });
});