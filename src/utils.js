export function createElement(type, props = {}, children = []) {
    const element = document.createElement(type);
    const deferredProps = {};

    Object.entries(props).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        }
        else if (key === 'value' || key === 'checked' || key === 'selected') {
            deferredProps[key] = value;
        }
        else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        }
        else if (key.includes('-')) {
            element.setAttribute(key, value);
        }
        else {
            element[key] = value;
        }
    });

    children.forEach(child => {
        if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(child));
        }
        else if (child) {
            element.appendChild(child);
        }
    });

    Object.entries(deferredProps).forEach(([key, value]) => {
        element[key] = value;
    });

    return element;
}

export function formatNumber(value) {
    if (!value && value !== 0) return 'Unknown';
    return new Intl.NumberFormat().format(value);
}

export function listValues(value) {
    if (!value) return 'Unknown';
    if (Array.isArray(value)) return value.join(', ');
    return Object.values(value).join(', ');
}
