// src/pages/admin/AdminLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from 'react-router-dom';
import { logout } from '../../firebase';

export default function AdminLayout() {
  // รับ context จาก App: { isAdmin, checking, user }
  const parentCtx = useOutletContext() || {};
  const { isAdmin, checking, user } = parentCtx;
  const navigate = useNavigate();

  // ถ้าเช็คเสร็จแล้วและไม่ใช่ admin ให้ redirect ไป /user
  useEffect(() => {
    if (checking) return;
    if (!isAdmin) navigate('/user', { replace: true });
  }, [checking, isAdmin, navigate]);

  if (checking) return <div style={{ padding: 24 }}>Checking permissions…</div>;

  return (
    <div className="admin-page">
      <header className="header">
        <div className="header-top">
          {user ? (
            <div className="user-chip" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <img src={user.photoURL} alt="avatar" width={28} height={28} style={{ borderRadius: '50%' }} />
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : null}
        </div>

        <div className="header-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="brand" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="mustode">MUSTODE</h1>
            <h1 className="shop">SHOP</h1>
          </div>

          <nav className="nav">
            <ul style={{ display: 'flex', gap: 18, listStyle: 'none', margin: 0, padding: 0 }}>
              <li><Link to="/admin">home</Link></li>
              <li><Link to="/admin/add">Add/Edit</Link></li>
              <li><Link to="/admin/history">history</Link></li>
            </ul>
          </nav>

          <div className="icons" aria-hidden style={{ display: 'flex', gap: 12 }}>
            <span>🛒</span>
            <span>🤍</span>
            <span>🔍</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* forward same context ให้ children */}
        <Outlet context={parentCtx} />
      </main>
    </div>
  );
}
