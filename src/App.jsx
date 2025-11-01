import { Outlet } from 'react-router-dom';
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!user) { alive && setIsAdmin(false); return; }
        const snap = await getDoc(doc(db, 'admins', user.uid));
        alive && setIsAdmin(snap.exists());
      } catch (e) {
        console.error('check admin error', e);
        alive && setIsAdmin(false);
      } finally {
        alive && setChecking(false);
      }
    })();
    return () => { alive = false; };
  }, [user]);

  // App จะไม่แสดง header อีกต่อไป — children จะรับ context นี้ผ่าน useOutletContext
  return <Outlet context={{ isAdmin, checking, user }} />;
}
