import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, loginWithGoogle } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle(); // ทำ signin (ฟังก์ชันมีอยู่แล้ว)
      // ตรวจสิทธิ์ทันทีจาก Firestore (collection 'admins')
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('No user after signin');
      const snap = await getDoc(doc(db, 'admins', uid));
      if (snap.exists()) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    } catch (err) {
      console.error('Login failed', err);
      alert(`Login failed: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: 420, maxWidth: '100%', background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 8px' }}>Sign in to MUSTODE</h2>
        <p style={{ margin: '0 0 18px', color: '#666' }}>Use Google to sign in. You will be redirected to the correct dashboard.</p>
        <button onClick={onSignIn} disabled={loading} style={{ padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </button>
      </div>
    </main>
  );
}
