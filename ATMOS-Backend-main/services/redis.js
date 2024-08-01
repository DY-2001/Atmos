const { createClient } = require("redis");

const client = createClient({
  password: "mDtTY4vZ3ePvfPQffTWmWCYdEkYCmKkf",
  socket: {
    host: "redis-11949.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
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
