const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../data/translations.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading translations file:", err);
      return res.status(500).json({ error: "Failed to load translations." });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

module.exports = router;
