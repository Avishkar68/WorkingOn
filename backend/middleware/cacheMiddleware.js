import { getCache, setCache } from "../services/redisService.js";

/**
 * Reusable middleware to cache GET responses in Redis
 * @param {Object} options
 * @param {string} [options.namespace] - Namespace for grouping cache keys (e.g. "opportunities")
 * @param {number} [options.ttl] - Time-to-live in seconds (default: 300)
 * @param {boolean} [options.userSpecific] - If true, caches separately for each logged-in user (default: false)
 */
export const cacheMiddleware = (options = {}) => {
  const { namespace, ttl = 300, userSpecific = false } = options;

  return async (req, res, next) => {
    // 1. Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // 2. Resolve namespace (auto-extract from route if empty, e.g. "/api/opportunities" -> "opportunities")
    const ns = namespace || req.baseUrl.split("/")[2] || "global";

    // 3. Build unique cache key
    let cacheKey = `spitians:cache:${ns}:${req.originalUrl}`;
    
    // If the cache is user-specific, append the authenticated user's ID
    if (userSpecific && req.user?._id) {
      cacheKey += `:user:${req.user._id}`;
    }

    try {
      // 4. Try retrieving from Redis cache
      const cachedResponse = await getCache(cacheKey);
      
      if (cachedResponse) {
        // Cache hit! Return the cached JSON payload
        res.setHeader("X-Cache", "HIT");
        return res.json(cachedResponse);
      }

      // Cache miss. Serve from DB and intercept the response
      res.setHeader("X-Cache", "MISS");
      
      const originalJson = res.json;

      res.json = function (body) {
        // Restore original res.json function to avoid recursion
        res.json = originalJson;

        // Only cache successful 2xx responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, body, ttl).catch((err) => {
            console.error(`[Cache Middleware Error] Failed to write cache for key: ${cacheKey}`, err.message);
          });
        }

        return originalJson.call(this, body);
      };

      next();
    } catch (err) {
      console.error(`[Cache Middleware Error] Graceful fallback to database for: ${req.originalUrl}`, err.message);
      next(); // Proceed to route handler (graceful fallback)
    }
  };
};

export default cacheMiddleware;
