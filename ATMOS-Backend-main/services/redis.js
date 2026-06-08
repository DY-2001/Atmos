const { createClient } = require("redis");

const REDIS_URL = process.env.REDIS_HOST;

if (!REDIS_URL) {
  console.error("❌ REDIS_HOST is not set in environment variables.");
  process.exit(1);
}

console.log("🔌 Connecting to Redis:", REDIS_URL.replace(/:([^:@]+)@/, ":****@")); // mask password

const client = createClient({ url: REDIS_URL });

client.on("connect", () => console.log("✅ Redis connected successfully."));
client.on("error", (err) => console.error("❌ Redis Client Error:", err.message));

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("❌ Redis initial connection failed:", err.message);
  }
})();

module.exports = client;
