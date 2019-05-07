const { createPool } = require('mysql')
const DATABASE_KEY = Symbol('database')

class Database {
  constructor() {
    const configFilename = (process.env.NODE_ENV === 'production') ? '../../config/database.config.js' : '../../config/database.test.config.js'
    let config = require(configFilename)

    this.pool = createPool(config)
  }

  getPool() { return this.pool }
}
global[DATABASE_KEY] = new Database()

var singleton = {}
Object.defineProperty(singleton, "instance", {
  get: function(){
    return global[DATABASE_KEY]
  },
  enumerable: true
})
Object.freeze(singleton)

module.exports = singleton
