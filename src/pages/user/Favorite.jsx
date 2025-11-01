// src/pages/user/Favorite.jsx (ไฟล์ใหม่)

import React from 'react';

// ----- 1. ข้อมูลจำลอง (Mock Data) -----
const mockFavItems = [
  {
    id: 1,
    title: 'ไอดี AFK Journey (Global) - 120,000+ Diamonds + สุ่มตัวละคร 6 ดาว 20 ตัวขึ้นไป',
    price: 550,
    inStock: true,
    image: 'https://via.placeholder.com/90x90.png?text=AFK+Item+1' 
  },
  {
    id: 2,
    title: 'ไอดี AFK Journey (Global) - 120,000+ Diamonds + สุ่มตัวละคร 6 ดาว 20 ตัวขึ้นไป',
    price: 550,
    inStock: true,
    image: 'https://via.placeholder.com/90x90.png?text=AFK+Item+2' 
  }
];

// ----- 2. ส่วนของ CSS (รวมไว้ในไฟล์เดียว) -----
const favoriteStyles = `
  .favorite-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 25;
  }

  .favorite-drawer {
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
    .favorite-drawer {
      width: 100%;
    }
  }

  /* --- Header (เหมือน Cart) --- */
  .favorite-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
  }
  .favorite-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    flex-grow: 1;
  }
  .favorite-close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  .favorite-back-btn {
    position: absolute;
    left: 20px;
  }

  /* --- Body (รายการสินค้า) --- */
  .favorite-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .fav-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    position: relative;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #eee;
  }
  .fav-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .fav-item-image {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #eee;
  }
  .fav-item-details {
    flex-grow: 1;
  }
  .fav-item-title {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 12px 0;
    line-height: 1.4;
  }
  .fav-item-footer {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .fav-item-price {
    font-size: 1rem;
    font-weight: 700;
    color: #000;
  }
  .fav-item-stock {
    font-size: 0.9rem;
    font-weight: 600;
    color: #2ecc71; /* สีเขียว */
  }
  .fav-item-add-cart {
    margin-left: auto; /* ดันไปทางขวา */
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    text-decoration: underline;
    cursor: pointer;
  }
  .fav-item-add-cart:hover {
    color: #007bff;
  }

  /* ปุ่มลบ (X) */
  .fav-remove-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    color: #888;
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }
`;

// ----- 3. คอมโพเนนต์สำหรับใส่ CSS -----
function FavoriteStyles() {
  return <style>{favoriteStyles}</style>;
}

// ----- 4. คอมโพเนนต์หลักของ Favorite -----
export default function Favorite({ onClose }) {
  const items = mockFavItems;

  return (
    <>
      <FavoriteStyles />
      {/* 1. พื้นหลังสีทึบ (คลิกเพื่อปิด) */}
      <div className="favorite-backdrop" onClick={onClose}></div>

      {/* 2. ตัว Pop-up */}
      <div className="favorite-drawer">
        
        {/* --- Header --- */}
        <header className="favorite-header">
          {/* (วงสีม่วง) ปุ่มลูกศรย้อนกลับ */}
          <button onClick={onClose} className="favorite-close-btn favorite-back-btn">
            &larr;
          </button>
          <h2>Favorites</h2>
        </header>

        {/* --- Body (รายการสินค้า) --- */}
        <div className="favorite-body">
          {items.map((item) => (
            <div className="fav-item" key={item.id}>
              <img src={item.image} alt={item.title} className="fav-item-image" />
              
              <div className="fav-item-details">
                <p className="fav-item-title">{item.title}</p>
                <div className="fav-item-footer">
                  <span className="fav-item-price">{item.price} Baht</span>
                  <span className="fav-item-stock">
                    {item.inStock ? "-In Stock" : "-Out of Stock"}
                  </span>
                  <a className="fav-item-add-cart">Add to Cart</a>
                </div>
              </div>
              
              <button className="fav-remove-btn">&times;</button>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}