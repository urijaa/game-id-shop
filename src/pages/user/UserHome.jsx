import React, { useEffect, useState } from 'react';
import ListingCard from '../../components/ListingCard';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// **เปลี่ยนเป็น URL รูปภาพ Hero Banner ที่ใช้งานได้จริงของคุณ**
// ผมใช้ Placeholder URL ชั่วคราวเพื่อให้รูปภาพขึ้น
const HERO_IMAGE_URL = 'https://via.placeholder.com/1200x220/cccccc/000000?text=Your+Banner+Image+Here'; 
// หรือใช้ URL จาก Admin ที่ขึ้นแล้ว: 
// const HERO_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/mustode-test.appspot.com/o/cover.jpg?alt=media&token=1801c80c-e2f7-41a4-9e32-a540134f0d7e'; // ถ้า URL นี้ใช้งานได้จริงในเบราว์เซอร์

export default function UserHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ถ้าต้องการกรองเฉพาะสินค้าที่ active ให้เพิ่ม where('status','==','active')
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('listen listings error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <main className="page container" style={{ padding: 24 }}>
      <section 
        className="hero" 
        style={{ 
          marginBottom: '28px',
          borderRadius: '8px',
          overflow: 'hidden', 
          width: '100%',
          position: 'relative', 
          height: '220px' 
        }}
      >
      </section>

      <section className="content">
        <h2 style={{ margin: '8px 0 16px 0' }}>Latest listings</h2>

        {loading ? (
          <div>Loading…</div>
        ) : items.length === 0 ? (
          <div>No listings found.</div>
        ) : (
          <div
            className="listings-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 16
            }}
          >
            {items.map((item) => (
              <div key={item.id}>
                <ListingCard item={item} />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24, textAlign: 'center', color: '#666' }}>
          <small>Data from Firestore collection: listings</small>
        </div>
      </section>
    </main>
  );
}