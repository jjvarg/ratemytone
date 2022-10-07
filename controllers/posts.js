const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment")

module.exports = {
    getProfile: async (req, res) => {
        try {
            const posts = await Post.find({ user: req.user.id });
            res.render("add-tone.ejs", { posts: posts, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    getTones: async (req, res) => {
        try {
            const posts = await Post.find({ user: req.user.id });
            res.render("my-tones.ejs", { posts: posts, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    getBookmarks: async (req, res) => {
        try {
            const posts = await Post.find({ bookmarks: req.user.id });
            var users = []
            for (i in posts) {
                var user = await User.findById(posts[i].user)
                users.push(user.userName)
            }
            res.render("favorite-tones.ejs", { posts: posts, userName: users, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    getFeed: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: "desc" }).lean();
            var users = []
            for (i in posts) {
                var user = await User.findById(posts[i].user)
                users.push(user.userName)
            }
            res.render("feed.ejs", { posts: posts, userName: users, user: req.user });
        } catch (err) {
            console.log(err);
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            const poster = await User.findById(post.user);
            const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
            var commentors = []
            for (i in comments) {
                var commentor = await User.findById(comments[i].user)
                commentors.push(commentor.userName)
            }
            res.render("post.ejs", { post: post, user: req.user, poster: poster, comments: comments, commentors: commentors });
        } catch (err) {
            console.log(err);
        }
    },
    createPost: async (req, res) => {
        try {
            // Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            await Post.create({
                title: req.body.title,
                image: result.secure_url,
                cloudinaryId: result.public_id,
                caption: req.body.caption,
                toneType: req.body.toneType,
                ampType: req.body.ampType,
                positions: req.body.positions.trim().split('\n'),
                likes: 0,
                user: req.user.id,
            });
            console.log("Post has been added!");
            res.redirect("/feed");
        } catch (err) {
            y
            console.log(err);
        }
    },
    likePost: async (req, res) => {
        var liked = false
        try {
            var post = await Post.findById({ _id: req.params.id })
            liked = (post.likes.includes(req.user.id))
        } catch (err) {
        }
        //if already liked we will remove user from likes array
        if (liked) {
            try {
                await Post.findOneAndUpdate({ _id: req.params.id },
                    {
                        $pull: { 'likes': req.user.id }
                    })

                console.log("Removed user from likes array")
                res.redirect("back")
            } catch (err) {
                console.log(err)
            }
        }
        //else add user to like array
        else {
            try {
                await Post.findOneAndUpdate({ _id: req.params.id },
                    {
                        $addToSet: { 'likes': req.user.id }
                    })

                console.log("Added user to likes array")
                res.redirect("back")
            } catch (err) {
                console.log(err)
            }
        }
    },
    bookmarkPost: async (req, res) => {
        var bookmarked = false
        try {
            var post = await Post.findById({ _id: req.params.id })
            bookmarked = (post.bookmarks.includes(req.user.id))
        } catch (err) {
        }
        //if already bookmarked we will remove user from likes array
        if (bookmarked) {
            try {
                await Post.findOneAndUpdate({ _id: req.params.id },
                    {
                        $pull: { 'bookmarks': req.user.id }
                    })

                console.log('Removed user from bookmarks array')
                res.redirect('back')
            } catch (err) {
                console.log(err)
            }
        }
        //else add user to bookmarked array
        else {
            try {
                await Post.findOneAndUpdate({ _id: req.params.id },
                    {
                        $addToSet: { 'bookmarks': req.user.id }
                    })

                console.log('Added user to bookmarks array')
                res.redirect(`back`)
            } catch (err) {
                console.log(err)
            }
        }
    },
    deletePost: async (req, res) => {
        try {
            // Find post by id
            let post = await Post.findById({ _id: req.params.id });
            // Delete image from cloudinary
            await cloudinary.uploader.destroy(post.cloudinaryId);
            // Delete post from db
            await Post.remove({ _id: req.params.id });
            console.log("Deleted Post");
            res.redirect("/my-tones");
        } catch (err) {
            res.redirect("/my-tones");
        }
    },
};
