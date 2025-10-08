import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [items, setItems] = useState([]);
  const [qtext, setQtext] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map(d => {
        const x = d.data();
        return {
          id: d.id,
          title: (x.title ?? '').toString(),
          game: (x.game ?? '').toString(),
          price: Number(x.price ?? 0),
          ownerUid: x.ownerUid ?? '',
          // ถ้าเอกสารถูกเก็บเป็น image เดี่ยว ให้แปลงเป็น array ให้ด้วย
          images: Array.isArray(x.images) ? x.images : (x.image ? [x.image] : []),
        };
      });
      setItems(rows);
    });
    return () => unsub();
  }, []);

  const filtered = items.filter(x =>
    (x.title + ' ' + x.game).toLowerCase().includes(qtext.toLowerCase())
  );

  return (
    <div style={{display:'grid', gap:8}}>
      <input placeholder="ค้นหาเกมหรือชื่อประกาศ" value={qtext} onChange={e=>setQtext(e.target.value)} />
      {filtered.map(item => <ListingCard key={item.id} item={item} />)}
    </div>
  );
}
