import {
    getAllCountries,
    getCountriesByRegion,
    getCountriesBySubregion,
    getCountriesBySubregions,
    getDestinationImages,
    searchCountries,
} from './api.js';
import { createElement, formatNumber, listValues } from './utils.js';
import {
    getFavorites,
    getRecentSearches,
    getUnsplashAccessKey,
    isFavorite,
    removeFavorite,
    saveFavorite,
    saveUnsplashAccessKey,
    saveRecentSearch,
} from './storage.js';

const countriesPerPage = 12;
const continentFilters = [
    { label: 'Africa', type: 'region', value: 'Africa' },
    { label: 'Asia', type: 'region', value: 'Asia' },
    { label: 'Europe', type: 'region', value: 'Europe' },
    { label: 'North America', type: 'subregions', value: ['North America', 'Central America', 'Caribbean'] },
    { label: 'South America', type: 'subregion', value: 'South America' },
    { label: 'Oceania', type: 'region', value: 'Oceania' },
];

function infoItem(label, value) {
    return createElement('div', { className: 'info-item' }, [
        createElement('span', { textContent: label }),
        createElement('strong', { textContent: value }),
    ]);
}

function countryCard(country, onSelect, onToggleFavorite) {
    const favorite = isFavorite(country.id);

    return createElement('article', { className: 'country-card' }, [
        createElement('img', { src: country.flag, alt: country.flagAlt, loading: 'lazy' }),
        createElement('div', { className: 'country-card-body' }, [
            createElement('div', { className: 'country-card-title' }, [
                createElement('h3', { textContent: country.name }),
                createElement('button', {
                    className: favorite ? 'icon-button is-active' : 'icon-button',
                    title: favorite ? 'Remove from favorites' : 'Add to favorites',
                    textContent: favorite ? 'Saved' : 'Save',
                    onClick: () => onToggleFavorite(country),
                }),
            ]),
            createElement('p', { textContent: `${country.region} - ${country.capital}` }),
            createElement('button', {
                className: 'text-button',
                textContent: 'View details',
                onClick: () => onSelect(country),
            }),
        ]),
    ]);
}

function unsplashKeyForm(accessKey, onSave) {
    const keyInput = createElement('input', {
        type: 'password',
        placeholder: 'Unsplash access key',
        value: accessKey,
        'aria-label': 'Unsplash access key',
    });

    return createElement('form', {
        className: 'api-key-form',
        onSubmit: event => {
            event.preventDefault();
            onSave(keyInput.value);
        },
    }, [
        keyInput,
        createElement('button', {
            className: 'api-key-button',
            type: 'submit',
            textContent: accessKey ? 'Update' : 'Use API',
        }),
    ]);
}

function imageViewer(image, onClose) {
    if (!image) return null;

    return createElement('div', {
        className: 'image-viewer',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': image.alt,
        onClick: event => {
            if (event.target === event.currentTarget) onClose();
        },
    }, [
        createElement('div', { className: 'image-viewer-panel' }, [
            createElement('button', {
                className: 'image-viewer-close',
                type: 'button',
                title: 'Close image preview',
                'aria-label': 'Close image preview',
                textContent: 'x',
                onClick: onClose,
            }),
            createElement('img', { src: image.largeUrl || image.url, alt: image.alt }),
            createElement('div', { className: 'image-viewer-caption' }, [
                createElement('strong', { textContent: image.alt }),
                createElement('span', { textContent: image.credit }),
            ]),
        ]),
    ]);
}

function detailPanel(country, images, isLoadingImages, onToggleFavorite, onViewImage) {
    if (!country) {
        return createElement('section', { className: 'detail-panel empty-state' }, [
            createElement('h2', { textContent: 'Start exploring' }),
            createElement('p', { textContent: 'Search for a country or choose a region to view country details, travel images, favorites, and comparisons.' }),
        ]);
    }

    const gallery = isLoadingImages
        ? createElement('p', { className: 'muted', textContent: 'Loading destination images...' })
        : images.length
        ? createElement('div', { className: 'image-gallery' }, images.map(image => (
            createElement('figure', {}, [
                createElement('button', {
                    className: 'gallery-image-button',
                    type: 'button',
                    'aria-label': `View larger image: ${image.alt}`,
                    onClick: () => onViewImage(image),
                }, [
                    createElement('img', { src: image.url, alt: image.alt, loading: 'lazy' }),
                ]),
                createElement('figcaption', { textContent: image.credit }),
            ])
        )))
        : createElement('p', { className: 'muted', textContent: 'Travel images are unavailable right now.' });

    return createElement('section', { className: 'detail-panel' }, [
        createElement('div', { className: 'detail-heading' }, [
            createElement('div', {}, [
                createElement('p', { className: 'eyebrow', textContent: country.region }),
                createElement('h2', { textContent: country.name }),
                createElement('p', { textContent: country.officialName }),
            ]),
            createElement('button', {
                className: isFavorite(country.id) ? 'primary-button secondary' : 'primary-button',
                textContent: isFavorite(country.id) ? 'Remove favorite' : 'Save favorite',
                onClick: () => onToggleFavorite(country),
            }),
        ]),
        createElement('div', { className: 'detail-grid' }, [
            createElement('img', { className: 'flag-large', src: country.flag, alt: country.flagAlt }),
            createElement('div', { className: 'info-grid' }, [
                infoItem('Capital', country.capital),
                infoItem('Population', formatNumber(country.population)),
                infoItem('Area', `${formatNumber(country.area)} km2`),
                infoItem('Subregion', country.subregion),
                infoItem('Languages', listValues(country.languages)),
                infoItem('Currency', country.currencies.join(', ') || 'Unknown'),
            ]),
        ]),
        createElement('div', { className: 'gallery-header' }, [
            createElement('h3', { textContent: 'Travel inspiration' }),
            createElement('span', { textContent: 'Unsplash-powered images' }),
        ]),
        gallery,
    ]);
}

function favoritesPanel(favorites, onSelect, onRemove) {
    return createElement('aside', { className: 'side-panel' }, [
        createElement('h2', { textContent: 'Favorites' }),
        favorites.length
            ? createElement('div', { className: 'favorite-list' }, favorites.map(country => (
                createElement('div', { className: 'favorite-row' }, [
                    createElement('button', {
                        className: 'link-button',
                        textContent: country.name,
                        onClick: () => onSelect(country),
                    }),
                    createElement('button', {
                        className: 'icon-button compact',
                        textContent: 'x',
                        title: `Remove ${country.name}`,
                        onClick: () => onRemove(country.id),
                    }),
                ])
            )))
            : createElement('p', { className: 'muted', textContent: 'Saved countries will appear here.' }),
    ]);
}

function findCountryByInput(countries, input) {
    const query = input.trim().toLowerCase();
    if (!query) return null;

    return countries.find(country => country.name.toLowerCase() === query)
        || countries.find(country => country.officialName.toLowerCase() === query)
        || countries.find(country => country.name.toLowerCase().startsWith(query))
        || countries.find(country => country.name.toLowerCase().includes(query))
        || null;
}

async function findCountryFromApi(input) {
    const countries = await searchCountries(input);
    return findCountryByInput(countries, input) || countries[0] || null;
}

function comparisonPanel(compareCountries, compareInputs, compareError, isComparing, onCompare) {
    const hasDuplicateSelection = compareCountries.length === 2 && compareCountries[0].id === compareCountries[1].id;
    const firstInput = createElement('input', {
        type: 'text',
        placeholder: 'First country',
        value: compareInputs[0] || '',
        'aria-label': 'First country to compare',
    });
    const secondInput = createElement('input', {
        type: 'text',
        placeholder: 'Second country',
        value: compareInputs[1] || '',
        'aria-label': 'Second country to compare',
    });

    return createElement('section', { className: 'comparison-panel' }, [
        createElement('div', { className: 'section-heading' }, [
            createElement('h2', { textContent: 'Compare countries' }),
            createElement('p', { textContent: 'Type any two country names.' }),
        ]),
        createElement('form', {
            className: 'comparison-controls',
            onSubmit: event => {
                event.preventDefault();
                onCompare(firstInput.value, secondInput.value);
            },
        }, [
            createElement('label', { className: 'comparison-field' }, [
                createElement('span', { textContent: 'First country' }),
                firstInput,
            ]),
            createElement('label', { className: 'comparison-field' }, [
                createElement('span', { textContent: 'Second country' }),
                secondInput,
            ]),
            createElement('button', {
                className: 'primary-button compare-button',
                disabled: isComparing,
                type: 'submit',
                textContent: isComparing ? 'Comparing...' : 'Compare',
            }),
        ]),
        compareError
            ? createElement('p', { className: 'muted', textContent: compareError })
            : hasDuplicateSelection
            ? createElement('p', { className: 'muted', textContent: 'Choose two different countries to compare.' })
            : compareCountries.length === 2
            ? createElement('div', { className: 'comparison-results' }, [
                createElement('div', { className: 'comparison-country-heading' }, [
                    createElement('span', { textContent: 'Metric' }),
                    createElement('strong', { textContent: compareCountries[0].name }),
                    createElement('strong', { textContent: compareCountries[1].name }),
                ]),
                comparisonRow('Population', formatNumber(compareCountries[0].population), formatNumber(compareCountries[1].population)),
                comparisonRow('Area', `${formatNumber(compareCountries[0].area)} km2`, `${formatNumber(compareCountries[1].area)} km2`),
                comparisonRow('Region', compareCountries[0].region, compareCountries[1].region),
                comparisonRow('Languages', listValues(compareCountries[0].languages), listValues(compareCountries[1].languages)),
                comparisonRow('Currency', compareCountries[0].currencies.join(', ') || 'Unknown', compareCountries[1].currencies.join(', ') || 'Unknown'),
            ])
            : createElement('p', { className: 'muted', textContent: 'Enter two countries to compare population, language, currency, area, and region.' }),
    ]);
}

function comparisonRow(label, firstValue, secondValue) {
    return createElement('div', { className: 'comparison-row' }, [
        createElement('span', { textContent: label }),
        createElement('strong', { textContent: firstValue }),
        createElement('strong', { textContent: secondValue }),
    ]);
}

function paginationControls(currentPage, totalPages, totalCountries, onPageChange) {
    if (totalPages <= 1) {
        return createElement('p', { className: 'pagination-summary', textContent: `${totalCountries} countries shown.` });
    }

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return createElement('nav', { className: 'pagination', 'aria-label': 'Country result pages' }, [
        createElement('button', {
            className: 'page-button',
            disabled: currentPage === 1,
            textContent: 'Previous',
            onClick: () => onPageChange(currentPage - 1),
        }),
        createElement('div', { className: 'page-number-list' }, pageNumbers.map(pageNumber => (
            createElement('button', {
                className: pageNumber === currentPage ? 'page-button is-current' : 'page-button',
                'aria-label': `Page ${pageNumber}`,
                'aria-current': pageNumber === currentPage ? 'page' : null,
                textContent: pageNumber,
                onClick: () => onPageChange(pageNumber),
            })
        ))),
        createElement('button', {
            className: 'page-button',
            disabled: currentPage === totalPages,
            textContent: 'Next',
            onClick: () => onPageChange(currentPage + 1),
        }),
    ]);
}

function App() {
    const state = {
        countries: [],
        selectedCountry: null,
        destinationImages: [],
        favorites: getFavorites(),
        recents: getRecentSearches(),
        compareCountries: [],
        compareInputs: ['', ''],
        compareError: '',
        isComparing: false,
        currentPage: 1,
        loading: false,
        loadingImages: false,
        selectedImage: null,
        unsplashAccessKey: getUnsplashAccessKey(),
        message: 'Loading countries...',
    };

    const root = createElement('div', { className: 'app-shell' });

    function setState(updates) {
        Object.assign(state, updates);
        render();
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && state.selectedImage) {
            setState({ selectedImage: null });
        }
    });

    async function loadCountries(loader, loadingMessage) {
        setState({ loading: true, message: loadingMessage });

        try {
            const countries = await loader();
            setState({
                countries,
                selectedCountry: countries[0] || null,
                compareCountries: [],
                compareInputs: ['', ''],
                compareError: '',
                isComparing: false,
                currentPage: 1,
                loading: false,
                message: countries.length ? `${countries.length} countries ready to explore.` : 'No countries found.',
            });
            if (countries[0]) loadImages(countries[0]);
        }
        catch (error) {
            setState({ countries: [], selectedCountry: null, compareCountries: [], compareInputs: ['', ''], compareError: '', isComparing: false, currentPage: 1, loading: false, message: error.message });
        }
    }

    async function loadImages(country) {
        setState({ selectedCountry: country, destinationImages: [], loadingImages: true, selectedImage: null });

        try {
            const images = await getDestinationImages(country.name);
            setState({ destinationImages: images, loadingImages: false });
        }
        catch {
            setState({ destinationImages: [], loadingImages: false });
        }
    }

    function updateUnsplashAccessKey(accessKey) {
        saveUnsplashAccessKey(accessKey);
        const nextAccessKey = getUnsplashAccessKey();
        setState({ unsplashAccessKey: nextAccessKey });

        if (state.selectedCountry) {
            loadImages(state.selectedCountry);
        }
    }

    function toggleFavorite(country) {
        if (isFavorite(country.id)) {
            removeFavorite(country.id);
        }
        else {
            saveFavorite(country);
        }

        setState({ favorites: getFavorites() });
    }

    function render() {
        root.replaceChildren();

        const searchInput = createElement('input', {
            type: 'search',
            placeholder: 'Search countries',
            'aria-label': 'Search countries',
        });

        const header = createElement('header', { className: 'hero' }, [
            createElement('nav', { className: 'topbar' }, [
                createElement('div', { className: 'brand' }, [
                    createElement('span', { className: 'brand-mark', textContent: 'CT' }),
                    createElement('span', { textContent: 'Country & Travel Explorer' }),
                ]),
                unsplashKeyForm(state.unsplashAccessKey, updateUnsplashAccessKey),
            ]),
            createElement('div', { className: 'hero-content' }, [
                createElement('h1', { textContent: 'Explore countries, cultures, and travel ideas.' }),
                createElement('form', {
                    className: 'search-panel',
                    onSubmit: event => {
                        event.preventDefault();
                        const query = searchInput.value.trim();
                        if (!query) return;
                        saveRecentSearch(query);
                        setState({ recents: getRecentSearches() });
                        loadCountries(() => searchCountries(query), `Searching for ${query}...`);
                    },
                }, [
                    searchInput,
                    createElement('button', { className: 'primary-button', type: 'submit', textContent: 'Search' }),
                    createElement('select', {
                        'aria-label': 'Filter by region',
                        onChange: event => {
                            if (!event.target.value) return;

                            const filter = continentFilters.find(item => item.label === event.target.value);
                            if (!filter) return;

                            let loader = () => getCountriesByRegion(filter.value);

                            if (filter.type === 'subregion') {
                                loader = () => getCountriesBySubregion(filter.value);
                            }
                            else if (filter.type === 'subregions') {
                                loader = () => getCountriesBySubregions(filter.value);
                            }

                            if (filter) {
                                loadCountries(loader, `Loading ${filter.label}...`);
                            }
                        },
                    }, [
                        createElement('option', { value: '', textContent: 'Browse by continent' }),
                        ...continentFilters.map(filter => createElement('option', { value: filter.label, textContent: filter.label })),
                    ]),
                ]),
                createElement('div', { className: 'recent-searches' }, [
                    ...state.recents.map(query => createElement('button', {
                        className: 'chip',
                        textContent: query,
                        onClick: () => loadCountries(() => searchCountries(query), `Searching for ${query}...`),
                    })),
                ]),
            ]),
        ]);

        const totalPages = Math.max(1, Math.ceil(state.countries.length / countriesPerPage));
        const currentPage = Math.min(state.currentPage, totalPages);
        const pageStart = (currentPage - 1) * countriesPerPage;
        const pageEnd = pageStart + countriesPerPage;
        const pageCountries = state.countries.slice(pageStart, pageEnd);
        const pageMessage = state.countries.length
            ? `${state.message} Showing ${pageStart + 1}-${Math.min(pageEnd, state.countries.length)}.`
            : state.message;

        const countryGrid = state.loading
            ? createElement('p', { className: 'status-text', textContent: state.message })
            : createElement('div', { className: 'country-grid' }, pageCountries.map(country => (
                countryCard(country, loadImages, toggleFavorite)
            )));

        const main = createElement('main', { className: 'main-layout' }, [
                createElement('section', { className: 'results-panel' }, [
                    createElement('div', { className: 'section-heading' }, [
                        createElement('h2', { textContent: 'Country results' }),
                        createElement('p', { textContent: pageMessage }),
                    ]),
                    countryGrid,
                    !state.loading && paginationControls(currentPage, totalPages, state.countries.length, page => {
                        setState({ currentPage: page });
                    }),
                    comparisonPanel(state.compareCountries, state.compareInputs, state.compareError, state.isComparing, async (firstValue, secondValue) => {
                        if (!firstValue.trim() || !secondValue.trim()) {
                            setState({
                                compareCountries: [],
                                compareInputs: [firstValue, secondValue],
                                compareError: 'Please enter two country names.',
                            });
                            return;
                        }

                        setState({
                            compareCountries: [],
                            compareInputs: [firstValue, secondValue],
                            compareError: '',
                            isComparing: true,
                        });

                        try {
                            const [firstCountry, secondCountry] = await Promise.all([
                                findCountryFromApi(firstValue),
                                findCountryFromApi(secondValue),
                            ]);

                            if (!firstCountry || !secondCountry) {
                                setState({
                                    compareCountries: [],
                                    compareInputs: [firstValue, secondValue],
                                    compareError: 'One or both countries could not be found.',
                                    isComparing: false,
                                });
                                return;
                            }

                            setState({
                                compareCountries: [firstCountry, secondCountry],
                                compareInputs: [firstCountry.name, secondCountry.name],
                                compareError: '',
                                isComparing: false,
                            });
                        }
                        catch {
                            setState({
                                compareCountries: [],
                                compareInputs: [firstValue, secondValue],
                                compareError: 'Country comparison could not be loaded. Check the country names and try again.',
                                isComparing: false,
                            });
                        }
                    }),
                ]),
                createElement('div', { className: 'detail-column' }, [
                    detailPanel(state.selectedCountry, state.destinationImages, state.loadingImages, toggleFavorite, image => {
                        setState({ selectedImage: image });
                    }),
                    favoritesPanel(state.favorites, loadImages, countryId => {
                        removeFavorite(countryId);
                        setState({ favorites: getFavorites() });
                    }),
                ]),
            ]);

        root.append(header, main);

        if (state.selectedImage) {
            root.append(imageViewer(state.selectedImage, () => setState({ selectedImage: null })));
        }
    }

    render();
    loadCountries(getAllCountries, 'Loading countries...');

    return root;
}

export default App;
