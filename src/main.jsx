// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import App from './App.jsx';
import './App.css';
import LoginPage from './LoginPage.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminHome from './pages/admin/AdminHome.jsx';
import AdminAddEdit from './pages/admin/AdminAddEdit.jsx';
import AdminHistory from './pages/admin/AdminHistory.jsx';
import UserHome from './pages/user/UserHome.jsx';
import UserProducts from './pages/user/UserProduct.jsx';
import UserContact from './pages/user/UserContact.jsx';
import UserLayout from './pages/user/UserLayout.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },

      // เปลี่ยนเป็น nested user routes (ใช้ UserLayout)
      {
        path: 'user',
        element: <UserLayout />,
        children: [
          { index: true, element: <UserHome /> },             // /user
          { path: 'Products', element: <UserProducts /> },    // /user/Products
          { path: 'Contact', element: <UserContact /> },      // /user/Contact
        ],
      },

      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminHome /> },
          { path: 'add', element: <AdminAddEdit /> },
          { path: 'history', element: <AdminHistory /> },
        ],
      },

      // 404
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
