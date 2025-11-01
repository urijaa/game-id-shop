import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { markListingAsSold } from '../../lib/sales';

export default function Payment() {
  const { user } = useOutletContext() || {};
  const [search] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const listingIdFromState = location.state?.listingId || null;
  const listingId = listingIdFromState || search.get('id');

  const [method, setMethod] = useState('PromptPay');
  const [ref, setRef] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return alert('ต้องเข้าสู่ระบบก่อน');
    if (!listingId) return alert('ไม่พบรายการสินค้า');

    try {
      await markListingAsSold(listingId, {
        buyerUid: user.uid,
        buyerName: user.displayName || user.email || 'buyer',
        paymentMethod: method,
        paymentRef: ref.trim(),
        soldBy: 'system', // หรือเก็บ uid แอดมิน/ระบบที่ทำธุรกรรม
      });
      navigate('/user/complete', { replace: true });
    } catch (err) {
      console.error(err);
      alert('บันทึกการชำระเงินไม่สำเร็จ');
    }
  };

  return (
    <div className="payment-page" style={{ padding: 20 }}>
      <h2>Payment</h2>
      {!listingId && <p style={{color:'#a00'}}>ไม่พบรหัสสินค้า (ต้องส่ง ?id=listingId หรือ state.listingId)</p>}

      <form onSubmit={onSubmit} style={{ display:'grid', gap:12, maxWidth:460 }}>
        <label>
          ช่องทางชำระ
          <select value={method} onChange={(e)=>setMethod(e.target.value)} style={{ width:'100%', padding:8 }}>
            <option value="PromptPay">PromptPay</option>
            <option value="BankTransfer">Bank Transfer</option>
            <option value="CreditCard">Credit Card</option>
          </select>
        </label>

        <label>
          อ้างอิงชำระ (Invoice/Slip/Txn Id)
          <input value={ref} onChange={(e)=>setRef(e.target.value)} required style={{ width:'100%', padding:8 }} />
        </label>

        <button type="submit" style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #ddd', cursor:'pointer' }}>
          ยืนยันการชำระ
        </button>
      </form>
    </div>
  );
}
