const Reply = require("../models/Reply");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
    getReply: async (req, res) => {
        try {
            const reply = await Reply.findById(req.params.id);
            res.render("post.ejs", { user: req.user, reply: reply });
        } catch (err) {
            console.log(err);
        }
    },
    createReply: async (req, res) => {
        try {
            await Reply.create({
                comment: req.body.comment,
                likes: 0,
                post: req.params.id,
                user: req.user.id,
            });
            console.log("Reply has been added!");
            res.redirect("/post/" + req.params.id);
        } catch (err) {
            console.log(err);
        }
    },
    likeReply: async (req, res) => {
        var liked = false
        try {
            let reply = await Reply.findById({ _id: req.params.id })
            liked = (reply.likes.includes(req.user.id))
        } catch (err) {
        }
        //if already liked we will remove user from likes array
        if (liked) {
            try {
                await Reply.findOneAndUpdate({ _id: req.params.id },
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
                await Reply.findOneAndUpdate({ _id: req.params.id },
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
    deleteReply: async (req, res) => {
        try {
            // Find post by id
            let reply = await Reply.findById({ _id: req.params.id });
            // Delete post from db
            await reply.remove({ _id: req.params.id });
            console.log("Reply has been deleted");
            res.redirect("back");
        } catch (err) {
            res.redirect("back");
        }
    },
};


