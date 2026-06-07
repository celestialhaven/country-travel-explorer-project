const REST_COUNTRIES_BASE = 'https://restcountries.com/v3.1';
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';

function normalizeCountry(country) {
    const currencyNames = country.currencies
        ? Object.values(country.currencies).map(currency => currency.name)
        : [];

    return {
        id: country.cca3,
        name: country.name.common,
        officialName: country.name.official,
        capital: country.capital?.join(', ') || 'No official capital',
        population: country.population,
        area: country.area,
        region: country.region || 'Unknown',
        subregion: country.subregion || 'Unknown',
        languages: country.languages || {},
        currencies: currencyNames,
        flag: country.flags?.svg || country.flags?.png,
        flagAlt: country.flags?.alt || `Flag of ${country.name.common}`,
        mapsUrl: country.maps?.googleMaps,
    };
}

async function requestCountries(endpoint) {
    const response = await fetch(`${REST_COUNTRIES_BASE}${endpoint}`);

    if (!response.ok) {
        throw new Error(response.status === 404 ? 'No matching countries found.' : 'Country data could not be loaded.');
    }

    const data = await response.json();
    return data.map(normalizeCountry).sort((a, b) => a.name.localeCompare(b.name));
}

export function searchCountries(query) {
    return requestCountries(`/name/${encodeURIComponent(query)}`);
}

export function getCountriesByRegion(region) {
    return requestCountries(`/region/${encodeURIComponent(region)}`);
}

export function getCountriesBySubregion(subregion) {
    return requestCountries(`/subregion/${encodeURIComponent(subregion)}`);
}

export async function getCountriesBySubregions(subregions) {
    const results = await Promise.all(subregions.map(getCountriesBySubregion));
    const countries = results.flat();
    const uniqueCountries = new Map(countries.map(country => [country.id, country]));

    return [...uniqueCountries.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllCountries() {
    return requestCountries('/all?fields=name,capital,population,region,subregion,languages,currencies,flags,cca3,area,maps');
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
