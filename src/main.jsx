import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';


import './App.css';

import Home from './pages/Home.jsx';
import Sell from './pages/Sell.jsx';
import Account from './pages/Account.jsx';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: 'sell', element: <Sell /> },
            { path: 'account', element: <Account /> },
        ],
    },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);