// @flow
// react stuff
import * as React from 'react';
import { render } from 'react-dom';

// web3 stuff
import { Web3ReactProvider } from '@web3-react/core';

import Web3 from 'web3';

// =====================
import AppRouting from './routes';

// Stylesheets
// import s from './index.less';
import './less/defaults.less';

const initialState = {};

const getLibrary = function(provider: Object): Object {
    return new Web3(provider);
};

render(
    <Web3ReactProvider getLibrary={getLibrary}>
        <AppRouting />
    </Web3ReactProvider>,
    document.getElementById('app')
);
