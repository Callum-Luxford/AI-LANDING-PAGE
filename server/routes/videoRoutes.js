const express = require("express");
const router = express.Router();
const fs = require("fs");
const { getVideoDetails } = require("../controllers/videoController");

router.get("/:id", getVideoDetails);

module.exports = router;
