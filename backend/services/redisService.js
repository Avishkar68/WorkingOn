import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let client = null;
let isRedisReady = false;

const REDIS_ENABLED = process.env.REDIS_ENABLED === "true";
let REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Auto-correct connection string if the protocol is missing (e.g., raw host:port)
if (REDIS_URL && !REDIS_URL.startsWith("redis://") && !REDIS_URL.startsWith("rediss://")) {
  REDIS_URL = `redis://${REDIS_URL}`;
}

if (REDIS_ENABLED) {
  try {
    console.log("⏳ Initializing Redis connection...");
    client = createClient({ url: REDIS_URL });

    client.on("connect", () => {
      console.log("📡 Redis client connecting...");
    });

    client.on("ready", () => {
      isRedisReady = true;
      console.log("🚀 Redis connection established and ready for caching");
    });

    client.on("error", (err) => {
      console.error("❌ Redis Connection Error:", err.message);
      isRedisReady = false;
    });

    client.on("end", () => {
      isRedisReady = false;
      console.log("🔌 Redis connection closed");
    });

    // Connect asynchronously to prevent blocking server start if Redis is down
    client.connect().catch((err) => {
      console.error("❌ Redis initial connect failure:", err.message);
      isRedisReady = false;
    });
  } catch (err) {
    console.error("❌ Failed to initialize Redis client:", err.message);
    isRedisReady = false;
  }
} else {
  console.log("ℹ️ Redis caching is disabled (REDIS_ENABLED is not set to 'true')");
}

/**
 * Get item from Redis cache
 * @param {string} key 
 * @returns {Promise<any | null>}
 */
export const getCache = async (key) => {
  if (!REDIS_ENABLED || !isRedisReady || !client) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`[Redis Error] GET failed for key: ${key}`, err.message);
    return null;
  }
};

/**
 * Set item in Redis cache with custom TTL
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlInSeconds 
 * @returns {Promise<boolean>}
 */
export const setCache = async (key, value, ttlInSeconds = 300) => {
  if (!REDIS_ENABLED || !isRedisReady || !client) return false;
  try {
    const stringifiedValue = JSON.stringify(value);
    await client.set(key, stringifiedValue, {
      EX: ttlInSeconds,
    });
    return true;
  } catch (err) {
    console.error(`[Redis Error] SET failed for key: ${key}`, err.message);
    return false;
  }
};

/**
 * Delete specific key from Redis cache
 * @param {string} key 
 * @returns {Promise<boolean>}
 */
export const deleteCache = async (key) => {
  if (!REDIS_ENABLED || !isRedisReady || !client) return false;
  try {
    await client.del(key);
    return true;
  } catch (err) {
    console.error(`[Redis Error] DEL failed for key: ${key}`, err.message);
    return false;
  }
};

/**
 * Invalidate all cache keys matching a pattern (e.g. "spitians:cache:opportunities:*")
 * @param {string} pattern 
 * @returns {Promise<boolean>}
 */
export const invalidateCachePattern = async (pattern) => {
  if (!REDIS_ENABLED || !isRedisReady || !client) return false;
  try {
    console.log(`🧹 Invalidation requested for pattern: ${pattern}`);
    let keysDeleted = 0;
    
    // Use scanIterator for non-blocking key scanning
    for await (const key of client.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      await client.del(key);
      keysDeleted++;
    }
    
    if (keysDeleted > 0) {
      console.log(`✅ Cache Invalidation: Deleted ${keysDeleted} keys matching "${pattern}"`);
    }
    return true;
  } catch (err) {
    console.error(`[Redis Error] Pattern invalidation failed for: ${pattern}`, err.message);
    return false;
  }
};

/**
 * Check if Redis is enabled and connected
 * @returns {boolean}
 */
export const isCacheAvailable = () => {
  return REDIS_ENABLED && isRedisReady;
};
