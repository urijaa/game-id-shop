import React, { useState } from 'react'; // <-- เพิ่ม useState สำหรับเก็บค่า Slider
import ListingCard from '../../components/ListingCard';
import Slider from 'rc-slider'; // <-- 1. Import Library ที่เพิ่งติดตั้ง
import 'rc-slider/assets/index.css'; // <-- 2. Import CSS ของ Slider (สำคัญมาก!)

// ----- 1. ส่วนของ CSS (ใส่ในตัวแปร string) -----
// ผมลบ CSS ของ "price-slider-mock" อันเก่าออกไปแล้ว
const pageStyles = `
  .products-page-layout {
    display: flex;
    gap: 24px;
  }
  .products-sidebar {
    flex-basis: 250px;
    flex-shrink: 0;
  }
  .products-grid-container {
    flex-grow: 1;
  }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .sidebar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .sidebar-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 16px 0;
    font-family: Arial, sans-serif;
    color: #000;
  }
  .sidebar-subtitle {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 16px 0 8px 0;
    text-transform: uppercase;
    color: #333;
  }
  .filter-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .filter-list li { margin-bottom: 8px; }
  .filter-list a {
    text-decoration: none;
    color: #555;
    font-size: 0.95rem;
  }
  .filter-list a:hover { color: #007bff; }

  /* ----- CSS สำหรับ Slider ใหม่ ----- */
  .price-slider-container {
    padding: 10px 8px 0 8px; /* เพิ่ม padding ให้ Slider ไม่ชิดขอบ */
  }

  /* ----- CSS สำหรับตัวเลขราคา ----- */
  .price-label {
    margin-top: 12px;
    color: #555;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
  }
  
  /* ----- ปรับแต่งสีของ rc-slider ให้เป็นสีเทาตามแบบ ----- */
  .rc-slider-track {
    background-color: #555;
  }
  .rc-slider-handle {
    background-color: #555;
    border: 2px solid #555;
    opacity: 1;
  }
  .rc-slider-handle:hover,
  .rc-slider-handle:active,
  .rc-slider-handle-dragging {
    background-color: #333;
    border-color: #333;
    box-shadow: none !important;
  }
`;

// ----- 2. คอมโพเนนต์สำหรับใส่ CSS -----
function UserProductStyles() {
  return <style>{pageStyles}</style>;
}


// ----- 3. ข้อมูลจำลอง (Mock Data) -----
const mockListings = Array.from({ length: 6 }).map((_, i) => ({
  id: `mock-${i + 1}`,
  title: `ID AFK Journey (Global)`,
  game: 'AFK Journey',
  price: 550.00,
  images: [`https://via.placeholder.com/320x240.png?text=AFK+Journey+${i + 1}`],
  ownerUid: 'mockowner'
}));


// ----- 4. คอมโพเนนต์ Sidebar (อัปเดตให้มี State และ Slider) -----
function ProductSidebar() {
  
  // 3. สร้าง State เพื่อเก็บค่ [min, max] ของ Price
  // ค่าเริ่มต้นคือ [20, 1000]
  const [priceRange, setPriceRange] = useState([20, 1000]);

  // 4. สร้างฟังก์ชันสำหรับอัปเดต State เมื่อ Slider ถูกเลื่อน
  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
  };

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Category</h3>
        <h4 className="sidebar-subtitle">ID GAME</h4>
        <ul className="filter-list">
          <li><a href="#">Roblox</a></li>
          <li><a href="#">Xshot</a></li>
        </ul>
        <h4 className="sidebar-subtitle">GIFT CARD</h4>
        <ul className="filter-list">
          <li><a href="#">Stream gift card</a></li>
          <li><a href="#">Robux gift card</a></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Price</h3>
        
        {/* 5. แทนที่ Mock Slider ด้วย Slider ที่ทำงานได้จริง */}
        <div className="price-slider-container">
          <Slider
            range // <-- บอกว่าเป็น Slider แบบ 2 หัว (Range)
            min={0} // <-- ราคาน้อยสุดที่เป็นไปได้
            max={5000} // <-- ราคามากสุดที่เป็นไปได้ (ปรับได้ตามต้องการ)
            value={priceRange} // <-- 6. ใช้ State เป็นค่าปัจจุบัน
            onChange={handlePriceChange} // <-- 7. เรียกฟังก์ชันเมื่อเลื่อน
          />
        </div>

        {/* 8. แสดงตัวเลขจาก State ทำให้มันอัปเดตตาม */}
        <div className="price-label">
          {priceRange[0]}B - {priceRange[1]}B
        </div>

      </div>
    </div>
  );
}


// ----- 5. คอมโพเนนต์หน้าหลัก (Export default) -----
export default function UserProduct() {
  return (
    <>
      {/* เรียกใช้คอมโพเนนต์ CSS ที่นี่ */}
      <UserProductStyles />

      <div className="page-container" style={{ padding: '24px' }}>
        <div className="products-page-layout">
          
          <aside className="products-sidebar">
            <ProductSidebar />
          </aside>

          <main className="products-grid-container">
            <div className="products-grid">
              {mockListings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          </main>

        </div>
      </div>
    </>
  );
}