export function createElement(type, props = {}, children = []) { 
    const element = document.createElement(type);

    Object.entries(props).forEach(([key, value]) => { 
        if (~key.indexOf(`-`)) {
            element.setAttribute(key, value);
        }
        else {
            element[key] = value;
        }
    });

    children.forEach(child => {
        element.appendChild(child);
     });

    return element;
} 