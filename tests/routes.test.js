const request = require('supertest')
const app = require('../app')

describe("APP Routes", () => {
	describe("Route /api", () => {
		test('It should return statusCode 200' , async () => {
			const response = await request(app).get('/api').set({"Accept-Language": "fr-FR"})

			expect(response.statusCode).toBe(200)
		})

		test('It should return a json: {"message": "API Discover"}', async () => {
			const response = await request(app).get('/api').set({"Accept-Language": "fr-FR"})

			expect(response.body).toEqual({"message": "API Discover"})
		})
	})

	describe("Route /api/tags", () => {
		test('It should return statusCode 200', async () => {
			const response = await request(app).get('/api/tags').set({"Accept-Language": "fr-FR"})

			expect(response.statusCode).toBe(200)
		})

		test('It should return the list of tags', async () => {
			const response = await request(app).get('/api/tags').set({"Accept-Language": "fr-FR"})
			const expectedResult = {"data": {"tags": [{"id_tag": 22, "nom_tag": "Adrénaline"}, {"id_tag": 20, "nom_tag": "Amis"}, {"id_tag": 1, "nom_tag": "Bar"}, {"id_tag": 15, "nom_tag": "Boutique"}, {"id_tag": 7, "nom_tag": "Brasserie"}, {"id_tag": 13, "nom_tag": "Cascade"}, {"id_tag": 16, "nom_tag": "Chose à faire"}, {"id_tag": 14, "nom_tag": "Forêt"}, {"id_tag": 17, "nom_tag": "Hôtel"}, {"id_tag": 11, "nom_tag": "Lieu culte"}, {"id_tag": 5, "nom_tag": "Lieu historique"}, {"id_tag": 3, "nom_tag": "Monument"}, {"id_tag": 24, "nom_tag": "Nature"}, {"id_tag": 9, "nom_tag": "Paysage"}, {"id_tag": 4, "nom_tag": "Plage"}, {"id_tag": 6, "nom_tag": "Randonnée"}, {"id_tag": 2, "nom_tag": "Restaurant"}, {"id_tag": 12, "nom_tag": "Rivière"}, {"id_tag": 19, "nom_tag": "Soirée"}, {"id_tag": 21, "nom_tag": "Sport"}, {"id_tag": 10, "nom_tag": "Statue"}, {"id_tag": 8, "nom_tag": "Théâtre"}, {"id_tag": 23, "nom_tag": "Vitesse"}]}, "status": "success"}

			expect(response.body).toEqual(expectedResult)
		})
	})
})