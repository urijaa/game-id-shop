// src/pages/admin/AdminLayout.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from 'react-router-dom';
import { logout } from '../../firebase';

export default function AdminLayout() {
  // รับ context จาก App: { isAdmin, checking, user }
  const parentCtx = useOutletContext() || {};
  const { isAdmin, checking, user } = parentCtx;
  const navigate = useNavigate();
  const skipRedirectRef = useRef(false);

  // ถ้าเช็คเสร็จแล้วและไม่ใช่ admin ให้ redirect ไป /user
  // แต่ข้ามการ redirect ถ้าเรากำลังทำ logout (skipRedirectRef)
  useEffect(() => {
    if (skipRedirectRef.current) return;
    if (checking) return;
    if (!isAdmin) navigate('/user', { replace: true });
  }, [checking, isAdmin, navigate]);

  // ป้องกันการคลิกแล้วไม่ redirect — ทำจริงๆ แล้ว navigate และมี fallback
  const handleLogout = useCallback(async () => {
    console.log('AdminLayout: logout clicked');
    // บอก effect ว่าเรากำลัง logout — ข้าม redirect ไป /user
    skipRedirectRef.current = true;
    try {
      await logout();
      console.log('AdminLayout: logout success');
    } catch (e) {
      console.error('AdminLayout: logout error', e);
    }

    try {
      navigate('/login', { replace: true });
      console.log('AdminLayout: navigate to /login');
    } catch (e) {
      console.warn('AdminLayout: navigate failed, using location.href fallback', e);
      window.location.href = '/login';
    } finally {
      // ให้เวลา router/auth อัพเดตก่อนล้าง flag (ไม่จำเป็นแต่ปลอดภัย)
      setTimeout(() => { skipRedirectRef.current = false; }, 1000);
    }
  }, [navigate]);

  if (checking) return <div style={{ padding: 24 }}>Checking permissions…</div>;

  return (
    <div className="admin-page">
      <header className="header">
        <div className="header-top">
          {user ? (
            <div className="user-chip" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <img src={user.photoURL} alt="avatar" width={28} height={28} style={{ borderRadius: '50%' }} />
              <button
                className="logout-btn"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
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
