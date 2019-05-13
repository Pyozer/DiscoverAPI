const { createPool } = require('mysql')
const DATABASE_KEY = Symbol('database')

class Database {
  constructor() {
    const configFilename = (process.env.NODE_ENV === 'production') ? '../configs/database.config.js' : '../configs/database.test.config.js'
    let config = require(configFilename)

    this.pool = createPool(config)
  }

  getPool() { return this.pool }

	getConnection() {
		return new Promise((resolve, reject) => {
			this.getPool().getConnection((error, connection) => {
				if(error)
					return reject(error)

				resolve(connection)
			})
		})
	}

	query(sql, data=[]) {
		return new Promise(async (resolve, reject) => {
			try {
				const connection = await this.getConnection()
				connection.query(sql, data, (error, results) => {
					if(error) {
						connection.release()
						return reject(error)
					}

					connection.release()
					resolve(results)
				})
			} catch(error) {
				connection.release()
				return reject(error)
			}
		})
	}
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