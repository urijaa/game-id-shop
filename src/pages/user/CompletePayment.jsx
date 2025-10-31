// src/pages/user/CompletePayment.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// mock fallback (single)
const mockItem = {
  id: 1,
  title: 'ไอดี AFK Journey (Global) - 120,000+ Diamonds + สุ่มตัวละคร 6 ดาว 20 ตัวขึ้นไป',
  price: 550,
  quantity: 1,
  image: 'https://via.placeholder.com/90x90.png?text=AFK+Item',
  gameId: 'N/A',
  password: 'N/A'
};

function CheckmarkIcon() {
  return (
    <svg className="checkmark-svg" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" style={{ width: 80, height: 80 }}>
      <circle cx="26" cy="26" r="25" fill="#A8D580" />
      <path fill="none" strokeWidth="5" stroke="#6E44FF" strokeLinecap="round" strokeLinejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
  );
}

const completeStyles = `
  .complete-backdrop { position: fixed; top:0; left:0; width:100%; height:100vh; background-color: rgba(0,0,0,0.6); z-index:60; }
  .complete-modal { position: fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:90%; max-width:650px; background:#fff; z-index:70; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); display:flex; flex-direction:column; align-items:center; padding:24px; font-family: Arial, sans-serif; }
  .checkmark-svg{ width:80px; height:80px; }
  .complete-title{ font-size:1.5rem; font-weight:700; margin:16px 0; }
  hr.complete-divider{ width:100%; border:none; border-top:1px solid #eee; margin:0 0 16px 0; }
  .complete-items{ width:100%; display:flex; flex-direction:column; gap:12px; max-height:320px; overflow:auto; padding:8px 0; }
  .complete-item{ display:flex; align-items:center; gap:16px; width:100%; padding:8px; border-radius:8px; border:1px solid #f0f0f0; }
  .complete-item-image{ width:70px; height:70px; object-fit:cover; border-radius:8px; }
  .complete-item-title{ font-size:0.95rem; font-weight:600; line-height:1.3; margin:0; }
  .complete-item-meta{ display:flex; flex-direction:column; gap:6px; flex:1; }
  .complete-item-right{ display:flex; flex-direction:column; gap:6px; text-align:right; min-width:160px; }
  .complete-item-right .label{ font-size:0.85rem; color:#333; font-weight:600; }
  .complete-item-right .value{ font-size:0.9rem; color:#555; font-weight:500; }
  .info-section{ width:100%; margin-top:12px; }
  .info-row{ display:flex; justify-content:space-between; align-items:center; font-size:0.95rem; margin-bottom:8px; }
  .complete-confirm-btn{ margin-top:18px; width:100%; padding:14px; font-size:1rem; font-weight:700; color:#fff; background-color:#2d8cf0; border:none; border-radius:8px; cursor:pointer; }
  .complete-confirm-btn:hover{ opacity:0.95; }
`;

function CompleteStyles() { return <style>{completeStyles}</style>; }

export default function CompletePayment() {
  const location = useLocation();
  const navigate = useNavigate();

  // support both: location.state.items (array) or single location.state.item
  const items = (() => {
    if (location.state && Array.isArray(location.state.items)) return location.state.items;
    if (location.state && location.state.item) return [location.state.item];
    return [mockItem];
  })();

  const orderId = location.state?.orderId || '-';
  const total = items.reduce((s, it) => s + (Number(it.price || 0) * (it.quantity || 1)), 0);

  const handleClose = () => navigate('/user', { replace: true });

  return (
    <>
      <CompleteStyles />
      <div className="complete-backdrop" onClick={handleClose}></div>

      <div className="complete-modal" role="dialog" aria-modal="true">
        <CheckmarkIcon />
        <h2 className="complete-title">Payment Complete</h2>
        <hr className="complete-divider" />

        <div className="complete-items">
          {items.map((item) => {
            const image = (Array.isArray(item.images) && item.images[0]) || item.image || 'https://via.placeholder.com/90x90.png?text=AFK+Item';
            const title = item.title || 'Untitled Item';
            const price = Number(item.price || 0);
            const quantity = item.quantity || 1;
            // try common keys for ID/Game credentials if present
            const idGame = item.gameId || item.idGame || item.accountId || item.id_game || '-';
            const password = item.password || item.pass || item.pwd || '-';

            return (
              <div className="complete-item" key={item.id || `${item.title}-${Math.random()}`}>
                <img src={image} alt={title} className="complete-item-image" />
                <div className="complete-item-meta">
                  <p className="complete-item-title">{title}</p>
                  <div style={{ fontWeight: 700 }}>฿{price.toLocaleString()} &nbsp;×&nbsp; {quantity}</div>
                </div>

                <div className="complete-item-right" aria-hidden>
                  <div>
                    <div className="label">ID Game :</div>
                    <div className="value">{idGame}</div>
                  </div>
                  <div>
                    <div className="label">Password :</div>
                    <div className="value">{password}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <section className="info-section">
          <div className="info-row"><strong>Order ID</strong><span>{orderId}</span></div>
          <div className="info-row"><strong>Total</strong><span>฿{total.toLocaleString()}</span></div>
        </section>

        <button className="complete-confirm-btn" onClick={handleClose}>Done</button>
      </div>
    </>
  );
}