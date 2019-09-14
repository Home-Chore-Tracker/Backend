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

describe('Families Router - `/api/families`', () => {
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

  describe('GET /api/families', () => {
    test('should return HTTP status code 200', async () => {
      const response = await request(server)
        .get('/api/families')
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/families/:id', () => {
    test('should return HTTP status code 200', async () => {
      const response = await request(server)
        .get('/api/families/1')
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id')
      expect(response.body).toHaveProperty('surname')
      expect(response.body).toHaveProperty('children')
    })
  })

  describe('POST /api/families', () => {
    test('should return HTTP status code 201', async () => {
      const mockFamily = {
        surname: 'The Pop, Lockett, Drop-its',
        user_id: 1,
      }

      const response = await request(server)
        .post('/api/families')
        .send(mockFamily)
        .set('Authorization', token)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id', mockFamily.user_id)
      expect(response.body).toHaveProperty('surname', mockFamily.surname)
      expect(response.body).not.toHaveProperty('children')
    })
  })
})
