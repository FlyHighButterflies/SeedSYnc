def bmhs(text, pattern):
    m, n = len(pattern), len(text)
    if m == 0:
        return 0

    shift = {ch: m+1 for ch in set(text)}
    for i in range(m):
        shift[pattern[i]] = m - i

    i = 0
    while i <= n - m:
        if text[i:i+m] == pattern:
            return i
        i += shift.get(text[i+m], m+1) if i+m < n else 1
    return -1