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
import UserLayout from './pages/user/UserLayout.jsx';
import UserHome from './pages/user/UserHome.jsx';
import UserProduct from './pages/user/UserProduct.jsx';
import UserContact from './pages/user/UserContact.jsx';
import Payment from './pages/user/Payment.jsx';
import CompletePayment from './pages/user/CompletePayment.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import AdminHistoryDetail from './pages/admin/AdminHistoryDetail.jsx';

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
          { index: true, element: <UserHome /> },           // /user
          { path: 'products/:id', element: <UserProduct /> },      // ✅ /user/products
          { path: 'product/:id', element: <UserProduct /> },// /user/product/:id
          { path: 'contact', element: <UserContact /> },    // /user/contact
          { path: 'payment', element: <Payment /> },
          { path: 'complete', element: <UserProduct /> },
          
          // (ออปชัน) เผื่อเผลอใช้ตัวใหญ่ /Products ให้ redirect มาที่ตัวเล็ก
          { path: 'Products', element: <Navigate to="products" replace /> },
        ],
      },

      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminHome /> },
          { path: 'add', element: <AdminAddEdit /> },
          { path: 'history', element: <AdminHistory /> },
          { path: 'history/:id', element: <AdminHistoryDetail /> },
        ],
      },

      // 404
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>
);
