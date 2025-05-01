const { createClient } = require("redis");

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

client.on("connect", () => {
  console.log(" Redis connected successfully!");
});

client.on("error", (err) => {
  console.error(" Redis connection error:", err);
});

module.exports = client;
