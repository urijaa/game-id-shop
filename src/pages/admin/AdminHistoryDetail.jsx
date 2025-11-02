// src/pages/admin/AdminHistoryDetail.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

function tsToString(v) {
  if (!v) return '-';
  if (v?.seconds) return new Date(v.seconds * 1000).toLocaleString();
  const t = Date.parse(v);
  return Number.isNaN(t) ? '-' : new Date(t).toLocaleString();
}

export default function AdminHistoryDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'listings', id));
        if (mounted) setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (!data) return (
    <div style={{ padding: 20 }}>
      <p>ไม่พบข้อมูลรายการนี้</p>
      <Link to="/admin/history">← กลับประวัติการชำระเงิน</Link>
    </div>
  );

  const img = (Array.isArray(data.images) && data.images[0]) || data.image;

  return (
    <div style={{ background:'#fff', borderRadius:12, padding:20 }}>
      <Link to="/admin/history" style={{ display:'inline-block', marginBottom:12 }}>← กลับ</Link>
      <h2 style={{ marginTop:0 }}>{data.title || 'Untitled'}</h2>

      <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:16 }}>
        <img
          src={img || 'https://via.placeholder.com/160?text=No+Image'}
          alt=""
          style={{ width:160, height:160, objectFit:'cover', borderRadius:10 }}
        />
        <div style={{ display:'grid', gap:6 }}>
          <div><b>รหัส:</b> {data.id}</div>
          <div><b>ราคา:</b> ฿{Number(data.price || 0).toLocaleString()}</div>
          <div><b>สถานะ:</b> {data.status || '-'}</div>
          <div><b>ขายเมื่อ:</b> {tsToString(data.soldAt)}</div>
          <div><b>ผู้ซื้อ:</b> {data.buyerName || data.buyerUid || '-'}</div>
          <div><b>ช่องทางชำระเงิน:</b> {data.paymentMethod || '-'}</div>
          <div><b>อ้างอิงการชำระเงิน:</b> {data.paymentRef || '-'}</div>
          {data.description && <div><b>รายละเอียด:</b> {data.description}</div>}
        </div>
      </div>
    </div>
  );
}
