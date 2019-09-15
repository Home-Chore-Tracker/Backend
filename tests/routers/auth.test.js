const request = require('supertest')
const server = require('../../api/server')
const db = require('../../database/config')

beforeAll(async () => {
  await db('users').truncate()
  await db.seed.run()
})

afterAll(async () => {
  await db('users').truncate()
  await db.seed.run()
})

describe('Auth Router - `/api/auth`', () => {
  beforeEach(async () => {
    await db('users').truncate()
    await db.seed.run()
  })

  describe('POST /api/auth/register', () => {
    test('should return HTTP status code 200 when successful', async () => {
      const validMockData = {
        name: 'Test User',
        email: 'testuser_999@example.com',
        password: 'password',
      }

      const response = await request(server)
        .post('/api/auth/register')
        .send(validMockData)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('name', validMockData.name)
      expect(response.body).toHaveProperty('email', validMockData.email)
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty('jwt')
      expect(response.body).toHaveProperty('id')
      expect(response.body)
        .not.toHaveProperty('password', validMockData.password)
    })

    test('should return HTTP status code 400 when missing data', async () => {
      const invalidMockData = {
        name: 'Test User',
        email: null,
      }
      
      const response = await request(server)
        .post('/api/auth/register')
        .send(invalidMockData)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/auth/login', () => {
    test('should return HTTP status code 200 when successful', async () => {
      const validLoginCredentials = {
        email: 'testuser@example.com',
        password: 'password',
      }

      const response = await request(server)
        .post('/api/auth/login')
        .send(validLoginCredentials)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('token')
    })

    test('should return HTTP status code 400 when missing data', async () => {
      const missingCredentials = {
        email: 'testuser@example.com',
        password: null,
      }

      const response = await request(server)
        .post('/api/auth/login')
        .send(missingCredentials)

      expect(response.status).toBe(400)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('error')
    })

    test('should return HTTP status code 401 when invalid credentials', async () => {
      const invalidCredentials = {
        email: 'testuser@example.com',
        password: 'notthecorrectpassword',
      }

      const response = await request(server)
        .post('/api/auth/login')
        .send(invalidCredentials)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/auth/logout', () => {
    test('should return HTTP status code 200 when successful', async () => {
      const validLoginCredentials = {
        email: 'testuser@example.com',
        password: 'password',
      }
      const { body } = await request(server)
        .post('/api/auth/login')
        .send(validLoginCredentials)

      const token = body.token

      const response = await request(server)
        .post('/api/auth/logout')
        .set('Authorization', token)

      expect(response.status).toBe(302)
    })

    test('should return HTTP status code 401 when invalid/missing token', async () => {
      const token = null

      const response = await request(server)
        .post('/api/auth/logout')
        .set('Authorization', token)

      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('error')      
    })
  })
})
