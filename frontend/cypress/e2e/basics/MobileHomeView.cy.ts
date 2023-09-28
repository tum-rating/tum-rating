import { openDrawer } from 'cypress/e2e/shared';

const MOBILE_PAGE_SIZE = 46;
describe('Mobile home view', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5174/');
    });
    it('Mobile: renders logo', () => {
        cy.viewport('iphone-6');
        cy.get('img').should('exist').should('be.visible');
    });
    it('Mobile: display table items', () => {
        cy.viewport('iphone-6');
        cy.get('tr').should('have.length.at.least', 1);
    });

    it('Mobile: should open and close the mobile drawer', () => {
        cy.viewport('iphone-6');
        openDrawer();
    });
    it('Mobile: Scroll and load more items', () => {
        cy.viewport('iphone-6');
        cy.waitUntil(
            () =>
                cy
                    .get('tr')
                    .should('have.length', MOBILE_PAGE_SIZE)
                    .then(() => true),
            { timeout: 2000, interval: 1000 },
        );

        cy.get('tr').should('have.length.at.least', MOBILE_PAGE_SIZE);
        cy.scrollTo('bottom');
        cy.wait(5000);
        cy.get('tr').should('have.length.greaterThan', MOBILE_PAGE_SIZE);
    });
    it('Mobile: signIn modal', () => {
        cy.viewport('iphone-6');
        openDrawer();
        cy.wait(1000);
        cy.get('[data-testid="cypress-drawer"] [data-testid="cypress-open-sign-in-modal-btn"]').click();
        cy.wait(1000);
        cy.get('[data-testid="cypress-sign-in-modal"]').should('be.visible');
    });
    it('Mobile: signUn modal', () => {
        cy.viewport('iphone-6');
        openDrawer();
        cy.wait(1000);
        cy.get('[data-testid="cypress-drawer"] [data-testid="cypress-open-sign-up-modal-btn"]').click();
        cy.wait(1000);
        cy.get('[data-testid="cypress-sign-up-modal"]').should('be.visible');
    });
});
