// src/pages/admin/AdminHistory.jsx
import { useEffect, useMemo, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom'; // 👈 เพิ่ม Link
import { alertSuccess, alertError, alertConfirm } from '../../lib/alert.js';

function tsToMs(v) {
  if (v?.seconds) return v.seconds * 1000;
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t;
}

export default function AdminHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const col = collection(db, 'listings');
    const q1 = query(col, where('status', '==', 'sold'), orderBy('soldAt', 'desc'));
    const q2 = query(col, where('status', '==', 'sold'));
    const q3 = query(col);
    const qs = [q1, q2, q3];
    let unsub = () => {};
    const trySub = (i = 0) => {
      if (i >= qs.length) { setLoading(false); return; }
      unsub = onSnapshot(qs[i],
        (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setRows(data); setLoading(false);
        },
        () => trySub(i + 1)
      );
    };
    trySub(0);
    return () => unsub();
  }, []);

  const soldItems = useMemo(() => (
    rows
      .filter(r => String(r?.status ?? '').toLowerCase() === 'sold')
      .sort((a, b) => tsToMs(b?.soldAt) - tsToMs(a?.soldAt))
  ), [rows]);

  return (
    <div className="admin-page">
      <div style={{ background:'#fff', borderRadius:12, padding:20 }}>
        <h2>History of Payment</h2>
        {loading ? <p>Loading…</p> : (
          soldItems.length === 0 ? <p style={{color:'#666'}}>ยังไม่มีข้อมูลการขาย</p> : (
            <div className="history-list" style={{ display:'grid', gap:12 }}>
              {soldItems.map((it) => {
                const img = (Array.isArray(it.images) && it.images[0]) || it.image;
                const soldAtStr = it?.soldAt?.seconds
                  ? new Date(it.soldAt.seconds * 1000).toLocaleString()
                  : (it?.soldAt ? new Date(it.soldAt).toLocaleString() : '-');

                return (
                  <Link
                    key={it.id}
                    to={`/admin/history/${it.id}`}                 // ✅ นำทางด้วย Link
                    style={{
                      display:'grid',
                      gridTemplateColumns:'80px 1fr auto',
                      gap:16, alignItems:'center',
                      background:'#fafafa', padding:12,
                      borderRadius:10, border:'1px solid #eee',
                      textDecoration:'none', color:'inherit'
                    }}
                  >
                    <img
                      src={img || 'https://via.placeholder.com/80?text=No+Image'}
                      alt=""
                      style={{ width:80, height:80, objectFit:'cover', borderRadius:8 }}
                    />
                    <div>
                      <div style={{ fontWeight:700 }}>{it.title || 'Untitled'}</div>
                      <div style={{ color:'#666', fontSize:13 }}>
                        ราคา: ฿{Number(it.price || 0).toLocaleString()} • ขายเมื่อ: {soldAtStr}
                      </div>
                      <div style={{ color:'#666', fontSize:13 }}>
                        ผู้ซื้อ: {it.buyerName || it.buyerUid || '-'} • ช่องทาง: {it.paymentMethod || '-'} • อ้างอิง: {it.paymentRef || '-'}
                      </div>
                    </div>
                    <div>

                    </div>
                  </Link>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
