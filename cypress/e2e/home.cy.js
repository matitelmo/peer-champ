describe('Home Page', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('Get started by editing').should('be.visible');
    cy.contains('Save and see your changes instantly').should('be.visible');
  });

  it('should display the Next.js logo', () => {
    cy.visit('/');
    cy.get('img[alt="Next.js logo"]').should('be.visible');
  });

  it('should have action buttons', () => {
    cy.visit('/');
    cy.contains('Deploy now').should('be.visible');
    cy.contains('Read our docs').should('be.visible');
  });
});
