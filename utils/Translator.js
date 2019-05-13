const TRANSLATOR_KEY = Symbol('translator')

class Translator {
  constructor() { this.language = 'en'}

	setLangage(language) {
		this.language = language

		try {
			this.langString = require(`../configs/languages/lang_${this.language}`)
		} catch(error) {
			console.log(error)
			this.langString = require('../configs/languages/lang_en')
		}
	}

	translate(keyString, args = null) {
		const translatedString = this.langString[keyString]

		if(!translatedString)
			return this.langString['error']

		if(args)
			translatedString.replace(/%s/g, () => args.shift())

		return translatedString
	}
}
global[TRANSLATOR_KEY] = new Translator()

var singleton = {}
Object.defineProperty(singleton, "instance", {
  get: function(){
    return global[TRANSLATOR_KEY]
  },
  enumerable: true
})
Object.freeze(singleton)

module.exports = singleton