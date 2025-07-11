import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { DBProvider } from './contexts/DBContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <DBProvider>
            <App />
        </DBProvider>
    </React.StrictMode>
)
