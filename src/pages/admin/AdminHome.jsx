// src/pages/admin/AdminHome.jsx
import { useEffect, useMemo, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  where,
} from 'firebase/firestore';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const { isAdmin, checking } = useOutletContext() || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const col = collection(db, 'listings');

    // พยายาม subscribe แบบมีตัวกรองก่อน (active เท่านั้น)
    const q1 = query(col, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    const q2 = query(col, where('status', '==', 'active')); // สำรองถ้า q1 ขอ index
    const q3 = query(col, orderBy('createdAt', 'desc'));    // สำรองสุด (ดึงทั้งหมดแล้วไปกรองฝั่ง UI)
    const q4 = query(col);                                  // สำรองสุดท้าย

    const qs = [q1, q2, q3, q4];
    let unsub = () => {};
    const trySub = (i = 0) => {
      if (i >= qs.length) { setLoading(false); return; }
      unsub = onSnapshot(
        qs[i],
        (snap) => {
          const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setItems(rows);
          setLoading(false);
        },
        // ถ้าพัง (เช่นยังไม่มี index) ลองตัวเลือกถัดไปอัตโนมัติ
        () => trySub(i + 1)
      );
    };

    trySub(0);
    return () => unsub();
  }, []);

  // กันพลาดอีกชั้น: ถ้าไปใช้ q3/q4 จะมีของ sold ปะปน — กรองออกที่ UI
  const visibleItems = useMemo(
    () => items.filter(it => (it?.status || 'active') !== 'sold'),
    [items]
  );

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

      {loading ? (
        <div style={{ padding: 20 }}>Loading…</div>
      ) : (
        <div className="admin-list">
          {visibleItems.map((it) => (
            <div key={it.id} className="admin-row">
              <div className="admin-row-left">
                <img
                  className="admin-thumb"
                  src={(Array.isArray(it.images) && it.images[0]) || it.image || 'https://via.placeholder.com/150?text=No+Image'}
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
      )}
    </div>
  );
}
