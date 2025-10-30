// src/pages/user/CompletePayment.jsx (ไฟล์ใหม่)

import React from 'react';

// ----- 1. ข้อมูลจำลอง (Mock Data) -----
const mockItem = {
  id: 1,
  title: 'ไอดี AFK Journey (Global) - 120,000+ Diamonds + สุ่มตัวละคร 6 ดาว 20 ตัวขึ้นไป',
  price: 550,
  quantity: 1,
  image: 'https://via.placeholder.com/90x90.png?text=AFK+Item' 
};

// ข้อมูล Information (จากรูป)
const mockInfo = {
  idGame: 'DonBidleaw555',
  password: 'WanJeib'
};

// ----- 2. ไอคอน Checkmark (SVG) -----
// นี่คือไอคอนสีเขียวพร้อมเครื่องหมายถูก
function CheckmarkIcon() {
  return (
    <svg 
      className="checkmark-svg"
      viewBox="0 0 52 52" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        className="checkmark-circle" 
        cx="26" cy="26" r="25" 
        fill="#A8D580" // สีเขียวอ่อน (ตามรูป)
      />
      <path 
        className="checkmark-check" 
        fill="none" 
        strokeWidth="5"
        stroke="#6E44FF" // สีม่วง (ตามรูป)
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M14.1 27.2l7.1 7.2 16.7-16.8" 
      />
    </svg>
  );
}

// ----- 3. ส่วนของ CSS (รวมไว้ในไฟล์เดียว) -----
const completeStyles = `
  .complete-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 60; /* อยู่หลัง Modal */
  }

  .complete-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 450px; /* Modal นี้แคบกว่า Payment */
    background-color: #ffffff;
    z-index: 70; /* อยู่บนสุด */
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center; /* จัดทุกอย่างกลางจอ */
    padding: 24px;
    font-family: Arial, sans-serif;
  }

  /* --- ไอคอน Checkmark --- */
  .checkmark-svg {
    width: 80px;
    height: 80px;
  }

  .complete-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 16px 0;
  }
  
  hr.complete-divider {
    width: 100%;
    border: none;
    border-top: 1px solid #eee;
    margin: 0 0 16px 0;
  }

  /* --- Item Summary --- */
  .complete-item {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }
  .complete-item-image {
    width: 70px; /* เล็กกว่าเดิม */
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
  }
  .complete-item-title {
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.4;
  }

  /* --- Information Section --- */
  .info-section {
    width: 100%;
    margin-top: 20px;
  }
  .info-section h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 12px 0;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
    margin-bottom: 8px;
  }
  .info-label {
    font-weight: 700;
    color: #333;
  }
  .info-value {
    color: #555;
    font-weight: 600;
  }

  /* --- ปุ่ม Confirm --- */
  .complete-confirm-btn {
    margin-top: 24px;
    width: 100%;
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    color: #333;
    background-color: #b8d9aa; /* สีเขียวอ่อน */
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .complete-confirm-btn:hover {
    background-color: #a8c99a;
  }
`;

// ----- 4. คอมโพเนนต์สำหรับใส่ CSS -----
function CompleteStyles() {
  return <style>{completeStyles}</style>;
}

// ----- 5. คอมโพเนนต์หลักของ CompletePayment -----
export default function CompletePayment({ onClose }) {
  const item = mockItem;
  const info = mockInfo;

  return (
    <>
      <CompleteStyles />
      {/* 1. พื้นหลังสีทึบ (คลิกเพื่อปิด) */}
      <div className="complete-backdrop" onClick={onClose}></div>

      {/* 2. ตัว Modal */}
      <div className="complete-modal">
        
        <CheckmarkIcon />
        
        <h2 className="complete-title">Payment Complete</h2>
        
        <hr className="complete-divider" />
        
        {/* --- Item Summary --- */}
        <section className="complete-item">
          <img src={item.image} alt={item.title} className="complete-item-image" />
          <p className="complete-item-title">{item.title}</p>
        </section>

        {/* --- Information Section --- */}
        <section className="info-section">
          <h3>Information:</h3>
          <div className="info-row">
            <span className="info-label">ID Game</span>
            <span className="info-value">: {info.idGame}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Password</span>
            <span className="info-value">: {info.password}</span>
          </div>
        </section>

        {/* --- ปุ่ม Confirm (กดแล้วปิด Modal) --- */}
        <button className="complete-confirm-btn" onClick={onClose}>
          Confirm
        </button>

      </div>
    </>
  );
}