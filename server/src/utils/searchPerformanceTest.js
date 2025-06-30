/**
 * Search Performance Test
 * Quick test to validate search optimization improvements
 */

import Crop from '../models/CropModel.js';
import { searchCrops } from '../controllers/searchController.js';

/**
 * Benchmark search performance
 * @param {number} iterations - Number of test iterations
 */
export const benchmarkSearch = async (iterations = 10) => {
    console.log('🚀 Starting search performance benchmark...');
    
    const testQueries = [
        'rice',
        'wheat', 
        'corn',
        'tomato',
        'potato',
        'organic',
        'fresh',
        'seed'
    ];

    const results = {
        totalTime: 0,
        avgTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        queries: []
    };

    for (let i = 0; i < iterations; i++) {
        const query = testQueries[i % testQueries.length];
        const startTime = Date.now();
        
        try {
            // Mock request and response objects
            const mockReq = {
                query: {
                    query,
                    type: 'exact',
                    status: 'available',
                    limit: 20
                }
            };
            
            const mockRes = {
                status: (code) => ({
                    json: (data) => {
                        const endTime = Date.now();
                        const duration = endTime - startTime;
                        
                        results.totalTime += duration;
                        results.queries.push({
                            query,
                            duration: `${duration}ms`,
                            cached: data.fromCache || false,
                            resultsCount: data.data?.length || 0
                        });
                        
                        if (data.fromCache) {
                            results.cacheHits++;
                        } else {
                            results.cacheMisses++;
                        }
                        
                        console.log(`Query "${query}": ${duration}ms ${data.fromCache ? '(cached)' : ''}`);
                        return data;
                    }
                })
            };
            
            await searchCrops(mockReq, mockRes);
            
        } catch (error) {
            console.error(`Error testing query "${query}":`, error.message);
        }
        
        // Small delay between queries
        if (i < iterations - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    results.avgTime = Math.round(results.totalTime / iterations);
    results.cacheHitRate = ((results.cacheHits / iterations) * 100).toFixed(2) + '%';
    
    console.log('\n📊 Benchmark Results:');
    console.log(`Total Time: ${results.totalTime}ms`);
    console.log(`Average Time: ${results.avgTime}ms`);
    console.log(`Cache Hit Rate: ${results.cacheHitRate}`);
    console.log(`Cache Hits: ${results.cacheHits}`);
    console.log(`Cache Misses: ${results.cacheMisses}`);
    
    return results;
};

/**
 * Test database index performance
 */
export const testIndexPerformance = async () => {
    console.log('📊 Testing database index performance...');
    
    const testCases = [
        { name: 'Name search', filter: { name: /rice/i } },
        { name: 'Status filter', filter: { status: 'available' } },
        { name: 'Compound search', filter: { status: 'available', name: /wheat/i } },
        { name: 'Price range', filter: { pricePerKg: { $gte: 10, $lte: 50 } } },
        { name: 'Farmer filter', filter: { farmerId: { $exists: true }, status: 'available' } }
    ];
    
    for (const testCase of testCases) {
        const startTime = Date.now();
        
        try {
            const results = await Crop.find(testCase.filter)
                .select('name status farmerId pricePerKg')
                .lean()
                .limit(50);
            
            const duration = Date.now() - startTime;
            console.log(`${testCase.name}: ${duration}ms (${results.length} results)`);
            
        } catch (error) {
            console.error(`Error in ${testCase.name}:`, error.message);
        }
    }
};

export default {
    benchmarkSearch,
    testIndexPerformance
};
