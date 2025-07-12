import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter, Routes, Route } from "react-router";

import { DBProvider } from './contexts/DBContext';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import Index from './pages/Index';

library.add(fas, far, fab);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <DBProvider>
                <Routes>
                    <Route path="/" element={<Index />} />
                </Routes>
            </DBProvider>
        </BrowserRouter>
    </React.StrictMode>
)
