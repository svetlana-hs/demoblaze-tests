// add a product to cart
const addToCart = (product) => {
  cy.get('.list-group-item').contains('Laptops').click()
  cy.contains('a', product).click()
  cy.contains('a', 'Add to cart').click()
}

// fill the purchase form
const fillPurchaseForm = (data) => {
  Object.entries(data).forEach(([key, value]) => {
    cy.get(`#${key}`).type(value)
  })
}

// wait for cart loading
const waitForCart = () => {
  cy.intercept('POST', Cypress.env('apiBaseUrl') + '/view').as('viewCart')
  cy.wait('@viewCart').its('response.statusCode').should('eq', 200)
}

// load fixtures and clear the cart
beforeEach(() => {
  cy.fixture('user').as('user')
  cy.fixture('customer').as('customer')
  cy.fixture('laptops').as('laptops')

  cy.visit('/')
  cy.get('@user').then((user) => {
    cy.log('log in as a registered user')
    cy.login(user.name, user.password)
    cy.log('clear the cart')
    cy.request({
      url: Cypress.env('apiBaseUrl') + '/deletecart',
      method: 'POST',
      body: {
        cookie: `${user.name}`
      }
    })
      .its('status')
      .should('eq', 200)
  })
})

it('buys a laptop as a logged user and check purchase details', function () {
  const laptop = this.laptops[0]
  const customer = this.customer

  cy.log('add a laptop to the cart')
  addToCart(laptop.model)

  cy.log('check the cart and click Place Order')
  cy.get('#cartur').click()

  cy.log('wait for cart loading')
  waitForCart()
  cy.contains('div.table-responsive', `${laptop.model}`)
  cy.contains('#totalp', `${laptop.price}`)
  cy.contains('button', 'Place Order').click()

  cy.log('fill the form and click Purchase')
  fillPurchaseForm(customer)
  cy.contains('button', 'Purchase').click()

  cy.log('check the purchase was successful')
  cy.contains('h2', 'Thank you for your purchase!').should('be.visible')
  cy.contains('div.sweet-alert', `Amount: ${laptop.price} ${laptop.currency}`).should('be.visible')
  cy.contains('div.sweet-alert', `Card Number: ${customer.card}`).should('be.visible')
  cy.contains('div.sweet-alert', `Name: ${customer.name}`).should('be.visible')

  cy.log('click OK')
  cy.contains('button', 'OK').click({ force: true })
})

it('buys a laptop after change the model', function () {
  const laptops = this.laptops
  const customer = this.customer

  cy.log('add a laptop to the cart')
  addToCart(laptops[0].model)

  cy.log('go to the cart and remove the laptop')
  cy.get('#cartur').click()
  cy.contains('div.table-responsive', `${laptops[0].model}`)
  cy.contains('a', 'Delete').click()
  cy.contains('div.table-responsive', `${laptops[0].model}`).should('not.exist')

  cy.log('add another laptop to the cart')
  cy.contains('a', 'Home').click()
  addToCart(laptops[1].model)

  cy.log('go to the cart and check the laptop')
  cy.get('#cartur').click()

  cy.log('wait for cart loading')
  waitForCart()
  cy.contains('div.table-responsive', `${laptops[1].model}`)

  cy.log('click Place Order')
  cy.contains('button', 'Place Order').click()

  cy.log('fill the form and click Purchase')
  fillPurchaseForm(customer)
  cy.contains('button', 'Purchase').click()

  cy.log('check the purchase was successful')
  cy.contains('h2', 'Thank you for your purchase!').should('be.visible')
  cy.contains('div.sweet-alert', `Amount: ${laptops[1].price} ${laptops[1].currency}`).should(
    'be.visible'
  )
  cy.contains('div.sweet-alert', `Card Number: ${customer.card}`).should('be.visible')
  cy.contains('div.sweet-alert', `Name: ${customer.name}`).should('be.visible')

  cy.log('Click OK')
  cy.contains('button', 'OK').click({ force: true })
})

it('shows an error message when credit card is empty', function () {
  const laptop = this.laptops[1]
  const customer = this.customer

  cy.log('add a laptop to the cart')
  addToCart(laptop.model)

  cy.log('go to the cart')
  cy.get('#cartur').click()

  cy.log('wait for cart loading')
  waitForCart()

  cy.log('click Place Order')
  cy.contains('button', 'Place Order').click()

  cy.log('fill the form and click Purchase')
  delete customer.card
  fillPurchaseForm(customer)
  cy.contains('button', 'Purchase').click()

  cy.log('check an error')
  cy.on('window:alert', (text) => {
    expect(text).to.equal('Please fill out Name and Creditcard.')
  })
})

it('shows a disable button for empty cart', function () {
  cy.log('go to the empty cart')
  cy.get('#cartur').click()

  cy.log('check that the button is disabled')
  cy.contains('button', 'Place Order').should('be.disabled')
})
