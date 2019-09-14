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

describe('Children Router - `/api/children`', () => {
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

  describe('GET /api/children', () => {
    test('should return HTTP status code 200', async () => {
      const response = await request(server)
        .get('/api/children')
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })
  })
  
  describe('GET /api/children/:id', () => {
    test('should return HTTP status code 200', async () => {
      const response = await request(server)
        .get('/api/children/1')
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id')
      expect(response.body).toHaveProperty('family_id')
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('chores')
    })
  })

  describe('POST /api/children', () => {
    test('should return HTTP status code 201', async () => {
      const mockChild = {
        name: 'Billy',
        familyId: 1,
      }

      const response = await request(server)
        .post('/api/children')
        .send(mockChild)
        .set('Authorization', token)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id')
      expect(response.body).toHaveProperty('family_id', mockChild.familyId)
      expect(response.body).toHaveProperty('name', mockChild.name)
      expect(response.body).not.toHaveProperty('chores')
    })
  })
  
  describe('PUT /api/children/:id', () => {
    test('should return HTTP status code 200', async () => {
      const mockChildUpdates = {
        name: 'Ced Updated',
      }

      const response = await request(server)
        .put('/api/children/3')
        .send(mockChildUpdates)
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id')
      expect(response.body).toHaveProperty('family_id')
      expect(response.body).toHaveProperty('name', mockChildUpdates.name)
      expect(response.body).not.toHaveProperty('chores')
    })
  })

  describe('DELETE /api/children/:id', () => {
    test('should return HTTP status code 204', async () => {
      const response = await request(server)
        .delete('/api/children/1')
        .set('Authorization', token)
      
      expect(response.status).toBe(204)
    })
  })
})
