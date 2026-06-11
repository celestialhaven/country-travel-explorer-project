# Country & Travel Explorer - Trello Board Documentation

Use this document as the structure for a Trello board. Each section represents a Trello list, and each `Card` can be copied into Trello as an individual card.

## Board Name

Country & Travel Explorer - WDD330 Final Project

## Board Description

A responsive JavaScript travel discovery app that lets users search and browse countries, view country details, save favorites, review recent searches, compare two countries, and see travel inspiration images. The project uses Parcel, modular JavaScript, REST Countries API data, optional Unsplash API support, and browser localStorage.

## Labels

- `Feature`
- `API`
- `UI`
- `Storage`
- `Testing`
- `Documentation`
- `Enhancement`
- `Bug`
- `Complete`

---

## List: Project Overview

### Card: Project Summary

**Labels:** `Documentation`, `Complete`

**Description:**
Country & Travel Explorer is a single-page web application for exploring country information and travel ideas. Users can search by country name, browse by continent, view detailed country data, save countries as favorites, reuse recent searches, compare country metrics, and view travel images.

**Key Features:**
- [x] Search countries by name.
- [x] Browse countries by continent or grouped subregions.
- [x] View flag, official name, capital, population, area, region, subregion, languages, and currencies.
- [x] View destination image galleries.
- [x] Save and remove favorite countries.
- [x] Store recent searches in the browser.
- [x] Compare two countries side by side.
- [x] Paginate country result cards.
- [x] Responsive layout for desktop and mobile.

### Card: Tech Stack

**Labels:** `Documentation`, `Complete`

**Description:**
The project is built with vanilla JavaScript modules, Parcel, HTML, and CSS.

**Checklist:**
- [x] JavaScript ES modules
- [x] Parcel development/build tooling
- [x] HTML entry file
- [x] CSS custom properties and responsive media queries
- [x] REST Countries API
- [x] Unsplash image search API with fallback image URLs
- [x] Browser localStorage

### Card: Project File Map

**Labels:** `Documentation`, `Complete`

**Description:**
Main files and responsibilities.

**Checklist:**
- [x] `index.html` - App entry point and root mount element.
- [x] `src/index.js` - Imports and mounts the app.
- [x] `src/App.js` - Main application state, rendering, event handling, country details, favorites, comparison, search, filters, and pagination.
- [x] `src/api.js` - API requests and country data normalization.
- [x] `src/storage.js` - localStorage helpers for favorites and recent searches.
- [x] `src/utils.js` - DOM element helper and formatting helpers.
- [x] `css/main.css` - App layout, components, responsive styles, and visual theme.
- [x] `package.json` - Project metadata, scripts, and dependencies.

---

## List: Setup & Running

### Card: Install Dependencies

**Labels:** `Documentation`

**Description:**
Install project dependencies before running the app.

**Checklist:**
- Open terminal in the project folder.
- Run `npm install`.
- Confirm `node_modules` is created.

### Card: Start Development Server

**Labels:** `Documentation`

**Description:**
Run the local Parcel development server.

**Checklist:**
- Run `npm start`.
- Open the local URL shown in the terminal.
- Confirm the app loads and displays country results.

### Card: Build Project

**Labels:** `Documentation`

**Description:**
Create a production build of the project.

**Checklist:**
- Run `npm run build`.
- Confirm Parcel creates the `dist` output.
- Use the build output for deployment if needed.

### Card: Optional Unsplash API Key

**Labels:** `API`, `Documentation`

**Description:**
The app can use an Unsplash API access key for richer destination image results. If no key exists, the app uses Unsplash Source fallback image URLs.

**Checklist:**
- Create or obtain an Unsplash access key.
- In the browser console, run:

```js
localStorage.setItem('unsplashAccessKey', 'YOUR_ACCESS_KEY_HERE');
```

- Refresh the app.
- Open a country detail panel and confirm travel images load.

---

## List: Completed Features

### Card: Country Search

**Labels:** `Feature`, `API`, `Complete`

**Description:**
Users can search for countries by entering a country name in the search field.

**Acceptance Criteria:**
- [x] User can type a country name.
- [x] Search submits through the form.
- [x] App calls the REST Countries name endpoint.
- [x] Matching countries display in the results grid.
- [x] Empty searches do not trigger a request.
- [x] Search errors show a readable message.

### Card: Browse by Continent

**Labels:** `Feature`, `API`, `Complete`

**Description:**
Users can browse countries by selecting a continent from the dropdown.

**Acceptance Criteria:**
- [x] Africa, Asia, Europe, North America, South America, and Oceania are available.
- [x] Region filters use REST Countries region endpoints.
- [x] Subregion filters support South America.
- [x] North America combines North America, Central America, and Caribbean subregions.
- [x] Results reset to page 1 after filtering.

### Card: Country Result Cards

**Labels:** `Feature`, `UI`, `Complete`

**Description:**
Country cards display the flag, country name, region, capital, save button, and details button.

**Acceptance Criteria:**
- [x] Cards render from normalized country data.
- [x] Flag images include alt text.
- [x] Save button toggles favorite state.
- [x] View details button opens the detail panel.

### Card: Country Detail Panel

**Labels:** `Feature`, `UI`, `Complete`

**Description:**
The detail panel shows full country information and a travel inspiration gallery.

**Acceptance Criteria:**
- [x] Shows region, common name, official name, flag, capital, population, area, subregion, languages, and currency.
- [x] Shows loading text while destination images load.
- [x] Allows saving or removing the selected country as a favorite.
- [x] Handles missing country values with fallback text.

### Card: Travel Inspiration Gallery

**Labels:** `Feature`, `API`, `UI`, `Complete`

**Description:**
Each selected country loads travel-related images.

**Acceptance Criteria:**
- [x] With an Unsplash access key, app calls Unsplash Search Photos API.
- [x] Without an access key, app uses fallback Unsplash Source URLs.
- [x] Gallery includes image alt text and photo credit text.
- [x] Image loading failures do not break the app.

### Card: Favorites

**Labels:** `Feature`, `Storage`, `Complete`

**Description:**
Users can save countries to a favorites list and remove them later.

**Acceptance Criteria:**
- [x] Favorite countries persist in localStorage.
- [x] Duplicate favorites are prevented.
- [x] Favorites display in the side panel.
- [x] Users can select a favorite to reload its details.
- [x] Users can remove a favorite.

### Card: Recent Searches

**Labels:** `Feature`, `Storage`, `Complete`

**Description:**
Recent country searches are saved and displayed as quick-access chips.

**Acceptance Criteria:**
- [x] Recent searches persist in localStorage.
- [x] Duplicate searches are moved to the front.
- [x] Recent search list is limited to 6 items.
- [x] Clicking a chip runs that search again.

### Card: Country Comparison

**Labels:** `Feature`, `API`, `UI`, `Complete`

**Description:**
Users can compare two countries by entering their names.

**Acceptance Criteria:**
- [x] User can enter two country names.
- [x] App validates that both fields are filled.
- [x] App searches both countries in parallel.
- [x] Comparison displays population, area, region, languages, and currency.
- [x] Duplicate country selection displays a helpful message.
- [x] Failed lookups show a readable error.

### Card: Pagination

**Labels:** `Feature`, `UI`, `Complete`

**Description:**
Country results are paginated to keep the interface readable.

**Acceptance Criteria:**
- [x] Results show 12 countries per page.
- [x] Previous and Next buttons work.
- [x] Current page is visually marked.
- [x] Pagination hides full controls when only one page exists.

### Card: Responsive Layout

**Labels:** `UI`, `Complete`

**Description:**
The app layout adapts to desktop, tablet, and mobile screen sizes.

**Acceptance Criteria:**
- [x] Desktop uses a two-column main layout.
- [x] Smaller screens collapse to one column.
- [x] Search controls stack on mobile.
- [x] Comparison rows stack on mobile.
- [x] Text and images remain readable across breakpoints.

---

## List: API & Data

### Card: REST Countries Integration

**Labels:** `API`, `Complete`

**Description:**
The app uses REST Countries API as the primary data source.

**Endpoints Used:**
- [x] `/all?fields=name,capital,population,region,subregion,languages,currencies,flags,cca3,area,maps`
- [x] `/name/{query}`
- [x] `/region/{region}`
- [x] `/subregion/{subregion}`

**Normalized Country Shape:**
- [x] `id`
- [x] `name`
- [x] `officialName`
- [x] `capital`
- [x] `population`
- [x] `area`
- [x] `region`
- [x] `subregion`
- [x] `languages`
- [x] `currencies`
- [x] `flag`
- [x] `flagAlt`
- [x] `mapsUrl`

### Card: Unsplash Integration

**Labels:** `API`, `Complete`

**Description:**
Destination images are loaded from Unsplash when an access key is available. The app falls back to generated Unsplash Source URLs when no key is stored.

**Checklist:**
- [x] Search query uses `{countryName} travel`.
- [x] Requests landscape images.
- [x] Returns image id, alt text, URL, and photographer credit.
- [x] Errors are caught so the country details still render.

### Card: Local Storage Schema

**Labels:** `Storage`, `Complete`

**Description:**
The app stores user-specific data in browser localStorage.

**Storage Keys:**
- [x] `countryTravelExplorer:favorites`
- [x] `countryTravelExplorer:recentSearches`
- [x] `unsplashAccessKey`

**Notes:**
- [x] Favorites store normalized country objects.
- [x] Recent searches store search strings.
- [x] Storage reads are protected with fallback values.

---

## List: Testing Checklist

### Card: Manual Test - Initial Load

**Labels:** `Testing`

**Checklist:**
- Start the app.
- Confirm country data loads.
- Confirm the first country is selected.
- Confirm results show 12 countries on page 1.
- Confirm no console errors appear.

### Card: Manual Test - Search

**Labels:** `Testing`

**Checklist:**
- Search for `Japan`.
- Confirm Japan appears in results.
- Search for `zzzzzz`.
- Confirm the app shows a no-results or error message.
- Confirm recent search chips update.

### Card: Manual Test - Region Filter

**Labels:** `Testing`

**Checklist:**
- Select each continent filter.
- Confirm results update.
- Confirm page resets to page 1.
- Confirm North America includes North America, Central America, and Caribbean countries.

### Card: Manual Test - Favorites

**Labels:** `Testing`

**Checklist:**
- Save a country from a result card.
- Confirm it appears in Favorites.
- Refresh the browser.
- Confirm the favorite persists.
- Remove the favorite.
- Confirm it no longer appears.

### Card: Manual Test - Compare

**Labels:** `Testing`

**Checklist:**
- Compare `Japan` and `Canada`.
- Confirm both columns display.
- Compare the same country twice.
- Confirm duplicate warning displays.
- Submit with one empty field.
- Confirm validation message displays.

### Card: Manual Test - Responsive Design

**Labels:** `Testing`, `UI`

**Checklist:**
- Test at desktop width.
- Test at tablet width.
- Test at mobile width.
- Confirm controls stack correctly.
- Confirm country cards, detail panel, favorites, and comparison remain readable.

---

## List: Known Limitations

### Card: No Automated Test Suite Yet

**Labels:** `Testing`, `Enhancement`

**Description:**
The project currently relies on manual testing. A future improvement would be to add automated tests for API normalization, storage behavior, and UI event flows.

### Card: Unsplash Key Is Browser-Managed

**Labels:** `API`, `Enhancement`

**Description:**
The Unsplash access key is read from localStorage. This works for a class project/demo, but production apps should avoid exposing API keys directly in browser storage.

### Card: REST Countries API Dependency

**Labels:** `API`

**Description:**
Country data depends on the availability and response shape of the REST Countries API.

### Card: Client-Side Only App

**Labels:** `Enhancement`

**Description:**
The app has no backend, user accounts, server persistence, or deployment-specific configuration.

---

## List: Future Enhancements

### Card: Add Map Links

**Labels:** `Enhancement`

**Description:**
Use the existing normalized `mapsUrl` value to add a button that opens the country in Google Maps.

**Checklist:**
- Add map button to the detail panel.
- Open link in a new tab.
- Hide the button if `mapsUrl` is missing.

### Card: Add Sorting Controls

**Labels:** `Enhancement`

**Description:**
Allow users to sort results by name, population, or area.

**Checklist:**
- Add sort select control.
- Support ascending and descending order.
- Keep pagination behavior consistent after sorting.

### Card: Add Dark Mode

**Labels:** `Enhancement`, `UI`

**Description:**
Add a theme toggle and persist the selected theme in localStorage.

### Card: Add Automated Tests

**Labels:** `Enhancement`, `Testing`

**Description:**
Add test coverage for utility functions, localStorage helpers, API normalization, and major app interactions.

### Card: Improve Accessibility

**Labels:** `Enhancement`, `UI`

**Description:**
Audit keyboard navigation, focus states, color contrast, and screen-reader labels.

---

## List: Submission Notes

### Card: How to Demo the Project

**Labels:** `Documentation`

**Description:**
Recommended demo flow for presenting the project.

**Checklist:**
- Start the app with `npm start`.
- Show the initial country list.
- Search for a country.
- Open country details.
- Save the country as a favorite.
- Click a recent search chip.
- Browse by continent.
- Compare two countries.
- Resize the browser to show responsive behavior.

### Card: Final Project Value

**Labels:** `Documentation`

**Description:**
This project demonstrates modular JavaScript, API integration, async data loading, localStorage persistence, dynamic DOM rendering, responsive CSS, and user-centered interface design.
