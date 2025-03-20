Cypress.Commands.add('login', (username, password) => {
  cy.contains('a', 'Log in').click()
  cy.get('input[id=loginusername]').type(username, { force: true })
  cy.get('input[id=loginpassword]').type(password, { force: true })
  cy.contains('button', 'Log in').click()
})
