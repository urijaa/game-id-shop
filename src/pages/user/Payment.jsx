// src/pages/user/Payment.jsx (ไฟล์ใหม่)

import React from 'react';
// (ถ้าจำเป็นต้องใช้) import { Link } from 'react-router-dom';

// ----- 1. ข้อมูลจำลอง (Mock Data) -----
const mockItem = {
  id: 1,
  title: 'ไอดี AFK Journey (Global) - 120,000+ Diamonds + สุ่มตัวละคร 6 ดาว 20 ตัวขึ้นไป',
  price: 550,
  quantity: 1,
  image: 'https://via.placeholder.com/90x90.png?text=AFK+Item' 
};
const qrCodeImage = 'https://via.placeholder.com/200x200.png?text=QR+Code';

// ----- 2. ส่วนของ CSS (รวมไว้ในไฟล์เดียว) -----
const paymentStyles = `
  .payment-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6); /* ทึบกว่าเดิมเล็กน้อย */
    z-index: 40; /* อยู่หลัง Modal */
  }

  .payment-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px; /* กว้างกว่าตะกร้า */
    max-height: 90vh;
    background-color: #ffffff;
    z-index: 50; /* อยู่บนสุด */
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
  }

  /* --- Header --- */
  .payment-header {
    display: flex;
    justify-content: flex-end;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
  }
  /* (วงสีน้ำเงิน) ปุ่ม Back */
  .payment-back-btn {
    background: none;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #555;
    cursor: pointer;
  }
  .payment-back-btn:hover { background-color: #f5f5f5; }

  /* --- Body (Scroll ได้) --- */
  .payment-body {
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  hr.payment-divider {
    border: none;
    border-top: 1px solid #eee;
    margin: 0;
  }

  /* --- Item Summary --- */
  .payment-item-summary {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .payment-item-image {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
  }
  .payment-item-details { flex-grow: 1; }
  .payment-item-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 12px 0;
  }
  /* ซ่อนตัวเลือกจำนวน แต่ใช้ layout เดิม */
  .quantity-selector-static {
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 0.9rem;
  }
  .payment-item-price {
    font-size: 1.1rem;
    font-weight: 700;
    text-align: right;
  }

  /* --- Promo Code --- */
  .promo-section {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .promo-section label {
    font-size: 1rem;
    font-weight: 600;
    flex-basis: 150px;
  }
  .promo-input {
    flex-grow: 1;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  .promo-apply-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    background-color: #e0e0e0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .promo-apply-btn:hover { background-color: #d0d0d0; }

  /* --- Total --- */
  .total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .total-label { font-size: 1.3rem; font-weight: 700; }
  .total-price { font-size: 1.3rem; font-weight: 700; }

  /* --- Checkout --- */
  .checkout-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .checkout-option {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
  }
  
  /* PromptPay Column */
  .promptpay-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .radio-select {
    width: 20px;
    height: 20px;
    border: 2px solid #555;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
  .radio-select-inner {
    width: 12px;
    height: 12px;
    background-color: #555;
    border-radius: 50%;
  }
  .promptpay-header label { font-weight: 700; }
  .qr-code-img {
    width: 100%;
    max-width: 200px;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  .promptpay-note {
    font-size: 0.8rem;
    color: #e74c3c;
    text-align: center;
    margin-top: 12px;
  }

  /* Upload Column */
  .upload-option { display: flex; flex-direction: column; gap: 16px; }
  .upload-label { font-weight: 600; }
  .upload-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
  }
  .upload-button:hover { border-color: #888; }
  .upload-icon { font-size: 2rem; }
  .upload-button span { font-weight: 600; }
  
  /* (วงสีม่วง) ปุ่ม Confirm */
  .confirm-btn {
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    color: #333;
    background-color: #b8d9aa;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .confirm-btn:hover { background-color: #a8c99a; }
  .upload-note { font-size: 0.8rem; color: #777; }
`;

// ----- 3. คอมโพเนนต์สำหรับใส่ CSS -----
function PaymentStyles() {
  return <style>{paymentStyles}</style>;
}

// ----- 4. คอมโพเนนต์หลักของ Payment -----
export default function Payment({ onClose, onConfirm }) {
  const item = mockItem;

  return (
    <>
      <PaymentStyles />
      {/* 1. พื้นหลังสีทึบ (คลิกเพื่อปิด) */}
      <div className="payment-backdrop" onClick={onClose}></div>

      {/* 2. ตัว Modal */}
      <div className="payment-modal">
        {/* --- Header (ปุ่ม Back) --- */}
        <header className="payment-header">
          {/* (วงสีน้ำเงิน) ปุ่ม Back */}
          <button className="payment-back-btn" onClick={onClose}>Back</button>
        </header>

        {/* --- Body (Scroll ได้) --- */}
        <div className="payment-body">
          
          {/* --- Item Summary --- */}
          <section className="payment-item-summary">
            <img src={item.image} alt={item.title} className="payment-item-image" />
            <div className="payment-item-details">
              <p className="payment-item-title">{item.title}</p>
              <div className="quantity-selector-static">
                <span>{item.quantity}</span>
              </div>
            </div>
            <div className="payment-item-price">{item.price * item.quantity} Baht</div>
          </section>

          <hr className="payment-divider" />

          {/* --- Promo Code --- */}
          <section className="promo-section">
            <label htmlFor="promo-code">Got a promo code?</label>
            <input type="text" id="promo-code" className="promo-input" placeholder="Code" />
            <button className="promo-apply-btn">Apply Code</button>
          </section>

          <hr className="payment-divider" />

          {/* --- Total --- */}
          <section className="total-section">
            <span className="total-label">Total</span>
            <span className="total-price">{item.price} Baht</span>
          </section>

          <hr className="payment-divider" />

          {/* --- Checkout --- */}
          <section className="checkout-section">
            <h2 className="checkout-title">Checkout</h2>
            <div className="checkout-grid">
              
              {/* Column 1: PromptPay */}
              <div className="checkout-option promptpay">
                <div className="promptpay-header">
                  <div className="radio-select">
                    <div className="radio-select-inner"></div>
                  </div>
                  <label htmlFor="promptpay">promptpay</label>
                </div>
                <img src={qrCodeImage} alt="PromptPay QR Code" className="qr-code-img" />
                <p className="promptpay-note">*You can scan this QR code to make a payment.</p>
              </div>
              
              {/* Column 2: Upload */}
              <div className="checkout-option upload-option">
                <span className="upload-label">Upload payment receipt</span>
                
                {/* ปุ่มนี้ควรจะเปิด File Explorer */}
                <label className="upload-button" htmlFor="payment-upload">
                  <span className="upload-icon">&#8679;</span> {/* Upload Icon */}
                  <span>Upload Payment</span>
                </label>
                <input type="file" id="payment-upload" hidden />
                
                {/* (วงสีม่วง) ปุ่ม Confirm */}
                <button className="confirm-btn" onClick={onConfirm}>
                  Confirm
                </button>
                <p className="upload-note">*After completing the payment, kindly upload your payment receipt and confirm your transaction.</p>
              </div>

            </div>
          </section>

        </div> {/* จบ payment-body */}
      </div> {/* จบ payment-modal */}
    </>
  );
}