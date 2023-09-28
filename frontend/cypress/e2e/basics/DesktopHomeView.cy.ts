const PAGE_SIZE = 46;
describe('Desktop home view', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5174/');
    });
    it('Desktop: Renders logo', () => {
        cy.get('img').should('exist').should('be.visible');
    });
    it('Desktop: Display grid items', () => {
        cy.get('tr').should('have.length.at.least', 1);
    });
    it('Desktop: Scroll and load more items', () => {
        cy.waitUntil(
            () =>
                cy
                    .get('tr')
                    .should('have.length', PAGE_SIZE)
                    .then(() => true),
            {timeout: 2000, interval: 1000},
        );

        cy.get('tr').should('have.length.at.least', PAGE_SIZE);
        cy.scrollTo('bottom');
        cy.wait(5000);
        cy.get('tr').should('have.length.greaterThan', PAGE_SIZE);
    });
    it('Desktop: signIn modal', () => {
        cy.get('[data-testid="cypress-open-sign-in-modal-btn"]').click();
        cy.wait(1000);
        cy.get('[data-testid="cypress-sign-in-modal"]').should('be.visible');
    });
    it('Desktop: signUp modal', () => {
        cy.get('[data-testid="cypress-open-sign-up-modal-btn"]').click();
        cy.wait(1000);
        cy.get('[data-testid="cypress-sign-up-modal"]').should('be.visible');
    });
});
