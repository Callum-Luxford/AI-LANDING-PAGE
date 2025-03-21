const express = require("express");
const router = express.Router();
const { getVideoById } = require("../services/videoService");

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const video = getVideoById(id);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  res.json(video);
});

module.exports = router;
