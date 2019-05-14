const request = require('supertest')
const app = require('../app')

describe("APP Routes", () => {
	describe("Route[GET] /api", () => {
		test('It should return statusCode 200' , async () => {
			const response = await request(app).get('/api').set({"Accept-Language": "fr-FR"})

			expect(response.statusCode).toBe(200)
		})

		test('It should return a json: {"message": "API Discover"}', async () => {
			const response = await request(app).get('/api').set({"Accept-Language": "fr-FR"})

			expect(response.body).toEqual({"message": "API Discover"})
		})
	})

	describe("Route[GET] /api/tags", () => {
		test('It should return statusCode 200', async () => {
			const response = await request(app).get('/api/tags').set({"Accept-Language": "fr-FR"})

			expect(response.statusCode).toBe(200)
		})
	})

	describe("Route[POST] /api/users", () => {
		test("It should return statusCode 200", async () => {
			const response = await request(app).post('/api/users').set({"Accept-Language": "fr-FR"})

			expect(response.statusCode).toBe(200)
		})
	})

	describe("Route[POST] /api/users/login", () => {
		test("It should return statusCode 200", async () => {
			const response = await request(app).post('/api/users/login').set({"Accept-Language": "fr-FR"})

			expect(response.statusCode).toBe(200)
		})
	})

	describe("Route[PUT] /api/users/:id_user/logout", () => {
		test("It should return a json error saying you are not allowed to use this route", async () => {
			const response = await request(app).put('/api/users/1/login').set({"Accept-Language": "fr-FR"})
			const expectedResult = { "status": "error", "message": "Utilisateur non autorisé" }

			expect(response.body).toEqual(expectedResult)
		})
	})

	describe("Route[PUT] /api/users/:id_user/info", () => {
		test("It should return a json error saying you are not allowed to use this route", async () => {
			const response = await request(app).put('/api/users/1/logout').set({"Accept-Language": "fr-FR"})
			const expectedResult = { "status": "error", "message": "Utilisateur non autorisé" }

			expect(response.body).toEqual(expectedResult)
		})
	})
})