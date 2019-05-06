exports.get_tags = (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query("SELECT * FROM tag", (error, results, fields) => {
			connection.release();
			if (error)
				return onDatabaseReqError(res, getString("error_tag_get"));
			else
				return res.status(200).send(jsend.success({ tags: results }));
		});
	});
}