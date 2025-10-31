import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext.jsx';

// ----- 1. ข้อมูลจำลอง (Mock Data) -----
// (ลบข้อมูลจำลองออก เนื่องจากใช้ Context แทน)

// ----- 2. ส่วนของ CSS (แก้ไขแล้ว) -----
const cartStyles = `
  /* ... (CSS ส่วน .cart-backdrop, .cart-drawer, .cart-header ไม่เปลี่ยนแปลง) ... */
  .cart-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 25;
  }
  .cart-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 420px;
    height: 100vh;
    background-color: #ffffff;
    z-index: 30;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
  }
  @media (max-width: 480px) {
    .cart-drawer {
      width: 100%;
    }
  }
  .cart-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
  }
  .cart-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    flex-grow: 1;
  }
  .cart-close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .cart-back-btn {
    position: absolute;
    left: 20px;
  }

  /* --- CSS Body (แก้ไขส่วนนี้) --- */
  .cart-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
  }
  .cart-item {
    display: flex;
    gap: 16px;
    align-items: flex-start; /* <--- เปลี่ยนจาก center/flex-start เป็นอันนี้ */
  }
  .cart-item-image {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #eee;
  }
  .cart-item-details {
    flex-grow: 1;
  }
  .cart-item-title {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 8px 0; /* <--- ลด margin-bottom */
    line-height: 1.4;
  }

  /* --- 🌟 1. CSS ที่เพิ่มใหม่สำหรับราคาใต้ชื่อ --- */
  .cart-item-price {
    font-size: 1rem;
    font-weight: 600;
    color: #555;
    margin: 0;
  }

  /* --- 🌟 2. ลบ CSS ที่ไม่ใช้ออก (quantity, item-price-each, item-price-total) --- */

  .cart-item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* <--- เปลี่ยนจาก flex-end เป็น flex-start ให้อยู่บน */
    gap: 12px;
  }
  .cart-remove-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    color: #888;
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }

  /* --- CSS Footer (แก้ไขส่วนนี้) --- */
  .cart-footer {
    padding: 20px;
    /* <--- 🌟 3. ลบ border-top: 1px solid #eee; ออก */
    background-color: #fff;
    box-shadow: 0 -5px 10px rgba(0,0,0,0.05);
  }
  
  /* --- 🌟 4. แก้ไข CSS เส้นคั่น --- */
  .cart-divider {
    border: none;
    border-top: 1px solid #eee; /* <--- เปลี่ยนเป็น 1px #eee */
    margin: 20px 0 0 0; /* <--- เปลี่ยน margin ใหม่ */
  }

  .cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .cart-total span {
    font-size: 1.3rem;
    font-weight: 700;
  }
  .cart-total-price {
    font-size: 1.3rem;
    font-weight: 700;
  }
  .cart-checkout-btn {
    display: block;
    width: 100%;
    padding: 16px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    background-color: #b8d9aa;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
  }
  .cart-checkout-btn:hover {
    background-color: #a8c99a;
  }
`;

// ----- 3. คอมโพเนนต์สำหรับใส่ CSS -----
function CartStyles() {
  return <style>{cartStyles}</style>;
}

// ----- 4. คอมโพเนนต์หลักของ Cart (แก้ไขแล้ว) -----
export default function Cart({ onClose, onGoToCheckout }) {
  const { cart, removeItem } = useContext(CartContext);
  const navigate = useNavigate();

  // total
  const total = cart.reduce((s, it) => s + (Number(it.price || 0) * (it.quantity || 1)), 0);

  return (
    <>
      <CartStyles />
      <div className="cart-backdrop" onClick={onClose}></div>
      <div className="cart-drawer">
        
        {/* --- Header --- */}
        <header className="cart-header">
          <button onClick={onClose} className="cart-close-btn cart-back-btn">
            &larr;
          </button>
          <h2 style={{margin:0,fontSize:'1.25rem',fontWeight:700,flexGrow:1,textAlign:'center'}}>My Cart</h2>
        </header>

        {/* --- Body (รายการสินค้า) (แก้ไขแล้ว) --- */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ padding: 20, color: '#666' }}>Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id} style={{ marginBottom: 16 }}>
                <img src={(Array.isArray(item.images) && item.images[0]) || item.image || 'https://via.placeholder.com/90x90.png?text=No+Image'} alt={item.title} className="cart-item-image" />
                
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

        {/* --- Footer (สรุปยอด) (แก้ไขแล้ว) --- */}
        <footer className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span className="cart-total-price">฿{total.toLocaleString()}</span>
          </div>
          
          <button
            className="cart-checkout-btn"
            onClick={() => {
              // นำ cart ทั้งหมดไปที่หน้า payment (Payment.jsx จะอ่านจาก location.state.items)
              try {
                navigate('/user/payment', { state: { items: cart } });
              } catch {
                // fallback
                window.location.href = '/user/payment';
              }
            }}
          >
            Go to checkout
          </button>
        </footer>
      </div>
    </>
  );
}