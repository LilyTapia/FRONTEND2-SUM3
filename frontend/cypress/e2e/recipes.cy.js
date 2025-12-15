describe('Recetario creativo · E2E', () => {
  it('navega desde el home al listado de recetas', () => {
    cy.visit('/');
    cy.contains('Explorar recetas').click();
    cy.url().should('include', '/recetas');
    cy.contains('Explora por categoría y dificultad').should('be.visible');
  });

  it('filtra por texto en el listado', () => {
    cy.visit('/recetas');
    cy.get('input[placeholder="Buscar por nombre o dificultad"]').type('curry');
    cy.contains('Curry cremoso de garbanzos').should('be.visible');
    cy.contains('Tiramisú clásico').should('not.exist');
  });

  it('filtra por categoría y muestra solo postres', () => {
    cy.visit('/recetas');
    cy.contains('Postre').click();
    cy.contains('Tiramisú clásico').should('be.visible');
    cy.contains('Ramen casero de pollo').should('not.exist');
  });

  it('guarda una receta desde el detalle y refleja el contador', () => {
    cy.visit('/recetas');
    cy.contains('Tiramisú clásico')
      .parents('article')
      .within(() => cy.contains('Ver detalles').click());
    cy.url().should('include', '/receta/1');
    cy.contains('Guardar receta').click();
    cy.contains('Quitar de guardadas').should('be.visible');
    cy.get('header').contains('Guardadas').within(() => {
      cy.contains('1').should('be.visible');
    });
  });
});
