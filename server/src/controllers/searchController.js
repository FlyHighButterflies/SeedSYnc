import Crop from '../models/CropModel.js';
import bmhsSearch, { bmhsMultiSearch, bmhsFuzzySearch, generateCropVariations } from '../utils/bmhs.js';
import { 
    generateSearchCacheKey,
    getCachedSearchResults,
    cacheSearchResults,
    trackSearchTerm,
    getCacheStats,
    getPopularSearchTerms
} from '../utils/searchOptimization.js';

/**
 * Optimized crop search using BMHS algorithm with database-level filtering
 * Supports buyer/farmer specific filtering and pagination for better responsiveness
 */
const searchCrops = async (req, res) => {
    try {
        const { 
            query, 
            type = 'exact', 
            role, 
            status = 'available', 
            minPrice, 
            maxPrice, 
            limit = 50, 
            offset = 0,
            farmerId,
            buyerId
        } = req.query;

        if (!query) {
            return res.status(400).json({ 
                success: false, 
                message: 'Query parameter is required.' 
            });
        }

        // Check cache first for performance optimization
        const cacheKey = generateSearchCacheKey(req.query);
        const cachedResult = getCachedSearchResults(cacheKey);
        
        if (cachedResult) {
            // Track search term even for cached results
            trackSearchTerm(query);
            return res.status(200).json(cachedResult);
        }

        // Build optimized database filter
        const dbFilter = { status };
        
        // Role-based filtering for better performance
        if (role === 'farmer' && farmerId) {
            dbFilter.farmerId = farmerId;
        } else if (role === 'buyer' && buyerId) {
            dbFilter.buyerId = buyerId;
        }

        // Price range filtering at database level
        if (minPrice || maxPrice) {
            dbFilter.$or = [];
            
            if (minPrice && maxPrice) {
                dbFilter.$or.push(
                    { pricePerKg: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) } },
                    { budgetPerKg: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) } }
                );
            } else if (minPrice) {
                dbFilter.$or.push(
                    { pricePerKg: { $gte: parseFloat(minPrice) } },
                    { budgetPerKg: { $gte: parseFloat(minPrice) } }
                );
            } else if (maxPrice) {
                dbFilter.$or.push(
                    { pricePerKg: { $lte: parseFloat(maxPrice) } },
                    { budgetPerKg: { $lte: parseFloat(maxPrice) } }
                );
            }
        }

        // Initial database query with optimized filtering
        const startTime = Date.now();
        const crops = await Crop.find(dbFilter)
            .select('name status farmerId buyerId pricePerKg budgetPerKg initialWeightKg currentWeightKg harvestDate expiryDate createdAt')
            .lean() // Use lean for better performance
            .limit(parseInt(limit) * 2) // Get more than needed for BMHS filtering
            .skip(parseInt(offset));

        const dbQueryTime = Date.now() - startTime;

        if (!crops.length) {
            const emptyResult = {
                success: true,
                data: [],
                pagination: {
                    total: 0,
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                },
                searchInfo: {
                    query,
                    type,
                    role,
                    resultsFound: 0,
                    dbQueryTime: `${dbQueryTime}ms`
                }
            };
            
            // Cache empty results too (with shorter TTL)
            cacheSearchResults(cacheKey, emptyResult, 60);
            trackSearchTerm(query);
            
            return res.status(200).json(emptyResult);
        }

        // Apply BMHS search algorithm based on type
        let filteredResults = [];
        const queryLower = query.toLowerCase();
        const bmhsStartTime = Date.now();

        switch (type) {
            case 'fuzzy':
                // Use fuzzy search for variations and common agricultural terms
                filteredResults = crops.filter(crop => {
                    const fuzzyResult = bmhsFuzzySearch(crop.name.toLowerCase(), queryLower);
                    return fuzzyResult.found;
                });
                break;

            case 'multi':
                // Generate multiple search patterns
                const searchPatterns = generateCropVariations(queryLower);
                filteredResults = crops.filter(crop => {
                    const multiResult = bmhsMultiSearch(crop.name.toLowerCase(), searchPatterns);
                    return multiResult.found;
                });
                break;

            case 'exact':
            default:
                // Use exact BMHS matching
                filteredResults = crops.filter(crop =>
                    bmhsSearch(crop.name.toLowerCase(), queryLower) !== -1
                );
                break;
        }

        const bmhsTime = Date.now() - bmhsStartTime;

        // Apply final limit after BMHS filtering
        const finalResults = filteredResults.slice(0, parseInt(limit));

        // Enhanced response with search metadata
        const response = {
            success: true,
            data: finalResults,
            pagination: {
                total: filteredResults.length,
                returned: finalResults.length,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: filteredResults.length > parseInt(limit)
            },
            searchInfo: {
                query,
                type,
                role,
                filtersApplied: {
                    status,
                    priceRange: minPrice || maxPrice ? { minPrice, maxPrice } : null,
                    roleSpecific: role ? { role, farmerId, buyerId } : null
                },
                resultsFound: filteredResults.length,
                dbQueryResults: crops.length,
                performance: {
                    dbQueryTime: `${dbQueryTime}ms`,
                    bmhsTime: `${bmhsTime}ms`,
                    totalTime: `${Date.now() - startTime + dbQueryTime}ms`
                },
                searchTime: new Date().toISOString()
            }
        };

        // Cache successful results
        cacheSearchResults(cacheKey, response);
        trackSearchTerm(query);

        res.status(200).json(response);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error during search',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get search suggestions based on existing crop names
 * Optimized for fast autocomplete functionality
 */
const getSearchSuggestions = async (req, res) => {
    try {
        const { query, limit = 10 } = req.query;

        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Query must be at least 2 characters long'
            });
        }

        // Use database aggregation for fast suggestions
        const suggestions = await Crop.aggregate([
            {
                $match: {
                    status: 'available',
                    name: { $regex: query, $options: 'i' }
                }
            },
            {
                $group: {
                    _id: '$name',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$pricePerKg' },
                    avgBudget: { $avg: '$budgetPerKg' }
                }
            },
            {
                $sort: { count: -1, _id: 1 }
            },
            {
                $limit: parseInt(limit)
            },
            {
                $project: {
                    suggestion: '$_id',
                    popularity: '$count',
                    averagePrice: { $round: ['$avgPrice', 2] },
                    averageBudget: { $round: ['$avgBudget', 2] },
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: suggestions,
            meta: {
                query,
                suggestionsCount: suggestions.length,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving search suggestions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get search statistics and performance metrics
 * Useful for monitoring and optimization
 */
const getSearchStats = async (req, res) => {
    try {
        const cacheStats = getCacheStats();
        const popularTerms = getPopularSearchTerms(10);
        
        // Get database statistics
        const totalCrops = await Crop.countDocuments();
        const availableCrops = await Crop.countDocuments({ status: 'available' });
        const farmerCrops = await Crop.countDocuments({ farmerId: { $exists: true } });
        const buyerCrops = await Crop.countDocuments({ buyerId: { $exists: true } });

        res.status(200).json({
            success: true,
            data: {
                cache: cacheStats,
                popularSearchTerms: popularTerms,
                database: {
                    totalCrops,
                    availableCrops,
                    farmerCrops,
                    buyerCrops,
                    availabilityRate: ((availableCrops / totalCrops) * 100).toFixed(2) + '%'
                },
                indexingStatus: {
                    textIndexExists: true, // MongoDB text index on name field
                    compoundIndexes: 8 // Number of compound indexes created
                },
                generatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Search stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving search statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default { searchCrops, getSearchSuggestions, getSearchStats };
