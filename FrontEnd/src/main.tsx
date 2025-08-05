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
import Index from './pages/admin/Index/Index';
import AdminLayout from './pages/admin/AdminLayout';
import IndexDetails from './pages/admin/Index/IndexDetails';
import Login from './pages/admin/Login/Login';

library.add(fas, far, fab);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <DBProvider>
                <UserProfileProvider>
                    <Routes>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Index />}/>
                            <Route path=":TableName" element={<IndexDetails />}></Route>
                        </Route>
                        <Route path='admin/login' element={<Login />}>
                        
                        </Route>
                    </Routes>
                </UserProfileProvider>
            </DBProvider>
        </BrowserRouter>
    </React.StrictMode>
)
