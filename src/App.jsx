import { Outlet, Link } from 'react-router-dom';
import { auth, db, loginWithGoogle, logout } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!user) { alive && setIsAdmin(false); return; }
        const snap = await getDoc(doc(db, 'admins', user.uid));
        alive && setIsAdmin(snap.exists());
      } catch (e) {
        console.error('check admin error', e);
        alive && setIsAdmin(false);
      } finally {
        alive && setChecking(false);
      }
    })();
    return () => { alive = false; };
  }, [user]);

  const onLogin = async () => {
    try { await loginWithGoogle(); }
    catch (e) { alert(`Login error: ${e?.code || e?.message || e}`); }
  };

  return (
    <div>
      <header className="header">
        {/* แถวบน: login / logout */}
        <div className="header-top">
          {user ? (
            <div className="user-chip">
              <img src={user.photoURL} alt="" />
              <button className="logout-btn" onClick={logout}>logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={onLogin}>sign in/sing up</button>
          )}
        </div>

        {/* โลโก้ – เมนู – ไอคอน */}
        <div className="header-main">
          <div className="brand">
            <h1 className="mustode">MUSTODE</h1>
            <h1 className="shop">SHOP</h1>
          </div>

          <nav className="nav">
            <ul>
              <li><Link to="/admin">home</Link></li>
              <li><Link to="/admin/add">Add/Edit</Link></li>
              <li><Link to="/admin/history">history</Link></li>
            </ul>
          </nav>

          <div className="icons" aria-hidden>
            <span>🛒</span>
            <span>🤍</span>
            <span>🔍</span>
          </div>
        </div>
      </header>

      {/* ส่งสถานะแอดมินให้เพจลูก */}
      <Outlet context={{ isAdmin, checking }} />
    </div>
  );
}
