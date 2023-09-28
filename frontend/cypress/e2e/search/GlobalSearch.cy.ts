import { openModal } from 'cypress/e2e/shared';
import { openGlobalSearch } from 'cypress/e2e/shared/OpenGlobalSearch';
import { openGlobalSearchWithNothingFoundPanel } from 'cypress/e2e/shared/OpenGlobalSearchWithNothingFoundPanel';

describe('Global search', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5174/');
    });

    it('Search and select course', () => {
        openGlobalSearch();
        cy.get('[data-testid="cypress-global-search-input"]').type('Software Engineering');
        cy.get('[data-testid="cypress-global-search-item"]').should('have.length.at.least', 1);
        cy.get('[data-testid="cypress-global-search-item"]').first().click();
        cy.url().should('include', '/courses/');
    });

    it('Desktop: search and "nothing found" panel appear', () => {
        openGlobalSearchWithNothingFoundPanel();
    });

    it('Desktop: open add new course modal from "nothing found" panel and add new course', () => {
        openGlobalSearchWithNothingFoundPanel();
        openModal('add-new-course');
    });
});
