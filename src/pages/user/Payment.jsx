// src/pages/user/Payment.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext.jsx';
import { markListingAsSold } from '../../lib/sales'; // ✅ ใช้งานจริง: บันทึกลง Firestore

// QR mock
const qrCodeImage = 'https://via.placeholder.com/200x200.png?text=QR+Code';

// minimal styles (kept)
const paymentStyles = `
  .payment-backdrop { position: fixed; top:0; left:0; width:100%; height:100vh; background-color: rgba(0,0,0,0.6); z-index:40; }
  .payment-modal { position: fixed; top:50%; left:50%; transform: translate(-50%,-50%); width:90%; max-width:800px; max-height:90vh; background:#fff; z-index:50; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); display:flex; flex-direction:column; font-family: Arial, sans-serif; }
  .payment-header{ display:flex; justify-content:flex-end; padding:16px 20px; border-bottom:1px solid #eee; }
  .payment-back-btn{ background:none; border:1px solid #ccc; border-radius:20px; padding:6px 16px; font-size:0.9rem; font-weight:600; color:#555; cursor:pointer; }
  .payment-back-btn:hover { background-color: #f5f5f5; }

  .payment-body{ overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:24px; }
  .payment-item-summary{ display:flex; align-items:center; gap:16px; }
  .payment-item-image{ width:90px; height:90px; object-fit:cover; border-radius:8px; }
  .payment-item-details{ flex-grow:1; }
  .payment-item-title{ font-size:1rem; font-weight:600; margin:0 0 12px 0; }
  .quantity-selector-static{ border:1px solid #ccc; border-radius:20px; padding:6px 16px; font-size:0.9rem; }
  .payment-item-price{ font-size:1.1rem; font-weight:700; text-align:right; }

  .total-section { display:flex; justify-content:space-between; align-items:center; }
  .total-label, .total-price { font-size:1.3rem; font-weight:700; }

  .checkout-title { font-size:1.5rem; font-weight:700; margin:0; }

  .confirm-btn {
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    color: #333;
    background-color: #b8d9aa;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .confirm-btn:hover { background-color: #a8c99a; }
  .confirm-btn[disabled]{ opacity:0.6; cursor:not-allowed; }

  .preview-img { width: 160px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; }
  .preview-remove { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #a00; }
`;

function PaymentStyles(){ return <style>{paymentStyles}</style>; }

export default function Payment({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const parentCtx = useOutletContext() || {};
  const { user } = parentCtx;                    // ✅ ใช้ uid/ชื่อผู้ซื้อจริง
  const { cart: cartFromContext /*, clearCart */ } = useContext(CartContext);

  // items มาจาก state (ปุ่ม "ไปชำระเงิน") หรือจาก CartContext
  const items = (location.state && location.state.items)
    ? location.state.items
    : (cartFromContext || []);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // วิธีชำระ + หมายเลขอ้างอิง (ให้ผู้ใช้กรอก / ถ้าไม่กรอกจะสุ่มให้)
  const [method, setMethod] = useState('PromptPay');
  const [ref, setRef] = useState('');

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const total = items.reduce((s, it) => s + (Number(it.price || 0) * (it.quantity || 1)), 0);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleRemovePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setFile(null);
  };

  const handleBackToCart = () => {
    navigate('/user', { replace: true, state: { openCart: true } });
  };

  // ✅ ใช้งานจริง: บันทึกการขายทุกชิ้นลง Firestore
  const handleConfirm = async () => {
    if (!user?.uid) {
      alert('กรุณาเข้าสู่ระบบก่อนชำระเงิน');
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      alert('ไม่พบสินค้าในคำสั่งซื้อ');
      return;
    }

    setUploading(true);
    try {
      // สร้างค่าอ้างอิงถ้าไม่กรอก
      const paymentRef = (ref && ref.trim()) || `PMT-${Math.random().toString(36).toUpperCase().slice(2,8)}`;

      // เรียกอัปเดตทุกชิ้นเป็น sold
      await Promise.all(
        items.map((it) =>
          markListingAsSold(it.id, {
            buyerUid: user.uid,
            buyerName: user.displayName || user.email || 'buyer',
            paymentMethod: method,
            paymentRef,
            soldBy: 'system', // หรือเก็บ uid แอดมิน/ระบบที่ทำธุรกรรม
          })
        )
      );

      // (ถ้าต้องการ) เคลียร์ตะกร้า
      // clearCart?.();

      // ส่งข้อมูลรายการไปหน้า complete
      const itemsToSend = items.map((it) => ({
        id: it.id,
        title: it.title || 'Untitled Item',
        price: Number(it.price || 0),
        quantity: it.quantity || 1,
        images: Array.isArray(it.images) ? it.images : (it.image ? [it.image] : []),
      }));

      navigate('/user/complete', { state: { items: itemsToSend } });
    } catch (e) {
      console.error('confirm error', e);
      alert('บันทึกการชำระเงินไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <PaymentStyles />
      <div className="payment-backdrop" onClick={onClose}></div>

      <div className="payment-modal" role="dialog" aria-modal="true">
        <header className="payment-header">
          <button className="payment-back-btn" onClick={handleBackToCart}>Back</button>
        </header>

        <div className="payment-body">
          {items.map((it) => (
            <section className="payment-item-summary" key={it.id}>
              <img
                src={(Array.isArray(it.images) && it.images[0]) || it.image || 'https://via.placeholder.com/90x90.png?text=AFK+Item'}
                alt={it.title}
                className="payment-item-image"
              />
              <div className="payment-item-details">
                <p className="payment-item-title">{it.title}</p>
                <div className="quantity-selector-static"><span>{it.quantity || 1}</span></div>
              </div>
              <div className="payment-item-price">฿{Number(it.price || 0) * (it.quantity || 1)}</div>
            </section>
          ))}

          <hr className="payment-divider" />

          <section className="total-section">
            <span className="total-label">Total</span>
            <span className="total-price">฿{total} Baht</span>
          </section>

          <hr className="payment-divider" />

          <section className="checkout-section">
            <h2 className="checkout-title">Checkout</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* PromptPay / วิธีชำระ */}
              <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
                <div style={{ marginBottom: 12, fontWeight: 600 }}>ช่องทางชำระ</div>

                <label style={{ display:'block', marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="method"
                    value="PromptPay"
                    checked={method === 'PromptPay'}
                    onChange={() => setMethod('PromptPay')}
                  /> PromptPay
                </label>

                <label style={{ display:'block', marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="method"
                    value="BankTransfer"
                    checked={method === 'BankTransfer'}
                    onChange={() => setMethod('BankTransfer')}
                  /> Bank Transfer
                </label>

                <label style={{ display:'block', marginBottom: 12 }}>
                  <input
                    type="radio"
                    name="method"
                    value="CreditCard"
                    checked={method === 'CreditCard'}
                    onChange={() => setMethod('CreditCard')}
                  /> Credit Card
                </label>

                <img src={qrCodeImage} alt="PromptPay QR Code" style={{ width: '100%', maxWidth: 200 }} />
                <p style={{ fontSize: 12, color: '#e74c3c' }}>*สแกนโค้ดเพื่อชำระ (ถ้าเลือก PromptPay)</p>

                <div style={{ marginTop: 12 }}>
                  <label style={{ display:'block', fontWeight:600, marginBottom: 6 }}>
                    อ้างอิงการชำระ (Invoice/Slip/Txn Id)
                  </label>
                  <input
                    value={ref}
                    onChange={(e)=>setRef(e.target.value)}
                    placeholder="เช่น SLIP-123456"
                    style={{ width:'100%', padding:8, border:'1px solid #ccc', borderRadius:6 }}
                  />
                  <div style={{ fontSize:12, color:'#777', marginTop:6 }}>
                    ไม่กรอกก็ได้ ระบบจะสร้างให้อัตโนมัติ
                  </div>
                </div>
              </div>

              {/* อัปโหลดสลิป (ไม่บังคับ) */}
              <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
                <span style={{ fontWeight: 600 }}>Upload payment receipt (optional)</span>

                {!previewUrl ? (
                  <>
                    <label
                      className="upload-button"
                      htmlFor="payment-upload"
                      style={{ marginTop: 12, display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:20, border:'2px dashed #ccc', borderRadius:8, cursor:'pointer' }}
                    >
                      <span style={{ fontSize: 24 }}>📤</span>
                      <div>Upload Payment</div>
                    </label>
                    <input type="file" id="payment-upload" hidden accept="image/*" onChange={handleFileChange} />
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12 }}>
                    <img src={previewUrl} alt="preview" className="preview-img" />
                    <div>
                      <button className="preview-remove" onClick={handleRemovePreview} aria-label="remove preview">✕</button>
                      <div style={{ marginTop: 8, color: '#666' }}>{file?.name}</div>
                    </div>
                  </div>
                )}

                <button
                  className="confirm-btn"
                  onClick={handleConfirm}
                  disabled={uploading}
                  style={{ marginTop: 12, width: '100%' }}
                >
                  {uploading ? 'Processing…' : 'Confirm'}
                </button>
                <p style={{ fontSize: 12, color: '#777', marginTop: 8 }}>
                  *อัปโหลดสลิปไม่บังคับ หากไม่อัปโหลด ระบบยังบันทึกการขายได้ตามปกติ
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
