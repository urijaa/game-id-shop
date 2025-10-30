import React from 'react';
import ListingCard from '../../components/ListingCard';

// **เปลี่ยนเป็น URL รูปภาพ Hero Banner ที่ใช้งานได้จริงของคุณ**
// ผมใช้ Placeholder URL ชั่วคราวเพื่อให้รูปภาพขึ้น
const HERO_IMAGE_URL = 'https://via.placeholder.com/1200x220/cccccc/000000?text=Your+Banner+Image+Here'; 
// หรือใช้ URL จาก Admin ที่ขึ้นแล้ว: 
// const HERO_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/mustode-test.appspot.com/o/cover.jpg?alt=media&token=1801c80c-e2f7-41a4-9e32-a540134f0d7e'; // ถ้า URL นี้ใช้งานได้จริงในเบราว์เซอร์

export default function UserHome() {
  const mockListings = Array.from({ length: 6 }).map((_, i) => ({
    id: `mock-${i + 1}`,
    title: `Sample Item ${i + 1}`,
    game: i % 2 === 0 ? 'GTA' : 'Valorant',
    price: (i + 1) * 199,
    images: [
      `https://via.placeholder.com/320x240.png?text=Item+${i + 1}`
    ],
    ownerUid: 'mockowner'
  }));

  return (
    <main className="page container">
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

        <div
          className="listings-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16
          }}
        >
          {mockListings.map((item) => (
            <div key={item.id}>
              <ListingCard item={item} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', color: '#666' }}>
          <small>UI mock — buttons and links are intentionally not wired yet.</small>
        </div>
      </section>
    </main>
  );
}