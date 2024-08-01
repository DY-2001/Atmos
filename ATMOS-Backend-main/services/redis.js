const { createClient } = require("redis");

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 11949,
  },
});

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

const clientConnect = async () => {
  await client.connect();
  // client.flushAll();
};

clientConnect();

module.exports = client;
