// Server.js - Mai9n entry point to start the server
require("dotenv").config();
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
