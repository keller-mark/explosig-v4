import React from 'react';
import ReactDOM from 'react-dom';
import Providers from './Providers';
import App from './App.js';

import './index.scss';

ReactDOM.render(
    <Providers>
        <App />
    </Providers>,
    document.getElementById('root')
);