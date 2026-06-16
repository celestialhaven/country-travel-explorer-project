const FAVORITES_KEY = 'countryTravelExplorer:favorites';
const RECENTS_KEY = 'countryTravelExplorer:recentSearches';
const UNSPLASH_ACCESS_KEY = 'unsplashAccessKey';
const ENV_UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

function read(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    }
    catch {
        return fallback;
    }
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFavorites() {
    return read(FAVORITES_KEY, []);
}

export function saveFavorite(country) {
    const favorites = getFavorites();

    if (!favorites.some(item => item.id === country.id)) {
        write(FAVORITES_KEY, [...favorites, country]);
    }
}

export function removeFavorite(countryId) {
    write(FAVORITES_KEY, getFavorites().filter(country => country.id !== countryId));
}

export function isFavorite(countryId) {
    return getFavorites().some(country => country.id === countryId);
}

export function getRecentSearches() {
    return read(RECENTS_KEY, []);
}

export function saveRecentSearch(query) {
    const normalized = query.trim();
    if (!normalized) return;

    const recents = getRecentSearches().filter(item => item.toLowerCase() !== normalized.toLowerCase());
    write(RECENTS_KEY, [normalized, ...recents].slice(0, 6));
}

export function getUnsplashAccessKey() {
    return ENV_UNSPLASH_ACCESS_KEY || localStorage.getItem(UNSPLASH_ACCESS_KEY) || '';
}

export function saveUnsplashAccessKey(accessKey) {
    const normalized = accessKey.trim();

    if (normalized) {
        localStorage.setItem(UNSPLASH_ACCESS_KEY, normalized);
    }
    else {
        localStorage.removeItem(UNSPLASH_ACCESS_KEY);
    }
}
