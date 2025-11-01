import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminHistoryDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'listings', id));
        if (snap.exists()) setItem({ id: snap.id, ...snap.data() });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (!item) return <div style={{ padding: 20 }}>Not found</div>;

  const img = (Array.isArray(item.images) && item.images[0]) || item.image;
  const soldAt = item?.soldAt?.seconds
    ? new Date(item.soldAt.seconds * 1000).toLocaleString()
    : '-';

  return (
    <div className="admin-page">
      <div style={{ background:'#fff', borderRadius:12, padding:20 }}>
        <h2>Sale Detail</h2>
        <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:24 }}>
          <img src={img || 'https://via.placeholder.com/640x480?text=No+Image'}
               alt="" style={{ width:'100%', borderRadius:12, objectFit:'cover' }} />
          <div>
            <h3 style={{ marginTop:0 }}>{item.title || 'Untitled'}</h3>
            <p style={{ color:'#555' }}>{item.desc || '-'}</p>
            <div style={{ marginTop:8, lineHeight:1.8 }}>
              <div><b>ราคา</b>: ฿{Number(item.price || 0).toLocaleString()}</div>
              <div><b>สถานะ</b>: {item.status || '-'}</div>
              <div><b>ขายเมื่อ</b>: {soldAt}</div>
              <div><b>ผู้ซื้อ (UID)</b>: {item.buyerUid || '-'}</div>
              <div><b>ผู้ซื้อ (ชื่อ)</b>: {item.buyerName || '-'}</div>
              <div><b>ช่องทางชำระ</b>: {item.paymentMethod || '-'}</div>
              <div><b>อ้างอิงชำระ</b>: {item.paymentRef || '-'}</div>
              <div><b>ผู้ขาย/แอดมิน</b>: {item.soldBy || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
