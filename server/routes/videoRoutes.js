const express = require("express");
const router = express.Router();
const { getVideoDetails } = require("../controllers/videoController");

router.get("/:id", getVideoDetails);

module.exports = router;
