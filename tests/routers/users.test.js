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

describe('Users Router - `/api/users`', () => {
  let token;
  beforeEach(async () => {
    await db('users').truncate()
    await db.seed.run()
    
    const validLoginCredentials = {
      email: 'testuser@example.com',
      password: 'password',
    }

    const response = await request(server)
      .post('/api/auth/login')
      .send(validLoginCredentials)

    token = response.body.token
  })

  describe('GET /api/users/me', () => {
    test('should return HTTP status code 200', async () => {
      const response = await request(server)
        .get('/api/users/me')
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('email')
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty('jwt')
    })
  })

  describe('PUT /api/users/me', () => {
    test('should return HTTP status code 200 when updated', async () => {
      const mockUpdates = {
        name: 'Test User',
        email: 'user.test@example.com'
      }

      const response = await request(server)
        .put('/api/users/me')
        .send(mockUpdates)
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('name', mockUpdates.name)
      expect(response.body).toHaveProperty('email', mockUpdates.email)
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty('jwt')
    })
  })

  describe('DELETE /api/users/me', () => {
    test('should return HTTP status code 204 when deleted', async () => {
      const response = await request(server)
        .delete('/api/users/me')
        .set('Authorization', token)

      expect(response.status).toBe(204)
    })
  })
})
