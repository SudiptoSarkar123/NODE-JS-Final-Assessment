const User = require('../model/user.model')
const Category = require('../model/category.model')
const Post = require('../model/posts.model')
const fs = require('fs')

class blogController {
    async getProfileforUser(req, res) {
        try {
            const userId = req.params.id
            const user = await User.findById(userId).select('-password -id')
            res.status(200).json({
                message: 'User Profile fetched successfully',
                data: user
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.params.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            if (req.body.name) user.name = req.body.name;
            if (req.body.bio) user.bio = req.body.bio;

            if (req.file) {
                user.avatar = 'uploads/' + req.file.filename;
            }

            await user.save();

            const { password, ...userData } = user.toObject();
            res.status(200).json({
                message: 'Profile updated successfully',
                data: userData
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Something went wrong'
            });
        }
    }

    async addBlogCategory(req, res) {
        try {
            const { name, description } = req.body
            const category = await Category.create({ name, description })
            res.status(200).json({
                message: 'Category added successfully',
                data: category
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async addBlogPost(req, res) {
        try {
            const { title, body, category } = req.body
            if (!title || !body || !category) return res.status(400).json({ message: 'All fields are required' })

            const blog = await Post.create({ title, body, category, author: req.user._id })
            res.status(200).json({
                message: 'Blog added successfully',
                data: blog
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async updatePost(req, res) {
        try {
            const postId = req.params.id
            if (!postId) return res.status(400).json({ message: 'Post id is required' })

            const post = await Post.findById(postId)
            if (!post) return res.status(400).json({ message: 'Post not found' })

            if (req.body.title) post.title = req.body.title
            if (req.body.body) post.body = req.body.body
            if (req.body.category) post.category = req.body.category

            await post.save()

            res.status(200).json({
                message: 'Post updated successfully',
                data: post
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async deletePost(req, res) {
        try {
            const postId = req.params.id
            if (!postId) return res.status(400).json({ message: 'Post id is required' })
            const post = await Post.findById(postId)
            if (!post) {
                return res.status(400).json({
                    message: 'Post not found'
                })
            }
            await Post.findByIdAndDelete(postId)
            return res.status(200).json({
                message: 'Post deleted successfully'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async likeUnlikePost(req, res) {
        try {
            console.log(req.user)
            const postId = req.params.id
            if (!postId) return res.status(400).json({ message: 'Post id is required' })
            const post = await Post.findById(postId)
            if (!post) {
                return res.status(400).json({
                    message: 'Post not found'
                })
            }
            if (post.likedBy.includes(req.user._id)) {
                post.likes = post.likes - 1
                post.likedBy.pull(req.user._id)
                await post.save()
                return res.status(200).json({
                    message: 'Post unliked successfully'
                })
            }

            post.likes = post.likes + 1
            post.likedBy.push(req.user._id)

            await post.save()
            return res.status(200).json({
                message: 'Post liked successfully'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async listPostByCategory(req, res) {
        try {
            const categories = await Category.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'posts'
                    }
                },
                {
                    $addFields: {
                        totalPosts: { $size: '$posts' }
                    }
                }
            ]);
            return res.status(200).json({
                message: "Categories with posts",
                data: categories
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Something went wrong'
            })
        }
    }

    async listPostsByLikes(req, res) {
        try {
            const posts = await Post.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category'
                },
                {
                    $sort: { likes: -1 }
                },
                {
                    $project: {
                        title: 1,
                        body: 1,
                        likes: 1,
                        author: { name: 1, email: 1 },
                        category: { name: 1 }
                    }
                }
            ]);
            res.status(200).json({
                message: 'Posts sorted by likes',
                data: posts
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Something went wrong'
            });
        }
    }
}

module.exports = new blogController()