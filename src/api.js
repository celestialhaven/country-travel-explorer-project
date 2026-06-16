const COUNTRIES_DATA_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';
const POPULATION_DATA_URL = 'https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json';
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';
const fallbackImageUrls = [
    {
        regular: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&h=620&q=80',
        large: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
    },
    {
        regular: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&h=620&q=80',
        large: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85',
    },
    {
        regular: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&h=620&q=80',
        large: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    },
];
let countriesCache = null;
let populationCache = null;

function normalizeName(value) {
    return value.trim().toLowerCase();
}

async function getPopulationData() {
    if (populationCache) return populationCache;

    const response = await fetch(POPULATION_DATA_URL);

    if (!response.ok) {
        populationCache = new Map();
        return populationCache;
    }

    const data = await response.json();
    populationCache = new Map(data.map(item => [normalizeName(item.country), item.population]));
    return populationCache;
}

function normalizeCountry(country, populationByName) {
    const currencyNames = country.currencies
        ? Object.values(country.currencies).map(currency => currency.name)
        : [];
    const countryName = country.name?.common || 'Unknown country';
    const population = populationByName.get(normalizeName(countryName))
        || populationByName.get(normalizeName(country.name?.official || ''));

    return {
        id: country.cca3,
        name: countryName,
        officialName: country.name?.official || countryName,
        capital: country.capital?.join(', ') || 'No official capital',
        population,
        area: country.area,
        region: country.region || 'Unknown',
        subregion: country.subregion || 'Unknown',
        languages: country.languages || {},
        currencies: currencyNames,
        flag: country.flags?.svg || country.flags?.png || `https://flagcdn.com/${country.cca2?.toLowerCase()}.svg`,
        flagAlt: country.flags?.alt || `Flag of ${countryName}`,
        mapsUrl: country.maps?.googleMaps || country.maps?.openStreetMaps,
    };
}

async function getCountriesData() {
    if (countriesCache) return countriesCache;

    const [response, populationByName] = await Promise.all([
        fetch(COUNTRIES_DATA_URL),
        getPopulationData(),
    ]);

    if (!response.ok) {
        throw new Error('Country data could not be loaded.');
    }

    const data = await response.json();
    countriesCache = data.map(country => normalizeCountry(country, populationByName)).sort((a, b) => a.name.localeCompare(b.name));
    return countriesCache;
}

function matchesCountry(country, query) {
    const normalizedQuery = query.trim().toLowerCase();

    return country.name.toLowerCase().includes(normalizedQuery)
        || country.officialName.toLowerCase().includes(normalizedQuery);
}

export async function searchCountries(query) {
    const countries = await getCountriesData();
    const results = countries.filter(country => matchesCountry(country, query));

    if (!results.length) {
        throw new Error('No matching countries found.');
    }

    return results;
}

export async function getCountriesByRegion(region) {
    const countries = await getCountriesData();
    return countries.filter(country => country.region === region);
}

export async function getCountriesBySubregion(subregion) {
    const countries = await getCountriesData();
    return countries.filter(country => country.subregion === subregion);
}

export async function getCountriesBySubregions(subregions) {
    const results = await Promise.all(subregions.map(getCountriesBySubregion));
    const countries = results.flat();
    const uniqueCountries = new Map(countries.map(country => [country.id, country]));

    return [...uniqueCountries.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllCountries() {
    return getCountriesData();
}

function getCountryName(country) {
    return typeof country === 'string' ? country : country.name;
}

function getImageQuery(country) {
    const countryName = getCountryName(country);
    return `${countryName} travel`;
}

function getFallbackDestinationImages(countryName) {
    const subjects = ['travel landscape', 'scenic destination', 'cultural landmark'];

    return fallbackImageUrls.map((image, index) => ({
        id: `${countryName}-fallback-${index + 1}`,
        alt: `${countryName} ${subjects[index]}`,
        url: image.regular,
        largeUrl: image.large,
        credit: 'Unsplash fallback image',
        source: 'fallback',
    }));
}

export async function getDestinationImages(country, accessKey = '') {
    const countryName = getCountryName(country);
    const normalizedAccessKey = accessKey.trim();

    if (!normalizedAccessKey) {
        return {
            images: getFallbackDestinationImages(countryName),
            source: 'fallback',
            message: 'Add a valid Unsplash access key to load country-specific photos.',
        };
    }

    return getUnsplashDestinationImages(country, normalizedAccessKey);
}

async function getUnsplashDestinationImages(country, accessKey) {
    const countryName = getCountryName(country);

    const params = new URLSearchParams({
        query: getImageQuery(country),
        per_page: '6',
        orientation: 'landscape',
        order_by: 'relevant',
        content_filter: 'high',
    });

    const response = await fetch(`${UNSPLASH_BASE}?${params.toString()}`, {
        headers: {
            Authorization: `Client-ID ${accessKey}`,
        },
    });

    if (!response.ok) {
        const errorMessage = response.status === 401
            ? 'Your Unsplash access key was rejected. Check the key and try again.'
            : 'Unsplash country photos could not be loaded right now.';

        return {
            images: getFallbackDestinationImages(countryName),
            source: 'fallback',
            message: errorMessage,
        };
    }

    const data = await response.json();
    const photos = data.results || [];

    if (!photos.length) {
        return {
            images: getFallbackDestinationImages(countryName),
            source: 'fallback',
            message: `Unsplash did not return photos for ${countryName}.`,
        };
    }

    return {
        images: photos.map(photo => ({
            id: photo.id,
            alt: photo.alt_description || photo.description || `${countryName} travel destination`,
            url: photo.urls.regular,
            largeUrl: photo.urls.full || photo.urls.regular,
            credit: photo.user.name,
            sourceUrl: photo.links.html,
            source: 'unsplash',
        })),
        source: 'unsplash',
        message: `${countryName} photos loaded from Unsplash.`,
    };
}
