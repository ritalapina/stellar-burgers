/// <reference types="cypress" />

import user from './user.json'; // Обновленные данные о пользователе
import orderSuccess from './order.json'; // Обновленные данные о заказе
import ingredients from './ingredients.json';

const SELECTORS = {
  orderButton: '[data-test="order-button"]',
  orderNumber: '[data-test="order-number"]',
  modalCloseButton: '[data-test="modal-close-button"]',
  orderModal: '[data-test="order-modal"]'
};

describe('оформляем заказ', () => {
  beforeEach(() => {
    // Мокируем запрос данных пользователя
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: user.user
      }
    }).as('getUser');

    // Мокируем запрос ингредиентов
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as('getIngredients');

    // Мокируем запрос на создание заказа
    cy.intercept('POST', '**/orders', (req) => {
      req.reply({
        statusCode: 200,
        body: orderSuccess
      });
    }).as('createOrder');

    // Устанавливаем токены перед каждым тестом
    cy.then(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'Bearer fake-access-token');
    });

    // Переходим на главную страницу
    cy.visit('/');
  });

  it('успешно оформляем заказ', () => {
    // Кликаем на кнопку добавления первой булки
    cy.get('.add-button-bun').first().click({ force: true });
    // Кликаем на кнопку добавления первой основной начинки
    cy.get('.add-button-main').first().click({ force: true });
    // Кликаем кнопку оформления заказа
    cy.get(SELECTORS.orderButton).first().click({ force: true });
    // Проверяем, что модальное окно с заказом открылось
    cy.get('#modals').find(SELECTORS.orderModal).should('exist');
    // Проверяем, что номер заказа совпадает
    cy.get(SELECTORS.orderNumber).should('contain', orderSuccess.order.number);
    // Кликаем на кнопку, чтобы закрыть модалку
    cy.get('#modals').find(SELECTORS.modalCloseButton).click();
    // Проверяем, что модальное окно закрылось
    cy.get('#modals').find(SELECTORS.orderModal).should('not.exist');
    // Проверяем, что в конструкторе нет элементов
    cy.get('.constructor-element').should('not.exist');
  });
});