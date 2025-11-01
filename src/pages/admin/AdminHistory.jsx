import { useEffect, useMemo, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AdminHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const col = collection(db, 'listings');
    const q = query(col, where('status', '==', 'sold'), orderBy('soldAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRows(data);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const soldItems = useMemo(
    () => rows.filter(r => (r?.status || '') === 'sold')
              .sort((a, b) => (b?.soldAt?.seconds || 0) - (a?.soldAt?.seconds || 0)),
    [rows]
  );

  return (
    <div className="admin-page">
      <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
        <h2>History of Payment</h2>
        {loading ? <p>Loading…</p> : (
          soldItems.length === 0 ? <p style={{color:'#666'}}>ยังไม่มีข้อมูลการขาย</p> : (
            <div className="history-list" style={{ display:'grid', gap:12 }}>
              {soldItems.map((it) => {
                const img = (Array.isArray(it.images) && it.images[0]) || it.image;
                const soldAt = it?.soldAt?.seconds
                  ? new Date(it.soldAt.seconds * 1000).toLocaleString()
                  : '-';
                return (
                  <div key={it.id}
                       style={{ display:'grid', gridTemplateColumns:'80px 1fr auto', gap:16, alignItems:'center',
                                background:'#fafafa', padding:12, borderRadius:10, border:'1px solid #eee' }}>
                    <img src={img || 'https://via.placeholder.com/80?text=No+Image'}
                         alt="" style={{ width:80, height:80, objectFit:'cover', borderRadius:8 }}/>
                    <div>
                      <div style={{ fontWeight:700 }}>{it.title || 'Untitled'}</div>
                      <div style={{ color:'#666', fontSize:13 }}>
                        ราคา: ฿{Number(it.price || 0).toLocaleString()} • ขายเมื่อ: {soldAt}
                      </div>
                      <div style={{ color:'#666', fontSize:13 }}>
                        ผู้ซื้อ: {it.buyerName || it.buyerUid || '-'} • ช่องทาง: {it.paymentMethod || '-'} • อ้างอิง: {it.paymentRef || '-'}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => navigate(`/admin/history/${it.id}`)}
                        style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'#fff', cursor:'pointer' }}
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
