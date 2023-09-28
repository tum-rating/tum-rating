import { endpoints } from '@/api';
import { faker } from '@faker-js/faker';
import { openModal } from 'cypress/e2e/shared';

const signIn = (username: string, password: string, email: string) => {
    cy.get('[data-testid="cypress-login-username-input"]', { withinSubject: null }).type(username);
    cy.get('[data-testid="cypress-login-email-input"]', { withinSubject: null }).type(email);
    cy.get('[data-testid="cypress-login-password-input"]', { withinSubject: null }).type(password).type('{enter}');
};

describe('Auth: Register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5174/');
    });
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const email = `${username}@tum.de`;

    it('Register: Unsuccessful login with form (wrong email)', () => {
        cy.intercept('POST', endpoints.signup).as('registerRequest');
        openModal('sign-up');
        signIn(username, password, email.slice(0, -1));
        cy.wait('@registerRequest').then((interception) => {
            if (interception.response) {
                expect(interception.response.statusCode).to.equal(400);
            } else {
                throw new Error('No response from login request');
            }
        });
    });

    it('Register: successful login with form', () => {
        cy.intercept('POST', endpoints.signup).as('registerRequest');
        openModal('sign-up');
        signIn(username, password, email);
        cy.wait('@registerRequest').then((interception) => {
            if (interception.response) {
                expect(interception.response.statusCode).to.equal(201);
            } else {
                throw new Error('No response from login request');
            }
        });
    });

    it('Register: Unsuccessful login with form (account exist)', () => {
        cy.intercept('POST', endpoints.signup).as('registerRequest');
        openModal('sign-up');
        signIn(username, password, email);
        cy.wait('@registerRequest').then((interception) => {
            if (interception.response) {
                expect(interception.response.statusCode).to.equal(409);
            } else {
                throw new Error('No response from login request');
            }
        });
    });
});
