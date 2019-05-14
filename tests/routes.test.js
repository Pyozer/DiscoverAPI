const request = require('supertest')
const app = require('../app')

describe("APP Routes", () => {
	describe("/api", () => {
		describe("Method GET", () => {
			test('It should return statusCode 200' , async () => {
				const response = await request(app).get('/api').set({"Accept-Language": "fr-FR"})

				expect(response.statusCode).toBe(200)
			})

			test('It should return a json: {"message": "API Discover"}', async () => {
				const response = await request(app).get('/api').set({"Accept-Language": "fr-FR"})

				expect(response.body).toEqual({"message": "API Discover"})
			})
		})
	})

	describe("/api/tags", () => {
		describe("Method GET", () => {
			test('It should return statusCode 200', async () => {
				const response = await request(app).get('/api/tags').set({"Accept-Language": "fr-FR"})

				expect(response.statusCode).toBe(200)
			})
		})
	})

	describe("/api/users", () => {
		describe("Method POST", () => {
			test("It should return statusCode 200", async () => {
				const response = await request(app).post('/api/users').set({"Accept-Language": "fr-FR"})

				expect(response.statusCode).toBe(200)
			})
		})
	})

	describe("/api/users/login", () => {
		describe("Method POST", () => {
			test("It should return statusCode 200", async () => {
				const response = await request(app).post('/api/users/login').set({"Accept-Language": "fr-FR"})

				expect(response.statusCode).toBe(200)
			})
		})
	})

	describe("/api/users/:id_user/logout", () => {
		describe("Method PUT", () => {
			test("It should return a json error saying you are not allowed to use this route", async () => {
				const response = await request(app).put('/api/users/1/logout').set({"Accept-Language": "fr-FR"})
				const expectedResult = { "status": "error", "message": "Utilisateur non autorisé" }

				expect(response.body).toEqual(expectedResult)
			})
		})
	})

	describe("/api/users/:id_user/info", () => {
		describe("Method GET", () => {
			test("It should return a json error saying you are not allowed to use this route", async () => {
				const response = await request(app).get('/api/users/1/info').set({"Accept-Language": "fr-FR"})
				const expectedResult = { "status": "error", "message": "Utilisateur non autorisé" }

				expect(response.body).toEqual(expectedResult)
			})
		})
	})
})