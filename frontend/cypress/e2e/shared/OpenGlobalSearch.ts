export const openGlobalSearch = () => {
    cy.get('[data-testid="cypress-global-search"]', { withinSubject: null }).click();
    cy.get('[data-testid="cypress-global-search-footer"]').should('exist').should('be.visible');
};
