// src/pages/user/UserHome.jsx
import React, { useEffect, useState, useContext, useMemo } from 'react';
import ListingCard from '../../components/ListingCard';
import ProductQuickView from '../../components/ProductQuickView';
import { CartContext } from '../../contexts/CartContext.jsx';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';

const clampFixStyles = `
  /* กริดรายการ */
  .listings-grid { min-width: 0; }

  /* ให้การ์ดและคอลัมน์ยอมบีบตัวได้ เพื่อให้ ellipsis ทำงาน */
  .listings-grid > * { min-width: 0; }
  .listing-card, .listing-card * { box-sizing: border-box; }

  /* ถ้า ListingCard ของคุณมีคอนเทนเนอร์หลักเป็น .listing-card จะได้ผลทันที
     แต่เพื่อความครอบคลุม เราใส่กฎกว้างๆ ครอบข้อความทั้งหมดในการ์ดด้วย */
  .listings-grid .listing-card h1,
  .listings-grid .listing-card h2,
  .listings-grid .listing-card h3,
  .listings-grid .listing-card p,
  .listings-grid .listing-card span,
  .listings-grid .listing-card .title,
  .listings-grid .listing-card .meta,
  .listings-grid .listing-card .desc {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-word;
  }

  /* กันเคสข้อความเป็นตัวเลขยาวๆ (เช่น lv 1000000...) */
  .listings-grid .listing-card .meta,
  .listings-grid .listing-card .desc {
    color: #666;
  }

  /* ถ้าการ์ดมีฝั่งรูป + ข้อความแบบ flex ให้ข้อความบีบได้ */
  .listings-grid .listing-card .text,
  .listings-grid .listing-card .info {
    min-width: 0;
  }

  /* ปรับรูปให้ไม่ดันเลย์เอาต์ */
  .listings-grid .listing-card img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

export default function UserHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quickItem, setQuickItem] = useState(null);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const col = collection(db, 'listings');

    const q1 = query(col, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    const q2 = query(col, where('status', '==', 'active'));
    const q3 = query(col, orderBy('createdAt', 'desc'));
    const q4 = query(col);

    const qs = [q1, q2, q3, q4];
    let unsub = () => {};

    const trySubscribe = (idx = 0) => {
      if (idx >= qs.length) {
        setLoading(false);
        return;
      }
      unsub = onSnapshot(
        qs[idx],
        (snap) => {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        },
        (err) => {
          console.warn(`query fallback ${idx} -> ${idx + 1}`, err?.code || err);
          trySubscribe(idx + 1);
        }
      );
    };

    trySubscribe(0);
    return () => unsub();
  }, []);

  // กันของ sold ที่อาจติดมาจาก fallback query
  const visibleItems = useMemo(
    () => items.filter((x) => (x?.status || 'active') !== 'sold'),
    [items]
  );

  return (
    <main className="page container" style={{ padding: 24 }}>
      {/* 🔧 ใส่สไตล์แก้ overflow */}
      <style>{clampFixStyles}</style>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h2>Buy Game Accounts at Affordable Prices</h2>
          <p>Pay and receive your items instantly, with a warranty on every account</p>
        </div>
      </section>

      {/* Content */}
      <section className="content">
        <h2 style={{ margin: '8px 0 16px 0' }}>Latest listings</h2>

        {loading ? (
          <div>Loading…</div>
        ) : visibleItems.length === 0 ? (
          <div>No listings found.</div>
        ) : (
          <div
            className="listings-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            {visibleItems.map((item) => (
              <div key={item.id} style={{ minWidth: 0 }}>
                <ListingCard item={item} onOpen={(i) => setQuickItem(i)} />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center', color: '#666' }}>
          <small>Data from Firestore collection: listings</small>
        </div>
      </section>

      {/* Quick View Modal */}
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
    </main>
  );
}
