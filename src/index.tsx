/// <reference types="react-dom/experimental"/>
/// <reference types="./react-experimental"/>

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '@/components/App';

// ReactDOM.render(<App />, document.getElementById('app'));
ReactDOM.unstable_createRoot(document.getElementById('app')!).render(<App />);
