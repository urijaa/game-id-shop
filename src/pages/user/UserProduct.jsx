import React, { useState, useEffect } from 'react'; // <-- เพิ่ม useEffect
import ListingCard from '../../components/ListingCard';
import Slider from 'rc-slider'; // <-- 1. Import Library ที่เพิ่งติดตั้ง
import 'rc-slider/assets/index.css'; // <-- 2. Import CSS ของ Slider (สำคัญมาก!)
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

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
  /* ใช้ grid แบบ responsive: จะได้ 1-3 คอลัมน์ขึ้นกับความกว้างหน้าจอ */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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


// ----- 3. คอมโพเนนต์ Sidebar (อัปเดตให้มี State และ Slider) -----
function ProductSidebar() {
  const [priceRange, setPriceRange] = useState([20, 1000]);

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
        <div className="price-slider-container">
          <Slider
            range
            min={0}
            max={5000}
            value={priceRange}
            onChange={handlePriceChange}
          />
        </div>

        <div className="price-label">
          {priceRange[0]}B - {priceRange[1]}B
        </div>
      </div>
    </div>
  );
}


// ----- 4. คอมโพเนนต์หน้าหลัก (Export default) -----
// เปลี่ยน: เอา mock data ออก และดึงข้อมูลจริงจาก Firestore collection 'listings'
// โดยเรียงตาม createdAt desc (เหมือน AdminHome)
export default function UserProduct() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(rows);
      setLoading(false);
    }, (err) => {
      console.error('listen listings error', err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <UserProductStyles />

      <div className="page-container" style={{ padding: '24px' }}>
        <div className="products-page-layout">
          
          <aside className="products-sidebar">
            <ProductSidebar />
          </aside>

          <main className="products-grid-container">
            <h1 style={{ margin: '0 0 16px 0' }}>All Products</h1>

            {loading ? (
              <div>Loading…</div>
            ) : items.length === 0 ? (
              <div>No products found.</div>
            ) : (
              <div className="products-grid">
                {items.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>
            )}

          </main>

        </div>
      </div>
    </>
  );
}