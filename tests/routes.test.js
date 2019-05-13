const request = require('supertest')
const app = require('../app')

describe("APP Routes", () => {
	describe("Route /", () => {
		test('It should return a json: {"message": "API Discover"}', async () => {
			const response = await request(app).get('/api').set({"Accept-Language": "fr-FR"})
			expect(response.body).toEqual({"message": "API Discover"})
		})
	})
})