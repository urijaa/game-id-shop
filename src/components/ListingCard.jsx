// src/components/ListingCard.jsx
export default function ListingCard({ item }) {
  // ดึงรูปแรกจาก array; ถ้าไม่มี ใช้ placeholder
  const src =
    (Array.isArray(item.images) && item.images[0]) ||
    item.image || // เผื่อเอกสารเก่า
    'https://via.placeholder.com/160x120?text=No+Image';

  return (
    <div style={{display:'flex', gap:12, padding:12, border:'1px solid #ddd', borderRadius:6}}>
      <img
        src={src}
        alt={item.title}
        width={120}
        height={90}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/160x120?text=No+Image'; }}
        style={{objectFit:'cover', borderRadius:4}}
      />
      <div>
        <div style={{fontWeight:600}}>{item.title}</div>
        <div>{item.game} • ฿{Number(item.price || 0).toLocaleString()}</div>
        <div style={{opacity:.6}}>by {item.ownerUid?.slice(0,6) || '-'}</div>
      </div>
    </div>
  );
}
