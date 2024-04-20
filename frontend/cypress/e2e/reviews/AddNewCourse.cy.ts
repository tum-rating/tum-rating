import { openModal } from 'cypress/e2e/shared';
import { openGlobalSearchWithNothingFoundPanel } from 'cypress/e2e/shared/OpenGlobalSearchWithNothingFoundPanel';

import { endpoints } from '@/api';

describe('Reviews', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5174/');
    });

    it('Reviews: Add new course', () => {
        cy.intercept('POST', endpoints.postReviewProposal).as('addNewCourseRequest');
        openGlobalSearchWithNothingFoundPanel();
        openModal('add-new-course');
        cy.get("[data-testid='cypress-add-new-course-name-input']", { withinSubject: null }).type('Test Course');
        cy.get("[data-testid='cypress-add-new-course-professor-input']", { withinSubject: null }).type('Test Professor');
        cy.get("[data-testid='cypress-add-new-course-semester-select']", { withinSubject: null }).click();
        cy.wait(100);
        cy.get('.mantine-Select-item', { withinSubject: null }).contains('2023 S').click();
    });
});
