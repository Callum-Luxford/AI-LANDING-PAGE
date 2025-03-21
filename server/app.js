const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable Gzip compression
app.use(compression());

// Serve API Routes
app.use("/api/video", videoRoutes);

// Serve Static Files with Caching (CSS, JS, Images)
app.use(
  express.static(path.join(__dirname, "../public"), {
    maxAge: "1y", // Cache for 1 year
    etag: false,
  })
);

// Serve Videos with Caching (Optimized for Large Files)
app.use(
  "/assets/videos",
  express.static(path.join(__dirname, "../public/assets/videos"), {
    maxAge: "30d", // Cache for 30 days
    immutable: true, // Videos don’t change, so no need for revalidation
  })
);

// erve Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Serve Custom 404 Page (Ensures the script executes)
app.get("/404", (req, res) => {
  res.type("html");
  res.sendFile(path.join(__dirname, "../public/404.html"));
});

// Generic Catch-All (For all unknown routes)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

module.exports = app;
