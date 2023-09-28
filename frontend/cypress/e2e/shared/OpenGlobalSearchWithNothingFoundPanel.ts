import { openGlobalSearch } from 'cypress/e2e/shared/OpenGlobalSearch';

export const openGlobalSearchWithNothingFoundPanel = () => {
    openGlobalSearch();
    cy.get('[data-testid="cypress-global-search-input"]').type('konstantynopolitańczykowianeczka');
    cy.get('[data-testid="cypress-global-search-item"]').should('have.length', 0);
    cy.get('[data-testid="cypress-global-search-nothing-found-img"]').should('exist').should('be.visible');
    cy.get('[data-testid="cypress-global-search-nothing-found-text"]').should('exist').should('be.visible');
    cy.get('[data-testid="cypress-open-add-new-course-modal-btn"]').should('exist').should('be.visible');
};
