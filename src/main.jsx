// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import App from './App.jsx';
import './App.css'
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminHome from './pages/admin/AdminHome.jsx';
import AdminAddEdit from './pages/admin/AdminAddEdit.jsx';
import AdminHistory from './pages/admin/AdminHistory.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Header + ส่ง isAdmin ผ่าน <Outlet context={{...}} />
    children: [
      // เข้าหน้าแรกให้เด้งไป /admin
      { index: true, element: <Navigate to="/admin" replace /> },

      {
        path: 'admin',
        element: <AdminLayout />, // layout ของแอดมิน (ต้องมี <Outlet /> ข้างใน)
        children: [
          { index: true, element: <AdminHome /> },        // /admin
          { path: 'add', element: <AdminAddEdit /> },     // /admin/add
          { path: 'history', element: <AdminHistory /> }, // /admin/history
        ],
      },

      // 404
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
