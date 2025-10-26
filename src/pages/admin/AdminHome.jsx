import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const { isAdmin, checking } = useOutletContext() || {};
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(rows);
    });
    return () => unsub();
  }, []);

  const onDelete = async (id) => {
    if (!isAdmin) return alert('เฉพาะแอดมินเท่านั้น');
    if (!confirm('ลบรายการนี้?')) return;
    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (e) {
      console.error(e);
      alert('ลบไม่สำเร็จ');
    }
  };

  if (checking) return null;

  return (
    <div className="admin-content">
      <div className="hero">
        <div className="hero-inner">
          <h2>Buy Game Accounts at Affordable Prices</h2>
          <p>Pay and receive your items instantly, with a warranty on every account</p>
        </div>
      </div>

      <div className="admin-list">
        {items.map((it) => (
          <div key={it.id} className="admin-row">
            <div className="admin-row-left">
              <img
                className="admin-thumb"
                src={(it.images && it.images[0]) || 'https://via.placeholder.com/150?text=No+Image'}
                alt=""
              />
              <div className="admin-row-text">
                <div className="admin-id">ID GAME: {it.title || '-'}</div>
                <div className="meta">{it.desc || ''}</div>
              </div>
            </div>
            <div className="admin-divider" />
            <div className="admin-actions">
              {isAdmin ? (
                <>
                  <button className="icon-btn" title="ลบ" onClick={() => onDelete(it.id)}>🗑️</button>
                  <button
                    className="icon-btn"
                    title="แก้ไข"
                    onClick={() => navigate(`/admin/add?id=${it.id}`)}
                  >
                    ✏️
                  </button>
                </>
              ) : (
                <span style={{ color: '#999' }}>เฉพาะแอดมิน</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
