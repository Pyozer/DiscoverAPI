const request = require('supertest')
const app = require('../app')

describe('App',() => {
  describe('End Points', () => {
    describe('GET /api', () => {
      test('It should response the GET method', () => {
        return request(app).get('/api').expect(200)
      })

      test("It should return a JSON : {'message': 'API Discover'}", async () => {
        const response = await request(app).get('/api')
        const expectedMessage = {'message': 'API Discover'}

        expect(response.body).toEqual(expectedMessage)
      })
    })
  })
})
