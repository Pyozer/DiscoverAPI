const express = require('express')
let router = express.Router()

const { requireLogin } = require('../models/Users')
const Posts = require('../models/Posts')
const Comments = require('../models/Comments')
let posts = new Posts()
let comments = new Comments()

router.post('/', requireLogin, async (req, res) => {
	const newPost = {
		id_user: req.user.id_user,
		info_post: req.body.info_post,
		content_post: req.body.content_post,
		photo_post: req.body.image_url,
		latitude_post: parseFloat(req.body.latitude_post),
		longitude_post: parseFloat(req.body.longitude_post),
		date_post: new Date()
	}
	const tags = JSON.parse(req.body.tags_post)
	const savedPost = await posts.save(newPost, tags)

	res.send(savedPost)
})

router.delete('/:id_post', requireLogin, async(req, res) => {
	const idPost = req.params.id_post
	const idUser = req.user.id_user

	const deletedPost = await posts.delete(idPost, idUser)

	res.send(deletedPost)
})

router.get('/location', requireLogin, async (req, res) => {
	const idUser = req.user.id_user
	const latitudeUser = req.query.latitude_user
	const longitudeUser = req.query.longitude_user
	const distance = req.query.distance
	const tags = req.query.tags
	const querySort = req.query.sort

	const postsFound = await posts.getPostsByLocation(idUser, latitudeUser, longitudeUser, distance, tags, querySort)

	res.send(postsFound)
})

router.get('/map', requireLogin, async (req, res) => {
	const idUser = req.user.id_user

	const postsFound = await posts.getPostsMap(idUser)

	res.send(postsFound)
})


router.get('/:id_post', requireLogin, async (req, res) => {
	const idUser = req.user.id_user
	const idPost = req.params.id_post
	const latitudeUser = req.query.latitude_user
	const longitudeUser = req.query.longitude_user

	const postFound = await posts.find(idPost, idUser, longitudeUser, latitudeUser)

	res.send(postFound)
})

router.post('/:id_post/likes', requireLogin, async (req, res) => {
	const idUser = req.user.id_user
	const idPost = req.params.id_post

	const switchLike = await posts.like(idUser, idPost)

	res.send(switchLike)
})

/* COMMENTS ROUTES */

router.get('/:id_post/comments', requireLogin, async (req, res) => {
	let idPost = req.params.id_post
	const commentsFound = await comments.findCommentsByPost(idPost)

	res.send(commentsFound)
})

router.post('/:id_post/comments', requireLogin, async (req, res) => {
	const commentToSave = {
		id_post: parseInt(req.params.id_post),
		id_user: parseInt(req.user.id_user),
		text_comment: req.body.text_comment,
		date_comment: new Date().toISOString().slice(0, 19).replace('T', ' ')
	}
	const postedComment = await comments.save(commentToSave)

	res.send(postedComment)
})

router.delete('/:id_post/comments/:id_comment', requireLogin, async (req, res) => {
	let idPost = req.params.id_post
	let idUser = req.user.id_user
	let idComment = req.params.id_comment

	const isCommentDeleted = await comments.deleteByPost(idPost, idUser, idComment)

	res.send(isCommentDeleted)
})

module.exports = router