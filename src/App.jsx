import { Outlet, Link } from 'react-router-dom';
import { auth, loginWithGoogle, logout } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function App() {
  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
      alert(`Login error: ${e?.code || e?.message || e}`);
    }
  };

  return (
    <div className="app-container layout-row">
      <header className="main-header">
        <div className="columns">
          <div className="col col-left">
            <div className="row">
              <div className="cell" />
              <div className="cell" />
              <div className="cell" />
            </div>

            <div className="row">
              <div className="cell" />
              <div className="cell" />
              <div className="cell" />
            </div>

            <div className="row">
              <div className="cell" />
              <div className="cell header-top-cell">
                {/* 1.1 ส่วนบน: Login / Logout (อยู่ตรงกลางของ cell นี้) */}
                {user ? (
                  <div className="user-display header-top-centered">
                    <img
                      src={user.photoURL}
                      width={28}
                      height={28}
                      alt="User Avatar"
                      style={{ borderRadius: '50%', verticalAlign: 'middle' }}
                    />
                    <button onClick={logout} className="logout-button">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="header-top-centered">
                    <button onClick={handleLogin} className="login-button">
                      Login with Google
                    </button>
                  </div>
                )}
              </div>
              <div className="cell" />
            </div>
          </div>

          <div className="col col-right">
            <div className="row">
              <div className="cell" />
              <div className="cell" />
              <div className="cell logo-cell">
                {/* columns2 row1: logo ชิดขวา */}
                <div className="logo-right">
                  <h1 className="mustode-logo">MUSTODE</h1>
                  <h1 className="mustode-shop">SHOP</h1>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="cell nav-cell" />
              <div className="cell nav-cell">
                {/* columns2 row2: nav (เรียงแนว row จากซ้ายไปขวา) */}
                <nav className="main-nav">
                  <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/sell">Sell</Link></li>
                    <li><Link to="/account">My Account</Link></li>
                  </ul>
                </nav>
              </div>
              <div className="cell nav-cell" />
            </div>

            <div className="row">
              <div className="cell" />
              <div className="cell icons-cell">
                {/* columns2 row3: icons (row, เว้นห่าง) */}
                <div className="action-icons header-icons">
                  <span className="icon-cart">🛒</span>
                  <span className="icon-heart">🤍</span>
                  <span className="icon-search">🔍</span>
                </div>
              </div>
              <div className="cell" />
            </div>
          </div>

          {/* vertical divider full viewport height */}
          <div className="divider" />
        </div>
      </header>

      <Outlet />
    </div>
  );
}