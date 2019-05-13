const jsend = require('jsend')

const database = require('../services/Database')
const translator = require('../utils/Translator')

class Posts {
	async find(idPost, idUser, longitudeUser, latitudeUser) {
		try {
			const sql_findPostById = `
				SELECT
					post.*,
					user.id_user,
					user.first_name_user,
					user.last_name_user,
					user.photo_user,
					COUNT(DISTINCT post_like.id_like) as likes_post,
					COUNT(DISTINCT id_comment) as comments_post,
					COUNT(DISTINCT checkUserLike.id_like) as isUserLike,
					(
						6371 *
						acos(cos(radians(?)) *
						cos(radians(latitude_post)) *
						cos(radians(longitude_post) -
						radians(?)) +
						sin(radians(?)) *
						sin(radians(latitude_post)))
					) AS distance
				FROM post
				INNER JOIN user ON user.id_user = post.id_user
				LEFT JOIN post_like ON post_like.id_post = post.id_post
				LEFT JOIN post_comment ON post_comment.id_post = post.id_post
				LEFT JOIN post_like as checkUserLike ON checkUserLike.id_post = post.id_post AND checkUserLike.id_user = ?
				WHERE post.id_post = ?`
			const queryData = [
				latitudeUser,
				longitudeUser,
				latitudeUser,
				idUser,
				idPost
			]

			const resultPost = await database.instance.query(sql_findPostById, queryData)
			const postFound = resultPost[0]

			if (resultPost.length == 0)
				return jsend.error(translator.instance.translate('error_result_empty'))

			if (!resultPost[0].id_post)
				return jsend.error(translator.instance.translate('error_result_empty'))

				try {
					const sql_getTagsFromPost = `
						SELECT tag.*
						FROM tag
						LEFT JOIN tag_post ON tag_post.id_tag = tag.id_tag
						LEFT JOIN post ON post.id_post = tag_post.id_post
						WHERE post.id_post = ?`
					const resultTags = await database.instance.query(sql_getTagsFromPost, [idPost])

					let tags = []
					resultTags.forEach( tag => { tags.push({ id_tag: tag.id_tag, nom_tag: tag.nom_tag }) })

					return jsend.success({posts: [{
						id_post: postFound.id_post,
						content_post: postFound.content_post,
						info_post: postFound.info_post,
						photo_post: postFound.photo_post,
						date_post: postFound.date_post,
						latitude_post: postFound.latitude_post,
						longitude_post: postFound.longitude_post,
						distance: postFound.distance >= 0 ? Math.round(postFound.distance * 1000) : null,
						likes_post: postFound.likes_post,
						comments_post: postFound.comments_post,
						isUserLike: postFound.isUserLike > 0,
						author_post: {
							id_user: postFound.id_user,
							first_name_user: postFound.first_name_user,
							last_name_user: postFound.last_name_user,
							photo_user: postFound.photo_user
						},
						tags_post: tags
					}]})
				} catch(error) {
					console.log(error)
					return jsend.error(translator.instance.translate('error_posts_get'))
				}
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_posts_get'))
		}
	}

	async save(post, tags) {
		if(tags.length == 0)
			return jsend.error(translator.instance.translate('error_tags_empty'))

		try {
			const sql_savePost = 'INSERT INTO post SET ?'
			const resultSavedPost = await database.instance.query(sql_savePost, post)

			post.id_post = resultSavedPost.insertId
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_post_save'))
		}

		try {
			let dataTags = []
			tags.forEach((element) => { dataTags.push([post.id_post, element]); })

			const sql_saveTags = 'INSERT INTO tag_post(id_post, id_tag) VALUES ?'
			const resultSavedTags = await database.instance.query(sql_saveTags, [dataTags])

			return jsend.success({posts: [post]})
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_posts_tags_saves'))
		}
	}

	async delete(idPost, idUser) {
		try {
			const sql_findPost = 'SELECT COUNT(1) as postExist FROM post WHERE id_post = ? AND id_user = ?'
			const resultFindPost = await database.instance.query(sql_findPost, [idPost, idUser])

			if (resultFindPost[0].postExist == 0)
				return jsend.error(translator.instance.translate('error_result_empty'))

			const sql_deletePost = 'DELETE FROM post WHERE id_post = ? AND id_user = ?'
			const resultDeletePost = await database.instance.query(sql_deletePost, [idPost, idUser])

			return jsend.success({result: true})
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_posts_delete'))
		}
	}

	async getPostsMap(idUser) {
		try {
			const sql_requestPosts = `
				SELECT
					post.*,
					user.id_user,
					user.first_name_user,
					user.last_name_user,
					user.photo_user,
					COUNT(DISTINCT post_like.id_like) as likes_post,
					COUNT(DISTINCT id_comment) as comments_post,
					COUNT(DISTINCT checkUserLike.id_like) as isUserLike
				FROM post
				INNER JOIN user ON user.id_user=post.id_user
				LEFT JOIN post_like ON post_like.id_post=post.id_post
				LEFT JOIN post_comment ON post_comment.id_post=post.id_post
				LEFT JOIN post_like as checkUserLike ON checkUserLike.id_post=post.id_post AND checkUserLike.id_user = ?
				GROUP BY post.id_post, post.id_user`
			const resultPosts = await database.instance.query(sql_requestPosts, [idUser])
			let postsFound = []

			resultPosts.forEach( (post) => {
				postsFound.push({
					id_post: post.id_post,
					content_post: post.content_post,
					info_post: post.info_post,
					photo_post: post.photo_post,
					date_post: post.date_post,
					latitude_post: post.latitude_post,
					longitude_post: post.longitude_post,
					likes_post: post.likes_post,
					comments_post: post.comments_post,
					isUserLike: post.isUserLike > 0,
					distance: post.distance >= 0 ? Math.round(post.distance * 1000) : null,
					author_post: {
						id_user: post.id_user,
						first_name_user: post.first_name_user,
						last_name_user: post.last_name_user,
						photo_user: post.photo_user
					}
				})
			})

			if(postsFound.length == 0)
				return jsend.error(translator.instance.translate('error_result_empty'))

			return jsend.success({ posts: postsFound })
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_posts_get'))
		}
	}

	async getPostsByLocation(idUser, latitudeUser, longitudeUser, distance, tags, querySort) {
		function getSortMode(querySort) {
			if (querySort == "date_post") return "date_post DESC";
			if (querySort == "likes_post") return "likes_post DESC";
			if (querySort == "comments_post") return "comments_post DESC";
			return "distance ASC";
		}

		try {
			const sql_requestPosts =  `
				SELECT
					post.*,
					user.id_user,
					user.first_name_user,
					user.last_name_user,
					user.photo_user,
					COUNT(DISTINCT post_like.id_like) as likes_post,
					COUNT(DISTINCT id_comment) as comments_post,
					COUNT(DISTINCT checkUserLike.id_like) as isUserLike,
					(
						6371 *
						acos(cos(radians(?)) *
						cos(radians(latitude_post)) *
						cos(radians(longitude_post) -
						radians(?)) +
						sin(radians(?)) *
						sin(radians(latitude_post)))
					) AS distance
					FROM post
					INNER JOIN user ON user.id_user = post.id_user
					LEFT JOIN post_like ON post_like.id_post=post.id_post
					LEFT JOIN post_comment ON post_comment.id_post=post.id_post
					LEFT JOIN post_like as checkUserLike ON checkUserLike.id_post=post.id_post AND checkUserLike.id_user = ?
					LEFT JOIN tag_post ON tag_post.id_post=post.id_post WHERE id_tag IN(${(!tags || tags == '') ? 'id_tag':tags})
					GROUP BY post.id_post, post.id_user HAVING distance < ?
					ORDER BY ${getSortMode(querySort)}`
				const queryData = [
					latitudeUser,
					longitudeUser,
					latitudeUser,
					idUser,
					distance
				]

				const resultPosts = await database.instance.query(sql_requestPosts, queryData)
				let postsFound = []

				resultPosts.forEach( (post) => {
					postsFound.push({
						id_post: post.id_post,
						content_post: post.content_post,
						info_post: post.info_post,
						photo_post: post.photo_post,
						date_post: post.date_post,
						latitude_post: post.latitude_post,
						longitude_post: post.longitude_post,
						likes_post: post.likes_post,
						comments_post: post.comments_post,
						isUserLike: post.isUserLike > 0,
						distance: post.distance >= 0 ? Math.round(post.distance * 1000) : null,
						author_post: {
							id_user: post.id_user,
							first_name_user: post.first_name_user,
							last_name_user: post.last_name_user,
							photo_user: post.photo_user
						}
					})
				})

				if(postsFound.length == 0)
					return jsend.error(translator.instance.translate('error_result_empty'))

				return jsend.success({ posts: postsFound })
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_posts_get'))
		}
	}

	async like(idUser, idPost) {
		let resultLikeFound;

		try {
			const sql_findLikeOnPost = `SELECT * FROM post_like WHERE id_user = ? AND id_post = ?`
			resultLikeFound = await database.instance.query(sql_findLikeOnPost, [idUser, idPost])
		} catch(error) {
			console.log(error)
			return jsend.error(translator.instance.translate('error_likes_check'))
		}

		if(resultLikeFound.length == 0) {
			try {
				const like = {
					id_user : idUser,
					id_post: idPost
				}

				const sql_likePost = 'INSERT INTO post_like SET ?'
				const resultLikePost = await database.instance.query(sql_likePost, like)

				return jsend.success({result: true})
			} catch(error) {
				console.log(error)
				return jsend.error(translator.instance.translate('error_likes_save'))
			}
		} else {
			try {
				const sql_deleteLikeOnPost = 'DELETE FROM post_like WHERE id_like = ?'
				const resultDeleteLike = await database.instance.query(sql_deleteLikeOnPost, resultLikeFound[0].id_like)

				return jsend.success({result: false})
			} catch(error) {
				console.log(error)
				return jsend.error(translator.instance.translate('error_likes_remove'))
			}
		}
	}
}

module.exports = Posts