const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const path = require("path");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/video", videoRoutes);
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Serve 404 via route (so script executes)
app.get("/404", (req, res) => {
  res.type("html");
  res.sendFile(path.join(__dirname, "../public/404.html"));
});

// Generic catch-all
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

module.exports = app;
