import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter, Routes, Route } from "react-router";

import { DBProvider } from './contexts/DBContext';
import { UserProfileProvider } from './contexts/UserProfileContext';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import AdminRouter from './pages/admin/AdminRouter';
import Reserve from './pages/Reserve/Reserve';
import Index from './pages/Home/Index';
import View from './pages/View/View';

library.add(fas, far, fab);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <FluentProvider theme={webLightTheme}>
                <DBProvider>
                    <UserProfileProvider>
                        <Routes>
                            <Route path="/admin/*" element={<AdminRouter></AdminRouter>}></Route>
                            <Route index element={<Index></Index>}></Route>
                            <Route path='/Reserve' element={<Reserve></Reserve>}></Route>
                            <Route path='/View' element={<View></View>}></Route>
                        </Routes>
                    </UserProfileProvider>
                </DBProvider>
            </FluentProvider>
        </BrowserRouter>
    </React.StrictMode>
)
