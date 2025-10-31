// src/pages/user/Payment.jsx (ไฟล์ใหม่)

import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext.jsx';

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

  .total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .total-label { font-size: 1.3rem; font-weight: 700; }
  .total-price { font-size: 1.3rem; font-weight: 700; }

  .checkout-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .checkout-option {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
  }
  
  /* PromptPay Column */
  .promptpay-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .radio-select {
    width: 20px;
    height: 20px;
    border: 2px solid #555;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
  .radio-select-inner {
    width: 12px;
    height: 12px;
    background-color: #555;
    border-radius: 50%;
  }
  .promptpay-header label { font-weight: 700; }
  .qr-code-img {
    width: 100%;
    max-width: 200px;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  .promptpay-note {
    font-size: 0.8rem;
    color: #e74c3c;
    text-align: center;
    margin-top: 12px;
  }

  /* Upload Column */
  .upload-option { display: flex; flex-direction: column; gap: 16px; }
  .upload-label { font-weight: 600; }
  .upload-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
  }
  .upload-button:hover { border-color: #888; }
  .upload-icon { font-size: 2rem; }
  .upload-button span { font-weight: 600; }
  
  /* (วงสีม่วง) ปุ่ม Confirm */
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

  /* preview */
  .preview-wrap {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  .preview-img {
    width: 160px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  .preview-remove {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #a00;
  }

  /* popup */
  .popup-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 60;
    display: grid;
    place-items: center;
  }
  .popup {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    max-width: 360px;
    width: 90%;
    text-align: center;
  }
  .popup-close {
    position: absolute;
    top: 8px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
  }
`;

function PaymentStyles(){ return <style>{paymentStyles}</style>; }

export default function Payment({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: cartFromContext } = useContext(CartContext);
  const items = (location.state && location.state.items) ? location.state.items : (cartFromContext || []);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
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

  // NOW: Confirm does NOT call Firebase — proceed even if no file.
  const handleConfirm = async () => {
    setUploading(true);
    try {
      // ensure we send full items array to CompletePayment
      const itemsToSend = Array.isArray(items) ? items.map(it => ({
        id: it.id,
        title: it.title || 'Untitled Item',
        price: Number(it.price || 0),
        quantity: it.quantity || 1,
        images: Array.isArray(it.images) ? it.images : (it.image ? [it.image] : []),
      })) : [];

      console.log('Payment: confirming items', itemsToSend);

      // small delay for UX
      await new Promise((r) => setTimeout(r, 200));

      // send full array as `items`
      navigate('/user/complete', { state: { items: itemsToSend } });
    } catch (e) {
      console.error('confirm error', e);
      alert('การยืนยันการชำระเงินล้มเหลว — โปรดลองใหม่');
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
              <img src={(Array.isArray(it.images) && it.images[0]) || it.image || 'https://via.placeholder.com/90x90.png?text=AFK+Item'} alt={it.title} className="payment-item-image" />
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
              <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
                <div style={{ marginBottom: 12, fontWeight: 600 }}>PromptPay</div>
                <img src={qrCodeImage} alt="PromptPay QR Code" style={{ width: '100%', maxWidth: 200 }} />
                <p className="promptpay-note">*You can scan this QR code to make a payment.</p>
              </div>

              <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
                <span style={{ fontWeight: 600 }}>Upload payment receipt</span>

                {!previewUrl ? (
                  <>
                    <label className="upload-button" htmlFor="payment-upload" style={{ marginTop: 12 }}>
                      <span style={{ fontSize: 24 }}>📤</span>
                      <div>Upload Payment (optional)</div>
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
                <p style={{ fontSize: 12, color: '#777', marginTop: 8 }}>*You may upload a receipt, but it is optional. Confirm will proceed without uploading.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}