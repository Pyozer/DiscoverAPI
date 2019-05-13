const jsend = require('jsend')

const database = require('../services/Database')
const translator = require('../utils/Translator')

class Tags {
	async findAll() {
		try {
			const allTags = await database.instance.query("SELECT * FROM tag")
			return jsend.success({ tags: allTags })
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_tag_get'))
		}
	}
}

module.exports = Tags