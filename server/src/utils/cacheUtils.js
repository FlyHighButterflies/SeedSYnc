import redisClient from "./redisClient.js";
import { hashUserId } from "./hash.js";

// Example: cache user profile by hashed userId
export async function cacheUserProfile(userId, profileData, ttlSeconds = 3600) {
    const cacheKey = `user:${hashUserId(userId)}`;
    await redisClient.set(cacheKey, JSON.stringify(profileData), {
        EX: ttlSeconds,
    });
}

export async function getCachedUserProfile(userId) {
    const cacheKey = `user:${hashUserId(userId)}`;
    const data = await redisClient.get(cacheKey);
    return data ? JSON.parse(data) : null;
}

// Example: invalidate cache
export async function invalidateUserProfileCache(userId) {
    const cacheKey = `user:${hashUserId(userId)}`;
    await redisClient.del(cacheKey);
}
