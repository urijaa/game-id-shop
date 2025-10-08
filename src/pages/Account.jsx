import { collection, onSnapshot, query, where, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';


export default function Account() {
const [user] = useAuthState(auth);
const [items, setItems] = useState([]);


useEffect(() => {
if (!user) return;
const q = query(
collection(db, 'listings'),
where('ownerUid', '==', user.uid),
orderBy('createdAt', 'desc')
);
const unsub = onSnapshot(q, (snap)=>{
setItems(snap.docs.map(d=>({ id: d.id, ...d.data() })));
});
return () => unsub();
}, [user]);


const markSold = async (id) => {
await updateDoc(doc(db, 'listings', id), { status: 'sold' });
};


const remove = async (id) => {
if (confirm('ลบประกาศนี้?')) await deleteDoc(doc(db, 'listings', id));
};


if (!user) return <p>กรุณาเข้าสู่ระบบ</p>;


return (
<div style={{display:'grid', gap:12}}>
{items.map(i => (
<div key={i.id} style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
<b>{i.title}</b> — {i.game} — {i.status}
<div style={{display:'flex', gap:8, marginTop:8}}>
<button onClick={()=>markSold(i.id)}>Mark Sold</button>
<button onClick={()=>remove(i.id)}>Delete</button>
</div>
</div>
))}
{items.length===0 && <p>ยังไม่มีประกาศ</p>}
</div>
);
}