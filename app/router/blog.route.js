const express = require('express')
const router = express.Router()
const upload = require('../middleware/avatarUpload')
const blogController = require('../controller/blog.controller')
const AuthCheck = require('../middleware/authCheck')


router.get('/profile/:id',AuthCheck,blogController.getProfileforUser)
router.post('/update-profile/:id',AuthCheck,upload.single('profilePic'),blogController.updateProfile)
router.post('/add-blog-category',AuthCheck,blogController.addBlogCategory)
router.post('/add-blog-post',AuthCheck,blogController.addBlogPost)
router.post('/update-post/:id',AuthCheck,blogController.updatePost)
router.get('/delete-post/:id',AuthCheck,blogController.deletePost)
router.get('/like-unlike-post/:id',AuthCheck,blogController.likeUnlikePost)
router.get('/list-post-by-category',AuthCheck,blogController.listPostByCategory)
router.get('/posts-by-likes',AuthCheck,blogController.listPostsByLikes)

module.exports = router
