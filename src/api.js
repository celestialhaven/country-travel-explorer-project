const COUNTRIES_DATA_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';
let countriesCache = null;

function normalizeCountry(country) {
    const currencyNames = country.currencies
        ? Object.values(country.currencies).map(currency => currency.name)
        : [];
    const countryName = country.name?.common || 'Unknown country';

    return {
        id: country.cca3,
        name: countryName,
        officialName: country.name?.official || countryName,
        capital: country.capital?.join(', ') || 'No official capital',
        population: country.population,
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

    const response = await fetch(COUNTRIES_DATA_URL);

    if (!response.ok) {
        throw new Error('Country data could not be loaded.');
    }

    const data = await response.json();
    countriesCache = data.map(normalizeCountry).sort((a, b) => a.name.localeCompare(b.name));
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

export async function getDestinationImages(countryName) {
    const accessKey = localStorage.getItem('unsplashAccessKey');

    if (!accessKey) {
        return [
            {
                id: `${countryName}-landscape`,
                alt: `${countryName} travel landscape`,
                url: `https://source.unsplash.com/900x620/?${encodeURIComponent(`${countryName} travel landscape`)}`,
                credit: 'Unsplash Source',
            },
            {
                id: `${countryName}-city`,
                alt: `${countryName} city destination`,
                url: `https://source.unsplash.com/900x620/?${encodeURIComponent(`${countryName} city`)}`,
                credit: 'Unsplash Source',
            },
            {
                id: `${countryName}-culture`,
                alt: `${countryName} culture`,
                url: `https://source.unsplash.com/900x620/?${encodeURIComponent(`${countryName} culture`)}`,
                credit: 'Unsplash Source',
            },
        ];
    }

    const params = new URLSearchParams({
        query: `${countryName} travel`,
        per_page: '6',
        orientation: 'landscape',
        client_id: accessKey,
    });

    const response = await fetch(`${UNSPLASH_BASE}?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Destination images could not be loaded.');
    }

    const data = await response.json();

    return data.results.map(photo => ({
        id: photo.id,
        alt: photo.alt_description || `${countryName} travel destination`,
        url: photo.urls.regular,
        credit: photo.user.name,
    }));
}
