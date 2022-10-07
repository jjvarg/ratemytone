const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Reply", ReplySchema);
