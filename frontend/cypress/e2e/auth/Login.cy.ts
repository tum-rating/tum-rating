import { endpoints } from '@/api';
import { openModal } from 'cypress/e2e/shared';

export const signIn = (success: boolean) => {
    const username = success ? Cypress.env('username') : 'aaaaa@tum.de';
    const password = success ? Cypress.env('password') : 'bbbbb';
    cy.get('[data-testid="cypress-login-email-input"]', { withinSubject: null }).type(username);
    cy.get('[data-testid="cypress-login-password-input"]', { withinSubject: null }).type(password).type('{enter}');
};

describe('Auth: form login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5174/');
    });

    it('Login: successful login with form', () => {
        cy.intercept('POST', endpoints.signin).as('loginRequest');
        openModal('sign-in');
        signIn(true);
        cy.wait('@loginRequest').then((interception) => {
            if (interception.response) {
                expect(interception.response.statusCode).to.equal(200);
            } else {
                throw new Error('No response from login request');
            }
        });
    });
    it('Login: unsuccessful login with form (wrong credentials)', () => {
        cy.intercept('POST', endpoints.signin).as('loginRequest');
        openModal('sign-in');
        signIn(false);
        cy.wait('@loginRequest').then((interception) => {
            if (interception.response) {
                expect(interception.response.statusCode).to.equal(401);
            } else {
                throw new Error('No response from login request');
            }
        });
    });
});
