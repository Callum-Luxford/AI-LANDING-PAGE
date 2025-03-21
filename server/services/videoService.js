const videoData = require("../data/videos.json");

function getVideoById(id) {
  if (!id || !videoData[id]) return null;
  return videoData[id];
}

module.exports = { getVideoById };
