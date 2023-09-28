export const openDrawer = () => {
    cy.get('[data-testid="cypress-drawer"]').should('not.be.visible');
    cy.get('[data-testid="cypress-burger"]').click();
    cy.get('[data-testid="cypress-drawer"]').should('be.exist');
};
