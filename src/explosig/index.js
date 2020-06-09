import React from 'react';
import ReactDOM from 'react-dom';
import {
    RecoilRoot
  } from 'recoil';
import App from './App.js';

import './index.scss';

ReactDOM.render(
    <RecoilRoot>
        <App />
    </RecoilRoot>,
    document.getElementById('root')
);