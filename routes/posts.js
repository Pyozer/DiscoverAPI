const database = require('../services/database/database.js');
let pool = database.instance.getPool();

function getSortMode(querySort) {
	let sortMode = "date_post";
	if (querySort) {
		if (querySort == "likes_post") {
			sortMode = "likes_post";
		} else if (querySort == "comments_post") {
			sortMode = "comments_post";
		}
	}
	return sortMode;
}

exports.get_posts_location = (req, res) => {
	if (!req.query.tags || req.query.tags == "") {
		req.query.tags = "id_tag";
	}

	let sortMode = getSortMode(req.query.sort);

	let requestPosts = "SELECT post.*, user.id_user, user.first_name_user, user.last_name_user, user.photo_user, COUNT(DISTINCT post_like.id_like) as likes_post, COUNT(DISTINCT id_comment) as comments_post, COUNT(DISTINCT checkUserLike.id_like) as isUserLike, ( " +
		"   6371 * " +
		"   acos(cos(radians(?)) * " +
		"   cos(radians(latitude_post)) * " +
		"   cos(radians(longitude_post) - " +
		"   radians(?)) + " +
		"   sin(radians(?)) * " +
		"   sin(radians(latitude_post)))" +
		") AS distance " +
		"FROM post INNER JOIN user ON user.id_user=post.id_user " +
		"LEFT JOIN post_like ON post_like.id_post=post.id_post " +
		"LEFT JOIN post_comment ON post_comment.id_post=post.id_post " +
		"LEFT JOIN post_like as checkUserLike ON checkUserLike.id_post=post.id_post AND checkUserLike.id_user = ? " +
		"LEFT JOIN tag_post ON tag_post.id_post=post.id_post WHERE id_tag IN(" + req.query.tags + ") " +
		"GROUP BY post.id_post, post.id_user HAVING distance < ? " +
		"ORDER BY " + sortMode + " DESC";

	get_posts(requestPosts, [
		req.query.latitude_user,
		req.query.longitude_user,
		req.query.latitude_user,
		req.user,
		req.query.distance
	], req, res);
}

exports.get_posts_map = (req, res) => {
	let requestPosts =
		"SELECT post.*, user.id_user, user.first_name_user, user.last_name_user, user.photo_user, COUNT(DISTINCT post_like.id_like) as likes_post, COUNT(DISTINCT id_comment) as comments_post, COUNT(DISTINCT checkUserLike.id_like) as isUserLike" +
		" FROM post INNER JOIN user ON user.id_user=post.id_user" +
		" LEFT JOIN post_like ON post_like.id_post=post.id_post" +
		" LEFT JOIN post_comment ON post_comment.id_post=post.id_post" +
		" LEFT JOIN post_like as checkUserLike ON checkUserLike.id_post=post.id_post AND checkUserLike.id_user = ?" +
		" GROUP BY post.id_post, post.id_user";

	get_posts(requestPosts, [req.user], req, res);
}

function get_posts(request, params, req, res) {
	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query(request, params, (error, rows, fields) => {
			connection.release();
			if (error) {
				return onDatabaseReqError(res, getString("error_posts_get"));
			}

			let result = [];

			rows.forEach((row) => {
				result.push({
					id_post: row.id_post,
					content_post: row.content_post,
					info_post: row.info_post,
					photo_post: row.photo_post,
					date_post: row.date_post,
					latitude_post: row.latitude_post,
					longitude_post: row.longitude_post,
					likes_post: row.likes_post,
					comments_post: row.comments_post,
					isUserLike: row.isUserLike > 0,
					distance: row.distance >= 0 ? Math.round(row.distance * 1000) : null,
					author_post: {
						id_user: row.id_user,
						first_name_user: row.first_name_user,
						last_name_user: row.last_name_user,
						photo_user: row.photo_user
					}
				});
			});

			return res.status(200).send(jsend.success({ posts: result }));
		});
	});
}

exports.get_specific_post = (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		let requestPost =
			"SELECT post.*, user.id_user, user.first_name_user, user.last_name_user, user.photo_user, COUNT(DISTINCT post_like.id_like) as likes_post, COUNT(DISTINCT id_comment) as comments_post, COUNT(DISTINCT checkUserLike.id_like) as isUserLike, ( " +
			"   6371 * " +
			"   acos(cos(radians(?)) * " +
			"   cos(radians(latitude_post)) * " +
			"   cos(radians(longitude_post) - " +
			"   radians(?)) + " +
			"   sin(radians(?)) * " +
			"   sin(radians(latitude_post)))" +
			") AS distance " +
			" FROM post INNER JOIN user ON user.id_user=post.id_user" +
			" LEFT JOIN post_like ON post_like.id_post=post.id_post" +
			" LEFT JOIN post_comment ON post_comment.id_post=post.id_post" +
			" LEFT JOIN post_like as checkUserLike ON checkUserLike.id_post=post.id_post AND checkUserLike.id_user = ?" +
			" WHERE post.id_post = ?";

		let queryData = [
			req.query.latitude_user,
			req.query.longitude_user,
			req.query.latitude_user,
			req.user,
			req.params.id_post
		];

		connection.query(requestPost, queryData, (errorPost, resultPost, fields) => {
			if (errorPost) {
				connection.release();
				return onDatabaseReqError(res, getString("error_posts_get"));
			}
			if (resultPost.length == 0) {
				connection.release();
				return onDatabaseReqError(res, getString("error_result_empty"));
			}

			let requestTagsPost =
				"SELECT tag.* FROM tag" +
				" LEFT JOIN tag_post ON tag_post.id_tag=tag.id_tag" +
				" LEFT JOIN post ON post.id_post=tag_post.id_post" +
				" WHERE post.id_post = ?";

			connection.query(requestTagsPost, [req.params.id_post], (errorTags, resultTags, fields) => {
				connection.release();
				if (errorTags) {
					return onDatabaseReqError(res, getString("error_posts_get"));
				}

				let tags = [];
				resultTags.forEach((tag) => {
					tags.push({ id_tag: tag.id_tag, nom_tag: tag.nom_tag })
				});

				let post = resultPost[0];
				let result = [{
					id_post: post.id_post,
					content_post: post.content_post,
					info_post: post.info_post,
					photo_post: post.photo_post,
					date_post: post.date_post,
					latitude_post: post.latitude_post,
					longitude_post: post.longitude_post,
					distance: post.distance >= 0 ? Math.round(post.distance * 1000) : null,
					likes_post: post.likes_post,
					comments_post: post.comments_post,
					isUserLike: post.isUserLike > 0,
					author_post: {
						id_user: post.id_user,
						first_name_user: post.first_name_user,
						last_name_user: post.last_name_user,
						photo_user: post.photo_user
					},
					tags_post: tags
				}];

				return res.status(200).send(jsend.success({ posts: result }));
			});
		});
	});
}
exports.save_post = (req, res) => {
	let id_user = req.user;

	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		let tagsArray = JSON.parse(req.body.tags_post);

		let post = {
			id_user: id_user,
			content_post: req.body.content_post,
			info_post: req.body.info_post || "",
			photo_post: req.body.image_url,
			latitude_post: parseFloat(req.body.latitude_post),
			longitude_post: parseFloat(req.body.longitude_post),
			date_post: new Date()
		}

		connection.query("INSERT INTO post SET ?", [post], (errPost, results, fields) => {
			if (errPost) {
				connection.release();
				return onDatabaseReqError(res, getString("error_post_save"));
			}
			console.log('Post saved.');
			post.id_post = results.insertId;

			let dataTags = [];
			tagsArray.forEach((element) => {
				dataTags.push([results.insertId, element]);
			});

			connection.query("INSERT INTO tag_post(id_post, id_tag) VALUES ?", [dataTags], (errTags, results, fields) => {
				connection.release();
				if (errTags) {
					return onDatabaseReqError(res, getString("error_posts_tags_save"));
				}
				console.log("Tag inserted !");

				return res.status(200).send(jsend.success({
					posts: [post]
				}));
			});
		});
	});
}
exports.delete_post = (req, res) => {
	let id_user = req.user;

	pool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return onDatabaseConError(res);
		}

		connection.query("SELECT photo_post FROM post WHERE post.id_user = ? AND post.id_post = ?", [req.user, req.params.id_post], (error, results, fields) => {
			if (error) {
				connection.release();
				return onDatabaseReqError(res, getString("error_posts_get"));
			}
			if (results.length == 0) {
				connection.release();
				return res.status(204).send(jsend.error(getString("error_result_empty")));
			}

			connection.query("DELETE FROM post WHERE id_post = ? AND id_user = ?", [req.params.id_post, id_user], (error, result, fields) => {
				connection.release();
				if (error) {
					return onDatabaseReqError(res, getString("error_posts_delete"));
				}
				// TODO: Remove image on S3
				return res.status(200).send(jsend.success({
					result: true
				}));
			});
		});
	});
}
