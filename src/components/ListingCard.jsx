// src/components/ListingCard.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext.jsx';

export default function ListingCard({ item, onOpen }) {
  const navigate = useNavigate();
  const { isInCart } = useContext(CartContext); // ใช้แค่เช็คว่ามีในตะกร้าหรือยัง

  const src =
    (Array.isArray(item.images) && item.images[0]) ||
    item.image ||
    'https://via.placeholder.com/160x120?text=No+Image';

  const inCart = isInCart(item.id);
  const isSold = item.status === 'sold';

  const openDetail = () => {
    if (!item?.id) return;
    if (typeof onOpen === 'function') {
      onOpen(item); // เปิด Quick View ถ้ามี onOpen
    } else {
      navigate(`/user/product/${item.id}`, { state: { item } }); // ไม่งั้นไปหน้า detail
    }
  };

  return (
    <div
      onClick={openDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && openDetail()}
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        border: '1px solid #ddd',
        borderRadius: 6,
        alignItems: 'center',
        opacity: isSold ? 0.6 : 1,
        cursor: 'pointer',
        background: '#fff',
        minWidth: 0, // เผื่อข้อความยาว
      }}
    >
      <img
        src={src}
        alt={item.title}
        width={120}
        height={90}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src =
            'https://via.placeholder.com/160x120?text=No+Image';
        }}
        style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={item.title}
        >
          {item.title}
        </div>
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={`${item.game || ''} • ฿${Number(item.price || 0).toLocaleString()}`}
        >
          {item.game} • ฿{Number(item.price || 0).toLocaleString()}
        </div>
        <div
          className="meta"
          style={{
            opacity: 0.6,
            marginTop: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={item.desc || ''}
        >
          {item.desc || ''}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isSold ? (
          <div
            style={{
              background: '#aaa',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 6,
              textAlign: 'center',
              fontWeight: 600,
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            SOLD
          </div>
        ) : inCart ? (
          <div
            style={{
              color: '#888',
              fontWeight: 600,
              cursor: 'default',
              userSelect: 'none',
            }}
          >
            IN CART
          </div>
        ) : null}
      </div>
    </div>
  );
}
