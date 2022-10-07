const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
    getComment: async (req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);
            res.render("post.ejs", { user: req.user, comment: comment });
        } catch (err) {
            console.log(err);
        }
    },
    createComment: async (req, res) => {
        try {
            await Comment.create({
                comment: req.body.comment,
                likes: 0,
                post: req.params.id,
                user: req.user.id,
            });
            console.log("Comment has been added!");
            res.redirect("/post/" + req.params.id);
        } catch (err) {
            console.log(err);
        }
    },
    likeComment: async (req, res) => {
        var liked = false
        try {
            var comment = await Comment.findById({ _id: req.params.id })
            liked = (comment.likes.includes(req.user.id))
        } catch (err) {
        }
        //if already liked we will remove user from likes array
        if (liked) {
            try {
                await Comment.findOneAndUpdate({ _id: req.params.id },
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
                await Comment.findOneAndUpdate({ _id: req.params.id },
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
    deleteComment: async (req, res) => {
        try {
            // Delete comment from db
            await Comment.remove({ _id: req.params.id });
            console.log("Comment has been deleted");
            res.redirect("back");
        } catch (err) {
            res.redirect("back");
        }
    },
};
