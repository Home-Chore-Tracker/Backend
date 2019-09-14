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

describe('Chores Router - `/api/chores`', () => {
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

  describe('GET /api/chores', () => {
    test('should return HTTP status code 200', async () => {
      const response = await request(server)
        .get('/api/chores')
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/chores/:id', () => {
    test('should return HTTP status code 200', async () => {
      const response = await request(server)
        .get('/api/chores/1')
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id')
      expect(response.body).toHaveProperty('child_id')
      expect(response.body).toHaveProperty('title')
      expect(response.body).toHaveProperty('description')
      expect(response.body).toHaveProperty('duedate')
      expect(response.body).toHaveProperty('completed')
    })
  })

  describe('POST /api/chores', () => {
    test('should return HTTP status code 201', async () => {
      const mockChore = {
        child_id: 1,
        title: 'Take out the trash',
        description: null,
        duedate: '2019-09-24',
        completed: false,
      }

      const response = await request(server)
        .post('/api/chores')
        .send(mockChore)
        .set('Authorization', token)

      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id')
      expect(response.body).toHaveProperty('child_id')
      expect(response.body).toHaveProperty('title')
      expect(response.body).toHaveProperty('description')
      expect(response.body).toHaveProperty('duedate')
      expect(response.body).toHaveProperty('completed')
    })
  })

  describe('PUT /api/chores/:id', () => {
    test('should return HTTP status code 200', async () => {
      const mockChoreUpdates = {
        completed: true
      }

      const response = await request(server)
        .put('/api/chores/1')
        .send(mockChoreUpdates)
        .set('Authorization', token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('user_id')
      expect(response.body).toHaveProperty('child_id')
      expect(response.body).toHaveProperty('title')
      expect(response.body).toHaveProperty('description')
      expect(response.body).toHaveProperty('duedate')
      expect(response.body).toHaveProperty('completed', mockChoreUpdates.completed)
    })
  })

  describe('DELETE /api/chores/:id', () => {
    test('should return HTTP status code 204', async () => {
      const response = await request(server)
        .delete('/api/chores/1')
        .set('Authorization', token)

      expect(response.status).toBe(204)
    })
  })
})
