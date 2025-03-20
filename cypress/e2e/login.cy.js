// load fixture
beforeEach(function () {
  cy.visit('/')
  cy.fixture('user').as('user')
})

it('logs in with correct credentials', function () {
  const user = this.user

  cy.log('log in')
  cy.login(user.name, user.password)

  cy.log('check that we are logged in')
  cy.contains('Log out').should('be.visible')
  cy.contains(`Welcome ${user.name}`).should('be.visible')
})

it('shows an error when login with incorrect password', function () {
  cy.log('log in')
  cy.login(this.user.name, '123')

  cy.log('check an error')
  cy.on('window:alert', (text) => {
    expect(text).to.equal('Wrong password')
  })
})

it('shows an error when login without credentials', () => {
  cy.log('log in')
  cy.contains('a', 'Log in').click()
  cy.contains('button', 'Log in').click()

  cy.log('check an error')
  cy.on('window:alert', (text) => {
    expect(text).to.equal('Please fill out Username and Password.')
  })
})
