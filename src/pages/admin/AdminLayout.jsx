// src/pages/admin/AdminLayout.jsx
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logout, auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { alertError } from '../../lib/alert.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  const skipRedirectRef = useRef(false);

  const [roleLoading, setRoleLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ subscribe การเปลี่ยนสถานะ login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (!u) {
        setIsAdmin(false);
        setRoleLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      try {
        // ✅ ตรวจสอบว่า uid นี้อยู่ใน collection "admins"
        const snap = await getDoc(doc(db, 'admins', u.uid));
        setIsAdmin(snap.exists());
      } catch (err) {
        console.error('Check admin role error:', err);
        alertError('ตรวจสอบสิทธิ์ไม่สำเร็จ');
      } finally {
        setRoleLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  // ✅ redirect เฉพาะตอนเช็คเสร็จแล้ว
  useEffect(() => {
    if (skipRedirectRef.current) return;
    if (roleLoading) return; // รอให้โหลดบทบาทก่อน
    if (!isAdmin) navigate('/user', { replace: true });
  }, [roleLoading, isAdmin, navigate]);

  // ✅ logout
  const handleLogout = useCallback(async () => {
    skipRedirectRef.current = true;
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (e) {
      console.error('Logout error', e);
      alertError('ออกจากระบบไม่สำเร็จ');
    } finally {
      setTimeout(() => { skipRedirectRef.current = false; }, 1000);
    }
  }, [navigate]);

  if (roleLoading) return <div style={{ padding: 24 }}>Checking permissions…</div>;

  return (
    <div className="admin-page">
      <header className="header">
        <div className="header-top">
          {user && (
            <div className="user-chip" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <img
                src={user.photoURL || 'https://via.placeholder.com/28'}
                alt="avatar"
                width={28}
                height={28}
                style={{ borderRadius: '50%' }}
              />
              <button className="logout-btn" onClick={handleLogout} type="button">
                Logout
              </button>
            </div>
          )}
        </div>

        <div
          className="header-main"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
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

          <div className="icons" aria-hidden style={{ display: 'flex', gap: 12 }} />
        </div>
      </header>

      <main className="main-content">
        <Outlet context={{ isAdmin, checking: roleLoading, user }} />
      </main>
    </div>
  );
}
