// src/pages/admin/AdminLayout.jsx
import { Outlet, useOutletContext } from 'react-router-dom';

export default function AdminLayout() {
  const parentCtx = useOutletContext(); // { isAdmin, checking }

  return (
    <div className="admin-page">
      <Outlet context={parentCtx} />
    </div>
  );
}
