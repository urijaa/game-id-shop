// src/pages/admin/AdminHome.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { alertSuccess, alertError, alertConfirm } from '../../lib/alert.js';

export default function AdminHome() {
  const { isAdmin, checking } = useOutletContext() || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const aliveRef = useRef(false);
  const unsubRef = useRef(() => {});

  useEffect(() => {
    aliveRef.current = true;
    const col = collection(db, 'listings');

    // ลองหลาย query (index → fallback)
    const q1 = query(col, where('status', '==', 'active'), orderBy('createdAt', 'desc')); // ต้องมี composite index
    const q2 = query(col, where('status', '==', 'active'));
    const q3 = query(col, orderBy('createdAt', 'desc'));
    const q4 = query(col);

    const qs = [q1, q2, q3, q4];

    const cleanup = () => {
      try { unsubRef.current?.(); } catch {}
      unsubRef.current = () => {};
    };

    const start = (i = 0) => {
      if (!aliveRef.current) return;
      if (i >= qs.length) { setLoading(false); return; }

      cleanup();
      setTimeout(() => {
        if (!aliveRef.current) return;
        try {
          unsubRef.current = onSnapshot(
            qs[i],
            (snap) => {
              if (!aliveRef.current) return;
              const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
              setItems(rows);
              setLoading(false);
            },
            (err) => {
              console.warn('[AdminHome] fallback due to:', err?.message || err);
              start(i + 1);
            }
          );
        } catch (e) {
          console.warn('[AdminHome] snapshot open failed:', e?.message || e);
          start(i + 1);
        }
      }, 30); // ป้องกัน INTERNAL ASSERTION (v12.3.0)
    };

    start(0);
    return () => {
      aliveRef.current = false;
      cleanup();
    };
  }, []);

  // กันพลาด: ถ้าใช้ q3/q4 จะมีของ sold ปะปน — กรองออกที่ UI
  const visibleItems = useMemo(
    () => items.filter(it => (it?.status || '').toLowerCase() !== 'sold'),
    [items]
  );



  const onDelete = async (id) => {
    if (!isAdmin) return alertError('เฉพาะแอดมินเท่านั้น');

    const confirmed = await alertConfirm('ต้องการลบรายการนี้หรือไม่?');
    if (!confirmed) return; // ถ้ากดยกเลิก ก็ออกเลย

    try {
      await deleteDoc(doc(db, 'listings', id));
      alertSuccess('ลบข้อมูลสำเร็จ');
    } catch (e) {
      console.error(e);
      alertError('ลบไม่สำเร็จ');
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
