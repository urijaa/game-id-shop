import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { ADMIN_UIDS } from "../constants/admin";

export default function AdminGate({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return null;
  const isAdmin = !!user && ADMIN_UIDS.includes(user.uid);
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
