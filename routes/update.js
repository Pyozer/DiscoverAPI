const fs = require("fs");

exports.get_last_version = (req, res) => {
	fs.readFile('last_version.txt', 'utf8', (err, data) => {
		if (err) {
			return onDatabaseReqError(res, getString("error_file_not_found"))
		}
		let infos = data.split("\n");

		let version = infos[0];
		let link = infos[1];
		res.status(200).send(jsend.success({
			version: version,
			link: link
		}));
	});
}