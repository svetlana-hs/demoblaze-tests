# demoblaze-tests

End-to-end tests for the login and for the purchase flows. The selection of the cases is based on their expected frequency and business impact.

For the login flow three cases are automated:

1. Successful login as the most popular positive case,
2. Error for wrong password as the most popular negative case,
3. Error for empty credentials to check validation of the login form.

For the purchase flow four cases are automated:

1. Successful purchase of the selected product as the most popular positive case,
2. Successful purchase with change of product as a probable popular positive case,
3. Error for blank credit card as a risky negative case, we should't allow placing an order without payment,
4. Error for placing an empty order as a risky negative case, to avoid creating garbage orders.

Important information: tests are proven to run in Chrome and Electron. Forth case for the purchase flow fails, because there is a bug on the platform, which allows an empty order to be placed.

Tests are designed as much as possible in accorging with recommendations of Cypress official documentation.

## Cypress Installation and Test Execution

First, make sure you meet the [system requirements](https://docs.cypress.io/app/get-started/install-cypress#System-requirements) including [operating system](https://docs.cypress.io/app/get-started/install-cypress#Operating-System), installation of [Node.js](https://docs.cypress.io/app/get-started/install-cypress#Nodejs) and a [supported package manager](https://docs.cypress.io/app/get-started/install-cypress#Package-Manager).

### Clone the repository and navigate into the project directory

```sh
git clone <repository-url>
cd <project-directory>
```

### Install dependencies

```sh
npm install
```

### Open Cypress in interactive mode

```sh
npx cypress open
```

### Or run tests in headless mode

```sh
npx cypress run
```

## Run a specific test

```sh
npx cypress run --spec "cypress/e2e/purchase.cy.js"
```
