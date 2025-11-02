// src/pages/user/Cart.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext.jsx';
import { alertSuccess, alertError, alertConfirm } from '../../lib/alert.js';

const cartStyles = `
  .cart-backdrop {
    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    background-color: rgba(0, 0, 0, 0.5); z-index: 25;
  }
  .cart-drawer {
    position: fixed; top: 0; right: 0; width: 420px; height: 100vh;
    background-color: #ffffff; z-index: 30;
    box-shadow: -5px 0 15px rgba(0,0,0,0.15);
    display: flex; flex-direction: column; font-family: Arial, sans-serif;
  }
  @media (max-width: 480px) { .cart-drawer { width: 100%; } }

  .cart-header {
    display: flex; align-items: center; padding: 16px 20px; border-bottom: 1px solid #eee;
  }
  .cart-header h2 { margin: 0; font-size: 1.25rem; font-weight: 700; text-align: center; flex-grow: 1; }
  .cart-close-btn { background: none; border: none; font-size: 1.8rem; cursor: pointer; padding: 0; line-height: 1; }
  .cart-back-btn { position: absolute; left: 20px; }

  .cart-body { flex-grow: 1; overflow-y: auto; padding: 20px; }
  .cart-item { display: flex; gap: 16px; align-items: flex-start; }
  .cart-item + .cart-item { margin-top: 16px; }
  .cart-item-image {
    width: 90px; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;
  }
  .cart-item-details { flex-grow: 1; }
  .cart-item-title { font-size: .95rem; font-weight: 600; margin: 0 0 8px 0; line-height: 1.4; }
  .cart-item-price { font-size: 1rem; font-weight: 600; color: #555; margin: 0; }

  .cart-item-right { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
  .cart-remove-btn { background: none; border: none; font-size: 1.4rem; color: #888; cursor: pointer; line-height: 1; padding: 0; }

  .cart-divider { border: none; border-top: 1px solid #eee; margin: 20px 0 0 0; }

  .cart-footer {
    padding: 20px; background-color: #fff; box-shadow: 0 -5px 10px rgba(0,0,0,0.05);
  }
  .cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .cart-total span { font-size: 1.3rem; font-weight: 700; }
  .cart-total-price { font-size: 1.3rem; font-weight: 700; }

  .cart-actions { display:flex; gap:8px; align-items:center; justify-content: space-between; }
  .cart-checkout-btn {
    display: block; flex: 1; padding: 14px; font-size: 1.05rem; font-weight: 700;
    color: #333; background-color: #b8d9aa; border: none; border-radius: 8px; cursor: pointer; text-align: center;
  }
  .cart-checkout-btn:hover { background-color: #a8c99a; }
  .cart-checkout-btn:disabled { opacity:.6; cursor:not-allowed; }

  .cart-empty-btn {
    background:#fff; border:1px solid #eee; border-radius:8px; padding:10px 12px; cursor:pointer; font-weight:600; color:#a00;
  }
  .cart-empty-btn:hover { background:#faf4f4; }
`;

function CartStyles() {
  return <style>{cartStyles}</style>;
}

export default function Cart({ onClose }) {
  const { cart, removeItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((s, it) => s + (Number(it.price || 0) * (it.quantity || 1)), 0);

  const handleCheckout = () => {
    if (!cart.length) return;
    // ส่งรายการไปหน้า payment (Payment.jsx จะอ่านจาก location.state.items)
    navigate('/user/payment', { state: { items: cart } });
    // ปิด drawer ให้ UI ดูลื่นไหล
    if (typeof onClose === 'function') onClose();
    // หมายเหตุ: การล้างตะกร้าจริงจะทำที่ /user/complete (clearCart()) เพื่อกันเคสที่ผู้ใช้ยกเลิกรายการระหว่างชำระเงิน
  };

  return (
    <>
      <CartStyles />
      <div className="cart-backdrop" onClick={onClose}></div>

      <div className="cart-drawer">
        {/* Header */}
        <header className="cart-header">
          <button onClick={onClose} className="cart-close-btn cart-back-btn">&larr;</button>
          <h2>My Cart</h2>
        </header>

        {/* Body */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ padding: 20, color: '#666' }}>Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={(Array.isArray(item.images) && item.images[0]) || item.image || 'https://via.placeholder.com/90x90.png?text=No+Image'}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <p className="cart-item-title">{item.title}</p>
                  <p className="cart-item-price">฿{Number(item.price || 0).toLocaleString()}</p>
                </div>
                <div className="cart-item-right">
                  <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>&times;</button>
                </div>
              </div>
            ))
          )}

          <hr className="cart-divider" />
        </div>

        {/* Footer */}
        <footer className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span className="cart-total-price">฿{total.toLocaleString()}</span>
          </div>

          <div className="cart-actions">
            <button type="button" className="cart-empty-btn" onClick={clearCart} disabled={!cart.length}>
              Empty cart
            </button>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={!cart.length}
            >
              Go to checkout
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
