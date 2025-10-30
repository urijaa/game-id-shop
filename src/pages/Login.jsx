import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, loginWithGoogle } from '../../firebase'; // ปรับ path ตามโปรเจกต์จริง

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { console.log('Login mounted, path:', window.location.pathname); }, []);

  const onSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      console.log('signed in:', auth.currentUser?.uid);
      // redirect handled elsewhere; temporary go to /user to test
      navigate('/user', { replace: true });
    } catch (err) {
      console.error('login error', err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: 420, padding: 28, background: '#fff', borderRadius: 8 }}>
        <h2>Login (test)</h2>
        <button onClick={onSignIn} disabled={loading}>{loading ? 'Signing…' : 'Sign in (test)'}</button>
      </div>
    </main>
  );
}