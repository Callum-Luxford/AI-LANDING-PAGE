const path = require("path");
const fs = require("fs");

// Load video data from JSON file
const dataFilePath = path.join(__dirname, "../data/videos.json");

const getVideoDetails = (req, res) => {
  const videoId = req.params.id;

  // Read the JSON file
  fs.readFile(dataFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read video data" });
    }

    try {
      const videos = JSON.parse(data);

      if (!videos[videoId]) {
        return res.status(404).json({ error: "Video not found" });
      }

      // Convert relative video path to absolute URL
      const videoData = videos[videoId];
      videoData.videoUrl = `http://${req.get("host")}${videoData.videoUrl}`;
      return res.json(videoData);
    } catch (parseError) {
      return res.status(500).json({ error: "Failed to parse video data" });
    }
  });
};

module.exports = { getVideoDetails };
