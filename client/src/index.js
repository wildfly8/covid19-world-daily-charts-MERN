import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './polyfills';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { MyContextProvider } from './MyContext';

/* global document */
/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(<MyContextProvider><App /></MyContextProvider>, document.getElementById('root'));
registerServiceWorker();
