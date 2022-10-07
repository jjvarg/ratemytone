const express = require("express");
const router = express.Router();
const repliesController = require("../controllers/replies");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now
router.get("/:id", repliesController.getReply);
router.post("/createReply/:id", repliesController.createReply);
router.put("/likeReply/:id", repliesController.likeReply);
router.delete("/deleteReply/:id", repliesController.deleteReply);


module.exports = router;
