import { Outlet, Link } from 'react-router-dom';
import { auth, loginWithGoogle, logout } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function App() {
  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
      alert(`Login error: ${e?.code || e?.message || e}`);
    }
  };

  return (
    <div style={{maxWidth: 960, margin: '0 auto', padding: 16}}>
      <header style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between'}}>
        <nav style={{display:'flex', gap:12}}>
          <Link to="/">Home</Link>
          <Link to="/sell">Sell</Link>
          <Link to="/account">My Account</Link>
        </nav>
        <div>
          {user ? (
            <>
              <img src={user.photoURL} width={28} height={28} style={{borderRadius:'50%', verticalAlign:'middle'}}/>
              <button onClick={logout} style={{marginLeft:12}}>Logout</button>
            </>
          ) : (
            <button onClick={handleLogin}>Login with Google</button>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
