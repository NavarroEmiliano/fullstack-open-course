describe('Note app', () => {
  beforeEach(() => {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Lenny',
      username: 'Lenny',
      password: 'Password1'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('front page can be opened', () => {
    cy.contains('Notes')
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2020'
    )
  })

  it('login form can be opened', () => {
    cy.contains('Login').click()
  })

  it('user can log in', () => {
    cy.contains('Login').click()
    cy.get('#username').type('Lenny')
    cy.get('#password').type('Password1')
    cy.get('#login-button').click()

    cy.contains('Lenny logged-in')
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'Lenny', password: 'Password1' })
    })

    it('a new note can be created', () => {
      cy.contains('New note').click()
      cy.get('#input-note').type('a note created by cypress')
      cy.contains('Save').click()
      cy.contains('Show all').click()
      cy.contains('a note created by cypress')
    })

    describe('and several notes exists', () => {
      beforeEach(() => {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('other of those can be made important', () => {
        cy.contains('Show all').click()
        cy.contains('second note').parent().find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain','make not important')
      })
    })
  })

  it('login fails with wrong password', function () {
    cy.contains('Login').click()
    cy.get('#username').type('Lenny')
    cy.get('#password').type('Password')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Lenny logged-in')
  })
})
