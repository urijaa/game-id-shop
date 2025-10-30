import React, { useEffect } from 'react';
import { Outlet, useOutletContext, Link, useNavigate } from 'react-router-dom';
import { logout } from '../../firebase';

export default function UserLayout() {
  const parentCtx = useOutletContext() || {}; // { isAdmin, checking, user }
  const { user, checking } = parentCtx;
  const navigate = useNavigate();

  // debug: ดูว่า context มาถึงไหม
  useEffect(() => {
    console.log('UserLayout parentCtx', { user, checking });
  }, [user, checking]);

  // ถ้ายังกำลังเช็กสิทธิ์ ให้แสดง placeholder
  if (checking) return <div style={{ padding: 24 }}>Checking permissions…</div>;

  return (
    <div className="user-page">
      <header className="header user-header" style={{ borderBottom: '1px solid #eee', position: 'relative', zIndex: 20 }}>
        <div className="header-top" style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px' }}>
          {user ? (
            <div className="user-chip" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* ถ้าไม่มี photoURL จะยังเห็นปุ่ม Logout */}
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" width={28} height={28} style={{ borderRadius: '50%' }} />
              ) : null}
              <button className="logout-btn" onClick={() => { logout(); navigate('/login', { replace: true }); }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login"><button className="login-btn">Sign in</button></Link>
            </div>
          )}
        </div>

        <div className="header-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
          <div className="brand">
            <h1 className="mustode" style={{ margin: 0 }}>MUSTODE</h1>
            <h1 className="shop" style={{ margin: 0 }}>SHOP</h1>
          </div>

          <nav className="nav">
            <ul style={{ display: 'flex', gap: 18, listStyle: 'none', margin: 0, padding: 0 }}>
              <li><Link to="/user">Home</Link></li>
              <li><Link to="/user/Products">All Products</Link></li>
              <li><Link to="/user/Contact">Contact Us</Link></li>
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
        <Outlet context={parentCtx} />
      </main>
    </div>
  );
}