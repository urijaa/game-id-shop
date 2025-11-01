import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,           // ✅ เพิ่ม
  setPersistence,
  browserLocalPersistence,
  signOut
} from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --- Google provider ---
export const provider = new GoogleAuthProvider();
// ✅ บังคับให้ขึ้นตัวเลือกบัญชีทุกครั้ง
provider.setCustomParameters({ prompt: 'select_account' });

/**
 * เรียกตอนกดปุ่ม "Sign in with Google"
 * forceChoose = true จะ signOut ก่อนเพื่อกัน auto-login บัญชีเดิม
 */
export const loginWithGoogle = async (forceChoose = true) => {
  await setPersistence(auth, browserLocalPersistence);
  if (forceChoose) await signOut(auth);               // ✅ กันล็อกอินอัตโนมัติบัญชีเดิม
  try {
    return await signInWithPopup(auth, provider);
  } catch (e) {
    // ถ้าป๊อปอัปถูกบล็อก/ปิด → ใช้ Redirect
    if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/popup-closed-by-user') {
      return signInWithRedirect(auth, provider);
    }
    throw e;
  }
};

// ✅ เรียกใน useEffect ของหน้า Login/App เมื่อใช้ redirect
export const resolveRedirectResult = () => getRedirectResult(auth);

export function logout() { return auth.signOut(); }
export const ts = () => serverTimestamp();
