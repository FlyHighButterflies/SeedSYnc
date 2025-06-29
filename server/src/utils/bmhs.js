// Enhanced Boyer-Moore-Horspool-Sunday (BMHS) string search algorithm
// Optimized for agricultural product/crop name searching

/**
 * BMHS Algorithm for single pattern matching
 * @param {string} text - Text to search in
 * @param {string} pattern - Pattern to search for
 * @returns {number} - Index of first match, or -1 if not found
 */
function bmhsSearch(text, pattern) {
    if (!pattern || pattern.length === 0) return 0;
    if (!text || pattern.length > text.length) return -1;

    const m = pattern.length;
    const n = text.length;
    const shift = new Map();

    // Preprocessing: Build the shift table using Map for better performance
    // Initialize default shift value
    const defaultShift = m + 1;
    
    // Build character shift table
    for (let i = 0; i < m; i++) {
        shift.set(pattern[i], m - i);
    }

    let i = 0;
    while (i <= n - m) {
        let j = 0;
        // Compare pattern with text from left to right
        while (j < m && pattern[j] === text[i + j]) {
            j++;
        }
        
        if (j === m) {
            return i; // Match found at position i
        }
        
        // Sunday optimization: look at character after current window
        const nextChar = text[i + m];
        const shiftValue = shift.get(nextChar) || defaultShift;
        i += shiftValue;
    }
    
    return -1; // No match found
}

/**
 * Multi-pattern BMHS search for crop names
 * Useful for searching multiple crop variants or synonyms
 * @param {string} text - Text to search in
 * @param {string[]} patterns - Array of patterns to search for
 * @returns {Object} - {found: boolean, matches: Array of {pattern, index}}
 */
function bmhsMultiSearch(text, patterns) {
    const matches = [];
    
    for (const pattern of patterns) {
        const index = bmhsSearch(text, pattern);
        if (index !== -1) {
            matches.push({ pattern, index });
        }
    }
    
    return {
        found: matches.length > 0,
        matches: matches.sort((a, b) => a.index - b.index) // Sort by position
    };
}

/**
 * Fuzzy BMHS search for crop names with common variations
 * Handles common agricultural naming patterns
 * @param {string} text - Text to search in
 * @param {string} pattern - Base pattern to search for
 * @returns {Object} - {found: boolean, exactMatch: boolean, variations: Array}
 */
function bmhsFuzzySearch(text, pattern) {
    const variations = generateCropVariations(pattern);
    const result = bmhsMultiSearch(text, variations);
    
    return {
        found: result.found,
        exactMatch: result.matches.some(m => m.pattern === pattern),
        variations: result.matches
    };
}

/**
 * Generate common crop name variations
 * @param {string} cropName - Base crop name
 * @returns {string[]} - Array of variations
 */
function generateCropVariations(cropName) {
    const variations = [cropName];
    const lower = cropName.toLowerCase();
    
    // Add plural/singular forms
    if (lower.endsWith('s')) {
        variations.push(lower.slice(0, -1)); // Remove 's'
    } else {
        variations.push(lower + 's'); // Add 's'
    }
    
    // Add common agricultural suffixes/prefixes
    const commonVariations = [
        lower + ' seed',
        lower + ' seeds',
        'fresh ' + lower,
        'organic ' + lower,
        lower + ' crop',
        lower + ' produce'
    ];
    
    variations.push(...commonVariations);
    
    // Remove duplicates
    return [...new Set(variations)];
}

export default bmhsSearch;
export { bmhsMultiSearch, bmhsFuzzySearch, generateCropVariations };
