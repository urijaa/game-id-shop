// src/pages/user/UserProduct.jsx
import React, { useState, useEffect, useContext, useMemo } from 'react';
import ListingCard from '../../components/ListingCard';
import ProductQuickView from '../../components/ProductQuickView';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { CartContext } from '../../contexts/CartContext.jsx';

const pageStyles = `
  .products-page-layout { display: flex; gap: 24px; }
  .products-sidebar { flex-basis: 260px; flex-shrink: 0; }
  .products-grid-container { flex-grow: 1; }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .sidebar-wrapper { display: flex; flex-direction: column; gap: 20px; }
  .sidebar-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 8px 0; color: #000; }
  .sidebar-subtitle { font-size: .95rem; font-weight: 700; margin: 10px 0 8px 0; color: #333; }
  .section-box { background:#fff; border:1px solid #eee; border-radius:10px; padding:14px; }
  .filter-list { list-style: none; padding: 0; margin: 0; display:grid; gap:8px; }
  .filter-item { display:flex; align-items:center; gap:8px; }
  .filter-item input { width:16px; height:16px; }
  .filter-actions { display:flex; gap:8px; margin-top:10px; }
  .btn { padding:8px 10px; border-radius:8px; border:1px solid #ddd; background:#fff; cursor:pointer; }
  .btn:hover { background:#f6f6f6; }
  .btn-clear { color:#a00; border-color:#e4caca; }
  .price-slider-container { padding: 6px 4px 0 4px; }
  .price-label { margin-top: 10px; color: #555; font-size: 0.95rem; font-weight: 600; text-align: center; }
  .rc-slider-track { background-color: #555; }
  .rc-slider-handle { background-color: #555; border: 2px solid #555; opacity: 1; }
  .rc-slider-handle:hover, .rc-slider-handle:active, .rc-slider-handle-dragging {
    background-color: #333; border-color: #333; box-shadow: none !important;
  }
`;

function UserProductStyles() {
  return <style>{pageStyles}</style>;
}

/** แยกหมวดหมู่จาก title/category */
function extractTags(item) {
  const tags = [];
  const cat = (item.category || '').trim();
  const title = (item.title || '').toLowerCase();

  if (cat) tags.push(cat);
  if (title.includes('roblox')) tags.push('Roblox');
  if (title.includes('xshot')) tags.push('Xshot');
  if (title.includes('steam')) tags.push('Steam Gift Card');
  if (title.includes('robux')) tags.push('Robux Gift Card');

  return Array.from(new Set(tags));
}

function ProductSidebar({
  dataMin, dataMax, priceRange, onChangePrice,
  idGameFilters, setIdGameFilters,
  giftCardFilters, setGiftCardFilters,
  onClearAll
}) {
  const showSlider = Number.isFinite(dataMin) && Number.isFinite(dataMax) && dataMax > dataMin;

  const toggle = (set, current, name) => {
    const s = new Set(current);
    s.has(name) ? s.delete(name) : s.add(name);
    set(Array.from(s));
  };

  const checked = (arr, name) => arr.includes(name);

  return (
    <div className="sidebar-wrapper">
      {/* Category */}
      <div className="section-box">
        <h3 className="sidebar-title">Category</h3>

        <div>
          <div className="sidebar-subtitle">ID GAME</div>
          <ul className="filter-list">
            <li className="filter-item">
              <input
                type="checkbox"
                checked={checked(idGameFilters, 'Roblox')}
                onChange={() => toggle(setIdGameFilters, idGameFilters, 'Roblox')}
                id="f-roblox"
              />
              <label htmlFor="f-roblox">Roblox</label>
            </li>
            <li className="filter-item">
              <input
                type="checkbox"
                checked={checked(idGameFilters, 'Xshot')}
                onChange={() => toggle(setIdGameFilters, idGameFilters, 'Xshot')}
                id="f-xshot"
              />
              <label htmlFor="f-xshot">Xshot</label>
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="sidebar-subtitle">GIFT CARD</div>
          <ul className="filter-list">
            <li className="filter-item">
              <input
                type="checkbox"
                checked={checked(giftCardFilters, 'Steam Gift Card')}
                onChange={() => toggle(setGiftCardFilters, giftCardFilters, 'Steam Gift Card')}
                id="f-steam"
              />
              <label htmlFor="f-steam">Steam Gift Card</label>
            </li>
            <li className="filter-item">
              <input
                type="checkbox"
                checked={checked(giftCardFilters, 'Robux Gift Card')}
                onChange={() => toggle(setGiftCardFilters, giftCardFilters, 'Robux Gift Card')}
                id="f-robux"
              />
              <label htmlFor="f-robux">Robux Gift Card</label>
            </li>
          </ul>
        </div>

        <div className="filter-actions">
          <button className="btn btn-clear" onClick={onClearAll}>Clear filters</button>
        </div>
      </div>

      {/* Price */}
      <div className="section-box">
        <h3 className="sidebar-title">Price</h3>
        {!showSlider ? (
          <div className="price-label">กำลังโหลดช่วงราคา…</div>
        ) : (
          <>
            <div className="price-slider-container">
              <Slider
                range
                min={dataMin}
                max={dataMax}
                step={10}
                allowCross={false}
                value={priceRange}
                onChange={onChangePrice}
              />
            </div>
            <div className="price-label">
              ฿{priceRange[0].toLocaleString()} - ฿{priceRange[1].toLocaleString()}
            </div>
            <div className="filter-actions">
              <button className="btn" onClick={() => onChangePrice([dataMin, dataMax])}>
                Reset price
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function UserProduct() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickItem, setQuickItem] = useState(null);
  const { addItem } = useContext(CartContext);

  // ดึงสินค้าจาก Firestore
  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // ✅ กรองไม่เอาสินค้าที่ขายแล้ว
        const filtered = rows.filter(
          (it) =>
            !['sold', 'Sold', 'SOLD', true].includes(it.status)
        );
        setItems(filtered);
        setLoading(false);
      },
      (err) => {
        console.error('listen listings error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // คำนวณช่วงราคา
  const { dataMin, dataMax } = useMemo(() => {
    if (!items.length) return { dataMin: 0, dataMax: 0 };
    const prices = items.map((x) => Number(x.price || 0)).filter((n) => Number.isFinite(n));
    return { dataMin: Math.min(...prices), dataMax: Math.max(...prices) };
  }, [items]);

  // ฟิลเตอร์
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [idGameFilters, setIdGameFilters] = useState([]);
  const [giftCardFilters, setGiftCardFilters] = useState([]);

  useEffect(() => {
    if (dataMax > dataMin) setPriceRange([dataMin, dataMax]);
  }, [dataMin, dataMax]);

  const filteredItems = useMemo(() => {
    const [minP, maxP] = priceRange;
    return items.filter((it) => {
      const p = Number(it.price || 0);
      if (!Number.isFinite(p) || p < minP || p > maxP) return false;

      const tags = extractTags(it);
      const idOk = idGameFilters.length ? idGameFilters.some((t) => tags.includes(t)) : true;
      const gcOk = giftCardFilters.length ? giftCardFilters.some((t) => tags.includes(t)) : true;
      return idOk && gcOk;
    });
  }, [items, priceRange, idGameFilters, giftCardFilters]);

  const handleClearAll = () => {
    setIdGameFilters([]);
    setGiftCardFilters([]);
    if (dataMax > dataMin) setPriceRange([dataMin, dataMax]);
  };

  return (
    <>
      <UserProductStyles />
      <div className="page-container" style={{ padding: '24px' }}>
        <div className="products-page-layout">
          <aside className="products-sidebar">
            <ProductSidebar
              dataMin={dataMin}
              dataMax={dataMax}
              priceRange={priceRange}
              onChangePrice={setPriceRange}
              idGameFilters={idGameFilters}
              setIdGameFilters={setIdGameFilters}
              giftCardFilters={giftCardFilters}
              setGiftCardFilters={setGiftCardFilters}
              onClearAll={handleClearAll}
            />
          </aside>

          <main className="products-grid-container">
            <h1 style={{ margin: '0 0 16px 0' }}>All Products</h1>
            {loading ? (
              <div>Loading…</div>
            ) : filteredItems.length === 0 ? (
              <div>ไม่พบสินค้าที่ตรงกับตัวกรอง</div>
            ) : (
              <div className="products-grid">
                {filteredItems.map((item) => (
                  <ListingCard key={item.id} item={item} onOpen={(i) => setQuickItem(i)} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {quickItem && (
        <ProductQuickView
          item={quickItem}
          onClose={() => setQuickItem(null)}
          onAddToCart={(it) => {
            addItem(it);
            setQuickItem(null);
          }}
        />
      )}
    </>
  );
}
