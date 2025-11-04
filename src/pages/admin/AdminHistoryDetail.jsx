import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const mockItem = {
  id: 1,
  title: 'ไอดี AFK Journey (Global) - 120,000+ Diamonds + สุ่มตัวละคร 6 ดาว 20 ตัวขึ้นไป',
  price: 550,
  quantity: 1,
  image: 'https://via.placeholder.com/90x90.png?text=AFK+Item'
};

const styles = `
  .complete-backdrop { position: fixed; inset:0; background:rgba(0,0,0,0.6); z-index:60; display:grid; place-items:center; }
  .complete-modal { width:90%; max-width:720px; background:#fff; border-radius:12px; padding:20px; box-shadow:0 8px 30px rgba(0,0,0,0.15); z-index:70; }
  .complete-items { display:flex; flex-direction:column; gap:12px; max-height:380px; overflow:auto; margin-bottom:12px; }
  .complete-item { display:flex; gap:12px; align-items:center; justify-content:space-between; border:1px solid #eee; padding:10px; border-radius:8px; }
  .complete-item-left { display:flex; gap:12px; align-items:center; flex:1; }
  .complete-item-image { width:70px; height:70px; object-fit:cover; border-radius:8px; }
  .complete-item-title { font-weight:700; margin:0; }
  .complete-item-meta { text-align:right; min-width:180px; }
  .complete-footer { display:flex; justify-content:space-between; align-items:center; margin-top:12px; }
  .done-btn { padding:10px 14px; border-radius:8px; background:#2d8cf0; color:#fff; border:none; cursor:pointer; }
`;

function Styles() { return <style>{styles}</style>; }

export default function CompletePayment() { 
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Styles />
      <div className="complete-backdrop" onClick={() => navigate('/user', { replace: true })}>
        <div className="complete-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
          <h2 style={{ marginTop: 0 }}>Payment Complete</h2>

          <div className="complete-items">
            {Array.isArray(location.state?.items) ? location.state.items.map((item) => (
              <div className="complete-item" key={item.id || `${item.title}-${Math.random()}`}>
                <div className="complete-item-left">
                  <img
                    src={(Array.isArray(item.images) && item.images[0]) || item.image || 'https://via.placeholder.com/90x90.png?text=AFK+Item'}
                    alt={item.title}
                    className="complete-item-image"
                  />
                  <div>
                    <p className="complete-item-title">{item.title}</p>
                    <div style={{ color: '#666', marginTop: 6 }}>฿{Number(item.price || 0).toLocaleString()} × {item.quantity || 1}</div>
                  </div>
                </div>
            
                <div className="complete-item-meta">
                  <div style={{ fontSize: 13, color: '#444' }}>
                    <strong style={{ fontSize: 13, color: '#444' }}>ID Game : WebApp &nbsp;{item.title}</strong>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#444' }}>
                    <strong style={{ fontSize: 13, color: '#444' }}>Password:&nbsp;{item.password || item.pass || 'GradeA'}</strong>
                  </div>
                </div>

              </div>
            )) : (
              <div className="complete-item" key={mockItem.id}>
                <div className="complete-item-left">
                  <img
                    src={mockItem.image}
                    alt={mockItem.title}
                    className="complete-item-image"
                  />
                  <div>
                    <p className="complete-item-title">{mockItem.title}</p>
                    <div style={{ color: '#666', marginTop: 6 }}>฿{Number(mockItem.price).toLocaleString()} × {mockItem.quantity}</div>
                  </div>
                </div>

                <div className="complete-item-meta">
                  <div style={{ fontSize: 13, color: '#444' }}>
                    <strong style={{ fontSize: 13, color: '#444' }}>ID Game : WebApp&nbsp;{mockItem.title}</strong>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: '#444' }}>
                    <strong style={{ fontSize: 13, color: '#444' }}>Password:&nbsp;{mockItem.password || mockItem.pass || 'GradeA'}</strong>
                  </div>
                </div>

              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
            <div className="complete-footer">
              <div>
                <div style={{ marginTop: 6 }}><strong>Total:</strong> ฿{Array.isArray(location.state?.items) ? location.state.items.reduce((s, it) => s + (Number(it.price || 0) * (it.quantity || 1)), 0).toLocaleString() : (mockItem.price * mockItem.quantity).toLocaleString()}</div>
              </div>
              <button className="done-btn" onClick={() => navigate('/user', { replace: true })}>Done</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}