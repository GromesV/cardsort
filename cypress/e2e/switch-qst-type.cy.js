describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://192.168.0.12:8080/')
    cy.get('[data-cy="select-styling"]').select('cards')
  })
})