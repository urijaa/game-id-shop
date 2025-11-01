// src/pages/user/UserLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useOutletContext, Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../firebase';
import Cart from './Cart';
import Payment from './Payment';
import CompletePayment from './CompletePayment';
import Favorite from './Favorite';
import Search from './Search'; 

export default function UserLayout() {
  const parentCtx = useOutletContext() || {};
  const { user, checking } = parentCtx;
  const navigate = useNavigate();
  const location = useLocation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 

  useEffect(() => {
    const s = location.state;
    if (s && s.openCart) {
      setCartItemId(s.itemId || null);
      setIsCartOpen(true);
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) { /* ignore */ }
    }
  }, [location]);

  const closeCart = () => { setIsCartOpen(false); setCartItemId(null); };
  const closePayment = () => setIsPaymentOpen(false);
  const closeComplete = () => setIsCompleteOpen(false);
  const closeFavorite = () => setIsFavoriteOpen(false);
  const closeSearch = () => setIsSearchOpen(false); 

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    navigate('/user');
  };
  
  const handleConfirmPayment = () => {
    setIsPaymentOpen(false);
    setIsCompleteOpen(true);
  };

  if (checking) return <div style={{ padding: 24 }}>Checking permissions…</div>;

  return (
    <div className="user-page" style={{ position: 'relative' }}> 
      <header className="header user-header" style={{ borderBottom: '1px solid #eee', position: 'relative', zIndex: 20 }}>
        <div className="header-top" style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px' }}>
          {user ? (
            <div className="user-chip" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {user.photoURL && (
                <img src={user.photoURL} alt="avatar" width={28} height={28} style={{ borderRadius: '50%' }} />
              )}
              <button
                className="logout-btn"
                onClick={async () => {
                  try {
                    await logout();
                  } catch (e) {
                    console.error('logout error', e);
                  } finally {
                    navigate('/login', { replace: true });
                  }
                }}
              >
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
              <li><Link to="/user/products">All Products</Link></li> {/* ✅ เปลี่ยนเป็น p เล็ก */}
              <li><Link to="/user/contact">Contact Us</Link></li>    {/* ✅ เปลี่ยนเป็น c เล็ก */}
            </ul>
          </nav>

          <div className="icons" aria-hidden style={{ display: 'flex', gap: 12 }}>
            <span onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', fontSize: '1.2rem' }}>🛒</span>
            
            <span onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer', fontSize: '1.2rem' }}>🔍</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet context={parentCtx} />
      </main>

      {/* --- Modal --- */}
      {isCartOpen && <Cart onClose={closeCart} onGoToCheckout={handleGoToCheckout} />}
      {isPaymentOpen && <Payment onClose={closePayment} onConfirm={handleConfirmPayment} />}
      {isCompleteOpen && <CompletePayment onClose={closeComplete} />} 
      {isFavoriteOpen && <Favorite onClose={closeFavorite} />}
      {isSearchOpen && <Search onClose={closeSearch} />}
    </div>
  );
}
