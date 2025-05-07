const path = require("path");
const fs = require("fs");

const dataFilePath = path.join(__dirname, "../data/videos.json");

const getVideoDetails = (req, res) => {
  const videoId = req.params.id;
  const lang = req.query.lang || "en"; // added language support

  fs.readFile(dataFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read video data" });
    }

    try {
      const videos = JSON.parse(data);

      if (!videos[videoId]) {
        return res.status(404).json({ error: "Video not found" });
      }

      const videoData = { ...videos[videoId] };

      // Handle multilingual video URLs
      const videoUrlField = videoData.videoUrl;
      let selectedVideoUrl;

      if (typeof videoUrlField === "object") {
        selectedVideoUrl = videoUrlField[lang] || videoUrlField["en"];
      } else {
        selectedVideoUrl = videoUrlField;
      }

      // Add full host path
      videoData.videoUrl = `https://${req.get("host")}${selectedVideoUrl}`;

      return res.json(videoData);
    } catch (parseError) {
      return res.status(500).json({ error: "Failed to parse video data" });
    }
  });
};

module.exports = { getVideoDetails };
