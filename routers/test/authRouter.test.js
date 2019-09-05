const request = require('supertest')
const server = require('../../api/server')

describe('Auth Router (`/api/auth`)', () => {
  /**
   * POST /api/auth/register
   *
   *  Some scenarios to think about when writing these tests:
   *    - missing credentials
   *    - valid credentials
   */
  describe('POST /api/auth/register', () => {
    describe('Missing Credentials', () => {
      const mockMissingCredentials = {}
      
      test('should return HTTP status code 400', async () => {
        const response = await request(server)
          .post('/api/auth/register')
          .send(mockMissingCredentials)
        expect(response.status).toBe(400)
      })

      test('should return an error message', async () => {
        const missingCredentialsMsg =
          'Missing required properties, please include all ' +
          'of the following: name, email, and password'
        const response = await request(server)
          .post('/api/auth/register')
          .send(mockMissingCredentials)
        expect(response.body).toHaveProperty('error', missingCredentialsMsg)
      })
    })

    describe('Valid Credentials', () => {
      const mockValidCredentials = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'thispasswordnotsecure'
      }

      test('should return HTTP status code 201', async () => {
        const response = await request(server)
          .post('/api/auth/register')
          .send(mockValidCredentials)
        expect(response.status).toBe(201)
      })

      test('should return newly-created User object with hashed password', async () => {
        const response = await request(server)
          .post('/api/auth/register')
          .send(mockValidCredentials)
        expect(response.body).toHaveProperty('name', mockValidCredentials.name)
        expect(response.body).toHaveProperty('email', mockValidCredentials.email)
        expect(response.body).toHaveProperty('password')
        expect(response.body.password).not.toBe(mockValidCredentials.password)
       })
    })
  })

  /**
   * POST /api/auth/login
   *
   *  Some scenarios to think about when writing these tests:
   *    - missing credentials
   *    - invalid credentials
   *    - valid credentials
   */
  describe('POST /api/auth/login', () => {
    describe('Missing Credentials', () => {})
    describe('Invalid Credentials', () => {})
    describe('Valid Credentials', () => {})
  })
})
