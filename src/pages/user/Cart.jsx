// src/pages/user/Cart.jsx (ไฟล์แก้ไข)

import React from 'react';
// import { Link } from 'react-router-dom'; // <-- 1. ลบ Link ออก

// ----- 1. ข้อมูลจำลอง (Mock Data) -----
const mockCartItem = {
  id: 1,
  title: 'ไอดี AFK Journey (Global) - 120,000+ Diamonds + สุ่มตัวละคร 6 ดาว 20 ตัวขึ้นไป',
  price: 550,
  quantity: 1,
  image: 'https://via.placeholder.com/90x90.png?text=AFK+Item' 
};

// ----- 2. ส่วนของ CSS (รวมไว้ในไฟล์เดียว) -----
const cartStyles = `
  /* ... (CSS ทั้งหมดเหมือนเดิม) ... */
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
  .cart-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
  }
  .cart-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
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
    margin: 0 0 12px 0;
    line-height: 1.4;
  }
  .cart-item-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .quantity-selector {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 20px;
  }
  .quantity-selector button {
    background: none;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    color: #777;
    cursor: pointer;
    padding: 4px 12px;
  }
  .quantity-selector span {
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0 4px;
  }
  .cart-item-price-each {
    font-size: 0.9rem;
    color: #777;
  }
  .cart-item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
  .cart-item-price-total {
    font-size: 1rem;
    font-weight: 700;
    color: #000;
  }
  .cart-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    background-color: #fff;
    box-shadow: 0 -5px 10px rgba(0,0,0,0.05);
  }
  .cart-divider {
    border: none;
    border-top: 2px solid #f0f0f0;
    margin: -20px 0 20px 0;
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

// ----- 4. คอมโพเนนต์หลักของ Cart -----
// <-- 2. รับ onGoToCheckout เพิ่ม
export default function Cart({ onClose, onGoToCheckout }) { 
  const item = mockCartItem;
  const total = item.price * item.quantity;

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
          <h2>My Cart</h2>
        </header>

        {/* --- Body (รายการสินค้า) --- */}
        <div className="cart-body">
          <div className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />
            
            <div className="cart-item-details">
              <p className="cart-item-title">{item.title}</p>
              <div className="cart-item-controls">
                <div className="quantity-selector">
                  <button>&#8722;</button>
                  <span>{item.quantity}</span>
                  <button>&#43;</button>
                </div>
                <span className="cart-item-price-each">x {item.price} Baht</span>
              </div>
            </div>
            
            <div className="cart-item-right">
              <button className="cart-remove-btn">&times;</button>
              <span className="cart-item-price-total">{item.price * item.quantity} Baht</span>
            </div>
          </div>
          {/* ... สามารถ map() รายการสินค้าอื่นๆ ได้ที่นี่ ... */}
        </div>

        {/* --- Footer (สรุปยอด) --- */}
        <footer className="cart-footer">
          <hr className="cart-divider" />
          <div className="cart-total">
            <span>Total</span>
            <span className="cart-total-price">{total} Baht</span>
          </div>
          
          {/* <-- 3. เปลี่ยนจาก <Link> เป็น <button> และเรียก onGoToCheckout */}
          <button className="cart-checkout-btn" onClick={onGoToCheckout}>
            Go to checkout
          </button>
        </footer>

      </div>
    </>
  );
}