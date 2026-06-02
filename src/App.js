import { createElement } from './utils.js';
import Counter from './Counter.js';

function App() { 

    const header = createElement(`h1`, { textContent: 'Country Travel Explorer', className: 'heading' });

    const main = createElement(`main`, {}, [Counter()]);

    return createElement(`div`, {}, [header, main]);

}

export default App;