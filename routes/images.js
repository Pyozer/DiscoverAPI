const database = require('../services/database/database.js');
let pool = database.instance.getPool();

const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

const path = '/home/pi/discover/images/';

exports.get_post_thumbnail = (req, res) => {
	showImage(res, req.params.image, 'posts/thumbnails/');
}

exports.get_post_original = (req, res) => {
	showImage(res, req.params.image, 'posts/');
}

exports.get_profil_thumbnail = (req, res) => {
	showImage(res, req.params.image, 'profils/thumbnails/');
}

exports.get_profil_original = (req, res) => {
	showImage(res, req.params.image, 'profils/');
}

function showImage(res, filename, subpath) {

	let fullPath = path + subpath + filename;
	console.log(fullPath);
	let fullPathDefault = path + subpath + "default.png";

	if (!fs.existsSync(fullPath)) { // Si l'image est pas trouvé
		fullPath = fullPathDefault;
		console.log("Image not found, use default");
	}

	let readStream = fs.createReadStream(fullPath);
	// This will wait until we know the readable stream is actually valid before piping
	readStream.on('open', () => {
		res.set('Content-Type', 'image/jpeg');
		// This just pipes the read stream to the response object (which goes to the client)
		readStream.pipe(res);
	});
}

exports.upload_image = (req, res, dir, callback) => {

	let storage = multer.diskStorage({
		destination: (req, file, callback) => {
			callback(null, path + dir);
		},
		filename: (req, file, callback) => {
			callback(null, Date.now() + "_" + file.originalname);
		}
	});

	let upload = multer({ storage: storage }).single("file_image");

	upload(req, res, (err) => {
		if (err) {
			callback(err);
		} else {
			sharp(req.file.path)
				.resize(800, 800)
				.toFile(path + dir + "/thumbnails/" + req.file.filename, (err, info) => {
					callback(err, req.file.filename);
				});
		}
	});
}

exports.delete_image = (dir, filename, res, callback) => {
	let files = [
		path + dir + filename,
		path + dir + "thumbnails/" + filename
	];

	deleteFiles(files, callback);
}

function deleteFiles(files, callback) {
	if (files.length == 0)
		callback(null);
	else {
		let file = files.pop();
		fs.unlink(file, (err) => {
			if (err)
				callback(err);
			else {
				console.log(file + ' deleted.');
				deleteFiles(files, callback);
			}
		});
	}
}
