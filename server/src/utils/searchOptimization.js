/**
 * Search Optimization Utilities
 * Provides caching and performance enhancement for search operations
 */

import NodeCache from 'node-cache';

// Search cache with 5-minute TTL for frequently searched terms
const searchCache = new NodeCache({ 
    stdTTL: 300, // 5 minutes
    checkperiod: 60, // Check for expired keys every minute
    maxKeys: 1000 // Maximum 1000 cached searches
});

// Popular search terms cache with longer TTL
const popularTermsCache = new NodeCache({ 
    stdTTL: 3600, // 1 hour
    checkperiod: 300 // Check every 5 minutes
});

/**
 * Generate cache key for search parameters
 * @param {Object} searchParams - Search parameters
 * @returns {string} - Unique cache key
 */
export const generateSearchCacheKey = (searchParams) => {
    const { query, type, role, status, minPrice, maxPrice, farmerId, buyerId, limit, offset } = searchParams;
    
    return `search:${JSON.stringify({
        q: query?.toLowerCase(),
        t: type,
        r: role,
        s: status,
        mp: minPrice,
        mx: maxPrice,
        f: farmerId,
        b: buyerId,
        l: limit,
        o: offset
    })}`;
};

/**
 * Get cached search results
 * @param {string} cacheKey - Cache key
 * @returns {Object|null} - Cached results or null
 */
export const getCachedSearchResults = (cacheKey) => {
    try {
        const cached = searchCache.get(cacheKey);
        if (cached) {
            console.log(`🚀 Cache hit for search: ${cacheKey.substring(0, 50)}...`);
            return {
                ...cached,
                fromCache: true,
                cacheHit: true
            };
        }
        return null;
    } catch (error) {
        console.error('Cache retrieval error:', error);
        return null;
    }
};

/**
 * Cache search results
 * @param {string} cacheKey - Cache key
 * @param {Object} results - Search results to cache
 * @param {number} customTTL - Custom TTL in seconds (optional)
 */
export const cacheSearchResults = (cacheKey, results, customTTL = null) => {
    try {
        const cacheData = {
            ...results,
            cachedAt: new Date().toISOString(),
            fromCache: false
        };
        
        if (customTTL) {
            searchCache.set(cacheKey, cacheData, customTTL);
        } else {
            searchCache.set(cacheKey, cacheData);
        }
        
        console.log(`💾 Cached search results: ${cacheKey.substring(0, 50)}...`);
    } catch (error) {
        console.error('Cache storage error:', error);
    }
};

/**
 * Track popular search terms for analytics
 * @param {string} searchTerm - Search term to track
 */
export const trackSearchTerm = (searchTerm) => {
    try {
        const term = searchTerm.toLowerCase().trim();
        const current = popularTermsCache.get('popular_terms') || {};
        
        current[term] = (current[term] || 0) + 1;
        popularTermsCache.set('popular_terms', current);
        
        // Log popular terms periodically
        if (Object.keys(current).length % 10 === 0) {
            console.log('📊 Popular search terms:', 
                Object.entries(current)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
            );
        }
    } catch (error) {
        console.error('Search term tracking error:', error);
    }
};

/**
 * Get popular search terms for suggestions
 * @param {number} limit - Number of terms to return
 * @returns {Array} - Popular search terms
 */
export const getPopularSearchTerms = (limit = 10) => {
    try {
        const terms = popularTermsCache.get('popular_terms') || {};
        
        return Object.entries(terms)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([term, count]) => ({ term, count }));
    } catch (error) {
        console.error('Popular terms retrieval error:', error);
        return [];
    }
};

/**
 * Clear search cache (useful for testing or cache invalidation)
 * @param {string} pattern - Optional pattern to match keys
 */
export const clearSearchCache = (pattern = null) => {
    try {
        if (pattern) {
            const keys = searchCache.keys();
            const matchingKeys = keys.filter(key => key.includes(pattern));
            searchCache.del(matchingKeys);
            console.log(`🗑️  Cleared ${matchingKeys.length} cache entries matching: ${pattern}`);
        } else {
            searchCache.flushAll();
            console.log('🗑️  Cleared entire search cache');
        }
    } catch (error) {
        console.error('Cache clearing error:', error);
    }
};

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export const getCacheStats = () => {
    try {
        return {
            searchCache: {
                keys: searchCache.getStats().keys,
                hits: searchCache.getStats().hits,
                misses: searchCache.getStats().misses,
                hitRate: (searchCache.getStats().hits / (searchCache.getStats().hits + searchCache.getStats().misses) * 100).toFixed(2) + '%'
            },
            popularTerms: {
                totalTerms: Object.keys(popularTermsCache.get('popular_terms') || {}).length,
                topTerms: getPopularSearchTerms(3)
            }
        };
    } catch (error) {
        console.error('Cache stats error:', error);
        return {};
    }
};

export default {
    generateSearchCacheKey,
    getCachedSearchResults,
    cacheSearchResults,
    trackSearchTerm,
    getPopularSearchTerms,
    clearSearchCache,
    getCacheStats
};
