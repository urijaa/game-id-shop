import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { alertSuccess, alertError, alertConfirm } from '../../lib/alert.js';

export default function AdminAddEdit() {
  const { isAdmin, checking } = useOutletContext() || {};
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const id = sp.get('id');

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const snap = await getDoc(doc(db, 'listings', id));
      if (snap.exists()) {
        const d = snap.data();
        setTitle(d.title || '');
        setDesc(d.desc || '');
        setPrice(String(d.price ?? ''));
        setImages(Array.isArray(d.images) ? d.images : []);
      }
    })();
  }, [id]);

  const pickFiles = () => fileInputRef.current?.click();

  const onPickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (!isAdmin) return alertError('เฉพาะแอดมินเท่านั้น');

    try {
      setUploading(true);
      setUploadMsg(`Uploading ${files.length} file(s) to Cloudinary...`);
      const uploaded = [];
      for (let i = 0; i < files.length; i++) {
        setUploadMsg(`Uploading ${i + 1}/${files.length} ...`);
        const { url } = await uploadToCloudinary(files[i]);
        uploaded.push(url);
      }
      setImages(prev => [...prev, ...uploaded]);
      setUploadMsg('Upload complete.');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.message || 'Upload failed',
      });
      

    } finally {
      setUploading(false);
      e.target.value = '';
      setTimeout(() => setUploadMsg(''), 1200);
    }
  };

  const removeImageAt = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alertError('เฉพาะแอดมินเท่านั้น');

    const payload = {
      title: title.trim(),
      desc: desc.trim(),
      price: Number(price || 0),
      images,
      status: 'active',
      createdAt: serverTimestamp(),
    };

    try {
      const ref = doc(db, 'listings', id || (crypto?.randomUUID?.() || String(Date.now())));
      await setDoc(ref, payload, { merge: true });
      alertSuccess('บันทึกสำเร็จ');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alertError('บันทึกไม่สำเร็จ');
    }
  };

  // 🔹 ฟังก์ชันสุ่มข้อมูล 10 ชิ้น
  const addRandom10 = async () => {
    if (!isAdmin) return alertError('เฉพาะแอดมินเท่านั้น');
    if (!confirm('เพิ่มสินค้าแบบสุ่ม 10 ชิ้น?')) return;
    const imageUrl = 'https://res.cloudinary.com/dmlf7oz4s/image/upload/v1761993515/nkrtc6eneq6smyik1dgd.png';
    const titles = ['Roblox', 'Valorant', 'Genshin', 'Minecraft', 'FreeFire', 'PUBG', 'CS2', 'Mobile Legends', 'Fortnite', 'LoL'];
    try {
      for (let i = 0; i < 10; i++) {
        const ref = doc(db, 'listings', crypto.randomUUID());
        await setDoc(ref, {
          title: `${titles[i]} #${Math.floor(Math.random() * 9999)}`,
          desc: `Test item ${i + 1}`,
          price: Math.floor(Math.random() * 500 + 100),
          images: [imageUrl],
          status: 'active',
          createdAt: serverTimestamp(),
        });
      }
      alertSuccess('เพิ่มสินค้าสุ่ม 10 ชิ้นสำเร็จ');
    } catch (err) {
      console.error(err);
      alertError('เพิ่มไม่สำเร็จ');
    }
  };

  if (checking) return null;
  if (!isAdmin) return <div style={{ padding: 12 }}>ต้องเป็นผู้ดูแลระบบเท่านั้น</div>;

  return (
    <div className="admin-page">
      <div className="edit-page">
        <h2>{id ? 'Edit' : 'Add'} item</h2>

        <form className="edit-form" onSubmit={onSubmit}>
          <div>
            <div className="image-grid">
              <div className="image-cell">
                <div className="image-add" onClick={pickFiles}>
                  คลิกเพื่อ “เลือกภาพจากเครื่อง”
                </div>
              </div>

              {images.map((url, i) => (
                <div key={i} className="image-cell">
                  <img src={url} alt="" />
                  <button type="button" className="del-img" onClick={() => removeImageAt(i)}>×</button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="pill" onClick={pickFiles} disabled={uploading}>
                {uploading ? 'Uploading...' : 'เลือกจากเครื่อง'}
              </button>
              <button
                type="button"
                className="pill"
                style={{ background: '#0078ff', color: '#fff' }}
                onClick={addRandom10}
              >
                เพิ่มสินค้าสุ่ม 10 ชิ้น
              </button>
              {!!uploadMsg && <span style={{ color: '#666' }}>{uploadMsg}</span>}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onPickFiles}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="edit-right">
            <label>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required />

            <label>Product Details</label>
            <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} />

            <label>Price</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} />

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button className="submit" disabled={uploading}>Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
