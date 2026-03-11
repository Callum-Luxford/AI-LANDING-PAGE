const fs = require("fs");

const filePath = "./server/data/videos.json";

// Load JSON
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Loop through every entry
for (const key in data) {
  const entry = data[key];

  if (entry.themeColor) {
    entry.overlayBackgroundColor = entry.themeColor;
    delete entry.themeColor;
  }
}

// Save updated JSON
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log("Migration complete: themeColor → overlayBackgroundColor");
