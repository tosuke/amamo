/// <reference types="react-dom/experimental"/>
/// <reference types="./react-experimental"/>
import 'sanitize.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/forms.css';
import './theme.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '@/components/App';

ReactDOM.unstable_createRoot(document.getElementById('app')!).render(<App />);
