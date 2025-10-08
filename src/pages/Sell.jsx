// Sell.jsx
import { auth, db, ts } from '../firebase'; // ไม่ต้องใช้ storage แล้ว
import { addDoc, collection } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';

const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadOneToCloudinary = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', preset);
    data.append('folder', `listings/${auth.currentUser.uid}`);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status < 400) {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) return resolve(res.secure_url);
          return reject(new Error(res.error?.message || 'Upload failed'));
        }
        return reject(new Error(xhr.responseText || 'Upload error'));
      }
    };
    xhr.send(data);
  });

export default function Sell() {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('กรุณา Login ก่อนลงขาย');
    if (!title || !game || !price) return alert('กรอกชื่อประกาศ / เกม / ราคา ให้ครบ');

    try {
      setSaving(true);
      setProgress(0);

      let imageUrls = [];
      if (files && files.length > 0) {
        imageUrls = await Promise.all(
          [...files].map((f) => uploadOneToCloudinary(f, setProgress))
        );
      }

      await addDoc(collection(db, 'listings'), {
        title: String(title),
        game: String(game),
        price: Number(price),
        desc: String(desc || ''),
        images: imageUrls,        // เก็บ URL จาก Cloudinary
        ownerUid: user.uid,
        status: 'active',
        createdAt: ts(),
      });

      setTitle(''); setGame(''); setPrice(''); setDesc('');
      setFiles([]); setProgress(0);
      alert('ลงขายสำเร็จ!');
    } catch (err) {
      console.error(err);
      alert(`อัปโหลด/บันทึกไม่สำเร็จ: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{display:'grid', gap:8}}>
      <input placeholder="ชื่อประกาศ" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="ชื่อเกม" value={game} onChange={e=>setGame(e.target.value)} />
      <input type="number" placeholder="ราคา (บาท)" value={price} onChange={e=>setPrice(e.target.value)} />
      <textarea placeholder="รายละเอียด" rows={4} value={desc} onChange={e=>setDesc(e.target.value)} />
      <input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} />
      <button type="submit" disabled={saving}>{saving ? 'กำลังบันทึก…' : 'ลงขาย'}</button>
      {saving && files?.length > 0 ? <progress value={progress} max={100} /> : null}
    </form>
  );
}
