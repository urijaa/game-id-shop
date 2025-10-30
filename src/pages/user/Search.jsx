// src/pages/user/Search.jsx (ไฟล์ใหม่)

import React, { useEffect, useRef } from 'react';

// ----- 1. ส่วนของ CSS (รวมไว้ในไฟล์เดียว) -----
const searchStyles = `
  .search-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6); /* ทึบกว่าเดิม */
    z-index: 80; /* อยู่บนสุด */
  }

  .search-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    z-index: 90;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 24px;
    
    /* Animation เด้งลงมา */
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .search-container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .search-input-wrapper {
    position: relative;
    flex-grow: 1;
  }

  .search-input {
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 12px 40px 12px 0; /* เว้นที่ให้ไอคอน */
    font-size: 1.5rem;
    color: #333;
  }
  .search-input::placeholder {
    color: #aaa;
  }
  .search-input:focus {
    outline: none;
    border-bottom-color: #333;
  }

  /* ไอคอนแว่นขยายในช่องค้นหา */
  .search-icon-svg {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    color: #aaa;
  }

  /* (วงสีม่วง) ปุ่มปิด X */
  .search-close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: #888;
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }
`;

// ----- 2. คอมโพเนนต์สำหรับใส่ CSS -----
function SearchStyles() {
  return <style>{searchStyles}</style>;
}

// ----- 3. ไอคอนแว่นขยาย (SVG) -----
function SearchIcon() {
  return (
    <svg 
      className="search-icon-svg" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      ></path>
    </svg>
  );
}

// ----- 4. คอมโพเนนต์หลักของ Search -----
export default function Search({ onClose }) {
  const inputRef = useRef(null);

  // ทำให้ cursor focus ที่ช่องค้นหาทันทีที่เปิด
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <SearchStyles />
      {/* 1. พื้นหลังสีทึบ (คลิกเพื่อปิด) */}
      <div className="search-backdrop" onClick={onClose}></div>

      {/* 2. ตัว Modal ค้นหา */}
      <div className="search-modal">
        <div className="search-container">
          
          {/* --- ช่องค้นหา --- */}
          <div className="search-input-wrapper">
            <input 
              ref={inputRef}
              type="text" 
              className="search-input" 
              placeholder="Im looking for....." 
            />
            <SearchIcon />
          </div>

          {/* (วงสีม่วง) ปุ่มปิด X */}
          <button className="search-close-btn" onClick={onClose}>
            &times;
          </button>
          
        </div>
      </div>
    </>
  );
}