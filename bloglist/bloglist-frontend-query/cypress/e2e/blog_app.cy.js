describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'user1',
      name: 'user user1',
      password: 'aaa',
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('user1')
      cy.get('#password').type('aaa')
      cy.get('#login-button').click()
      cy.contains('user user1 logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('user1')
      cy.get('#password').type('aab')
      cy.get('#login-button').click()
      cy.contains('user user1 logged in').should('not.exist')
      cy.contains('invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('user1')
      cy.get('#password').type('aaa')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function () {
      cy.contains('new note').click()
      cy.get('#title').type('title1')
      cy.get('#author').type('author1')
      cy.get('#url').type('url1')
      cy.get('#create-button').click()
      cy.contains('a new blog title1 by author1 added')
      cy.contains('title1 author1').contains('view').click()
      cy.contains('url1')
    })

    it('A blog can be liked', function () {
      cy.contains('new note').click()
      cy.get('#title').type('title1')
      cy.get('#author').type('author1')
      cy.get('#url').type('url1')
      cy.get('#create-button').click()
      cy.contains('title1 author1').contains('view').click()
      cy.contains('title1 author1').contains('likes 0')
      cy.contains('title1 author1').find('button').contains('like').click()
      cy.contains('title1 author1').contains('likes 1')
    })

    it('A blog can be deleted by creator', function () {
      cy.contains('new note').click()
      cy.get('#title').type('title1')
      cy.get('#author').type('author1')
      cy.get('#url').type('url1')
      cy.get('#create-button').click()
      cy.contains('title1 author1').contains('view').click()
      cy.contains('title1 author1').contains('remove').click()
      cy.contains('blog title1 by author1 removed')
      cy.contains('title1 author1').should('not.exist')
    })

    it('Only the creator can see the delete button of a blog', function () {
      cy.contains('new note').click()
      cy.get('#title').type('title1')
      cy.get('#author').type('author1')
      cy.get('#url').type('url1')
      cy.get('#create-button').click()
      cy.contains('title1 author1').contains('view').click()
      cy.contains('title1 author1').contains('remove').should('be.visible')

      cy.contains('logout').click()
      cy.request('POST', 'http://localhost:3003/api/users', {
        username: 'user2',
        name: 'user user2',
        password: 'aaa',
      })
      cy.get('#username').type('user2')
      cy.get('#password').type('aaa')
      cy.get('#login-button').click()
      cy.contains('title1 author1').contains('view').click()
      cy.contains('title1 author1').contains('remove').should('not.be.visible')
    })

    it('Blogs are ordered according to likes', function () {
      cy.contains('new note').click()
      cy.get('#title').type('title1')
      cy.get('#author').type('author1')
      cy.get('#url').type('url1')
      cy.get('#create-button').click()

      cy.contains('new note').click()
      cy.get('#title').type('title2')
      cy.get('#author').type('author2')
      cy.get('#url').type('url2')
      cy.get('#create-button').click()
      cy.contains('title2 author2').contains('view').click()
      cy.contains('title2 author2').find('button').contains('like').click()
      cy.contains('title2 author2').contains('likes 1')
      cy.contains('title2 author2').find('button').contains('like').click()

      cy.contains('new note').click()
      cy.get('#title').type('title3')
      cy.get('#author').type('author3')
      cy.get('#url').type('url3')
      cy.get('#create-button').click()
      cy.contains('title3 author3').contains('view').click()
      cy.contains('title3 author3').find('button').contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'title2')
      cy.get('.blog').eq(1).should('contain', 'title3')
      cy.get('.blog').eq(2).should('contain', 'title1')
    })
  })
})