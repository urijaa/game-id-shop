// src/pages/Admin.jsx
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [user] = useAuthState(auth);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'listings'),
      where('ownerUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const markSold = async (id) => {
    // optimistic update UI
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: 'sold' } : it));
    try {
      await updateDoc(doc(db, 'listings', id), { status: 'sold' });
    } catch (e) {
      console.error(e);
      alert('เปลี่ยนสถานะไม่สำเร็จ');
    }
  };

  const remove = async (id) => {
    if (!confirm('ลบสินค้านี้ใช่ไหม?')) return;
    const prev = items;
    setItems(prev.filter(it => it.id !== id));
    try { await deleteDoc(doc(db, 'listings', id)); }
    catch (e) { console.error(e); alert('ลบไม่สำเร็จ'); setItems(prev); }
  };

  if (!user) return <p style={{padding:'16px'}}>กรุณาเข้าสู่ระบบ</p>;

  return (
    <div className="admin">
      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <h2>Buy Game Accounts at Affordable Prices</h2>
          <p>
            An online game account store offering a wide selection of accounts, including Genshin Impact,
            Cookie Run: Kingdom, DRAGON BALL LEGENDS, and Fate/Grand Order at the best prices.
            Pay and receive your items instantly, with a warranty on every account.
          </p>
        </div>
      </div>

      <div className="admin-grid">
        {/* SIDEBAR (mock หมวดหมู่) */}
        <aside className="admin-sidebar">
          <h4>AFK Journey</h4>
          <ul>
            <li>AFK Journey</li>
            <li><b>GIFT CARD</b></li>
          </ul>
        </aside>

        {/* LIST */}
        <section className="admin-list">
          <h3 className="admin-section-title">AFK Journey</h3>

          {items.map(row => (
            <article className="admin-row" key={row.id}>
              <div className="admin-row-left">
                <img
                  src={row.images?.[0] || 'https://via.placeholder.com/240x300?text=No+Image'}
                  alt={row.title}
                  className="admin-thumb"
                />
                <div className="admin-row-text">
                  <div className="admin-id">ID GAME: {row.game || '—'}</div>
                  <div className="admin-title">{row.title || 'Untitled'}</div>
                </div>
              </div>

              <div className="admin-divider" />

              <div className="admin-actions">
                <button className="icon-btn" title="Delete" onClick={() => remove(row.id)}>🗑️</button>
                <Link to={`/edit/${row.id}`} className="icon-btn" title="Edit">✏️</Link>
                {row.status !== 'sold' && (
                  <button className="pill" onClick={() => markSold(row.id)}>Mark Sold</button>
                )}
              </div>
            </article>
          ))}

          {items.length === 0 && (
            <div className="admin-empty">ยังไม่มีสินค้า ลองเพิ่มจากหน้า “Add/Edit”</div>
          )}
        </section>
      </div>
    </div>
  );
}
