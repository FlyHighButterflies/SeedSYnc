// Boyer-Moore-Horspool-Sunday (BMHS) string search algorithm
function bmhsSearch(text, pattern) {
    if (!pattern || pattern.length === 0) return 0;
    if (pattern.length > text.length) return -1;

    const m = pattern.length;
    const n = text.length;
    const shift = {};

    // Preprocessing: Build the shift table
    for (let i = 0; i < 256; i++) shift[String.fromCharCode(i)] = m + 1;
    for (let i = 0; i < m; i++) shift[pattern[i]] = m - i;

    let i = 0;
    while (i <= n - m) {
        let j = 0;
        while (j < m && pattern[j] === text[i + j]) j++;
        if (j === m) return i; // Match found
        const nextChar = text[i + m] || '';
        i += shift[nextChar] || m + 1;
    }
    return -1; // No match
}

export default bmhsSearch;
