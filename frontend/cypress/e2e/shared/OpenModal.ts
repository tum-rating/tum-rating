export const openModal = (action: string) => {
    cy.get(`[data-testid="cypress-open-${action}-modal-btn"]`).click();
    cy.wait(1000);
    cy.get(`[data-testid="cypress-${action}-modal"]`).should('be.visible');
};
