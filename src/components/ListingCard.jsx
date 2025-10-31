import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext.jsx';

export default function ListingCard({ item }) {
  const navigate = useNavigate();
  const { addItem, isInCart } = useContext(CartContext);

  const src =
    (Array.isArray(item.images) && item.images[0]) ||
    item.image ||
    'https://via.placeholder.com/160x120?text=No+Image';

  const inCart = isInCart(item.id);

  return (
    <div style={{display:'flex', gap:12, padding:12, border:'1px solid #ddd', borderRadius:6, alignItems:'center'}}>
      <img
        src={src}
        alt={item.title}
        width={120}
        height={90}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/160x120?text=No+Image'; }}
        style={{objectFit:'cover', borderRadius:4}}
      />
      <div style={{flex:1}}>
        <div style={{fontWeight:600}}>{item.title}</div>
        <div>{item.game} • ฿{Number(item.price || 0).toLocaleString()}</div>
        {/* แสดง meta จาก desc */}
        <div className="meta" style={{opacity:0.6, marginTop:6}}>{item.desc || ''}</div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {inCart ? (
          <div style={{ color: '#888', fontWeight: 600 }}>IN CART</div>
        ) : (
          <button
            type="button"
            onClick={() => {
              // เพิ่มลง cart แล้วไปหน้า /user เพื่อเปิด cart (state ของคุณเดิม)
              addItem(item);
              try {
                navigate('/user', { state: { openCart: true, itemId: item.id } });
              } catch {
                // fallback
                window.location.href = '/user';
              }
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: 'none',
              background: '#2d8cf0',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
}
