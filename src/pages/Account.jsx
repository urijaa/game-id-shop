import { collection, onSnapshot, query, where, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


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
        const unsub = onSnapshot(q, (snap) => {
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [user]);


    const markSold = async (id) => {
        try {
            // optimistic update: เปลี่ยนสถานะใน UI ก่อน
            setItems(prev => prev.map(it => it.id === id ? { ...it, status: 'sold' } : it));

            // พยายามอัพเดตใน Firestore
            await updateDoc(doc(db, 'listings', id), { status: 'sold' });
        } catch (err) {
            console.error('markSold failed', err);
            // ถ้าเกิด error ให้ย้อนสถานะกลับ (หรือแจ้งผู้ใช้)
            setItems(prev => prev.map(it => it.id === id ? { ...it, status: it.status === 'sold' ? 'available' : it.status } : it));
            alert('เปลี่ยนสถานะไม่สำเร็จ ดู console สำหรับรายละเอียด');
        }
    };


    const remove = async (id) => {
        if (!confirm('ลบประกาศนี้?')) return;
        const previous = items;
        // ลบออกจาก UI ทันที
        setItems(prev => prev.filter(it => it.id !== id));
        try {
            await deleteDoc(doc(db, 'listings', id));
        } catch (err) {
            console.error('delete failed', err);
            // คืนค่าเดิมถ้าลบไม่สำเร็จ
            setItems(previous);
            alert('ลบไม่สำเร็จ ดู console สำหรับรายละเอียด');
        }
    };


    if (!user) return <p>กรุณาเข้าสู่ระบบ</p>;


    return (
        <div style={{ display: 'grid', gap: 12 }}>
            {items.map(i => (
                <div
                    key={i.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        border: '1px solid #ddd',
                        padding: 12,
                        borderRadius: 8
                    }}
                >
                    {/* รูปนำของประกาศ (ถ้ามี) */}
                    <img
                        src={i.images?.[0] || '/placeholder.png'}
                        alt={i.title || 'listing image'}
                        style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 6, flex: '0 0 auto' }}
                    />

                    <div style={{ flex: 1 }}>
                        <div>
                            <b>{i.title}</b> — {i.game} — {i.status}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button onClick={() => markSold(i.id)}>Mark Sold</button>
                            {i.status !== 'sold' && (
                                <Link to={`/edit/${i.id}`}><button>Edit</button></Link>
                            )}
                            <button onClick={() => remove(i.id)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
            {items.length === 0 && <p>ยังไม่มีประกาศ</p>}
        </div>
    );
}