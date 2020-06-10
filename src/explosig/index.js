import React from 'react';
import ReactDOM from 'react-dom';
import AppProvider from './AppProvider';
import App from './App.js';

import './index.scss';

ReactDOM.render(
    <AppProvider>
        <App />
    </AppProvider>,
    document.getElementById('root')
);