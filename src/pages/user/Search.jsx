// src/pages/user/Search.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import {
  collection, query, where, orderBy, onSnapshot,
} from 'firebase/firestore';
import ListingCard from '../../components/ListingCard';
import { alertSuccess, alertError, alertConfirm } from '../../lib/alert.js';

const searchStyles = `
  .search-backdrop{
    position:fixed; inset:0;
    background:rgba(0,0,0,.72);       /* เข้มขึ้น */
    backdrop-filter: blur(2px);        /* เบลอพื้นหลังนิดๆ */
    z-index:80;
  }
  .search-modal{
    position:fixed; top:0; left:0; right:0;
    background:#fff; z-index:95;       /* สูงขึ้น */
    box-shadow:0 8px 24px rgba(0,0,0,.12);
    padding:20px 24px;
    animation:slideDown .22s ease-out;
  }
  @keyframes slideDown{
    from{ transform:translateY(-100%); opacity:0;}
    to  { transform:translateY(0);     opacity:1;}
  }
  .search-container{
    max-width:1000px; margin:0 auto;
    display:flex; align-items:center; gap:16px;
  }
  .search-input-wrap{ position:relative; flex:1; }
  .search-input{
    width:100%; font-size:1.5rem; color:#222;
    border:none; border-bottom:2px solid #dcdcdc;
    padding:10px 40px 10px 0; outline:none;
  }
  .search-input::placeholder{ color:#9c9c9c; }
  .search-input:focus{ border-bottom-color:#333; }
  .search-icon-svg{
    position:absolute; right:0; top:50%; transform:translateY(-50%);
    width:22px; height:22px; color:#9c9c9c;
  }
  .search-close-btn{
    background:none; border:none; font-size:2rem; color:#777; cursor:pointer; line-height:1;
  }

  /* ----- แผ่นพื้นผลลัพธ์ ----- */
  .results-panel{
    position:fixed; top:84px; left:0; right:0; bottom:0; z-index:90;
    overflow:auto; padding:24px 16px;
  }
  .results-sheet{
    max-width:1100px; margin:0 auto;
    background:#fff; border-radius:14px;
    box-shadow:0 16px 40px rgba(0,0,0,.18); /* ลอยชัดขึ้น */
    padding:18px;
  }
  .results-grid{
    display:grid; gap:14px;
    grid-template-columns:repeat(auto-fill, minmax(340px, 1fr));
  }
  .results-empty{
    max-width:900px; margin:24px auto; color:#777; text-align:center;
  }
`;


function SearchStyles() { return <style>{searchStyles}</style>; }
function SearchIcon() {
  return (
    <svg className="search-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
    </svg>
  );
}

// ---------- Component ----------
export default function Search({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [term, setTerm]   = useState('');
  const [all, setAll]     = useState([]);   // รายการ active ทั้งหมด (realtime)

  // โฟกัสช่องค้นหาทันที + ปิดด้วย Esc
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // subscribe เฉพาะ listings ที่ active (แสดงผลแบบ realtime)
  useEffect(() => {
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc') // ถ้าขอ index ให้กดสร้างตามลิงก์ได้เลย
    );
    const unsub = onSnapshot(q, (snap) => {
      setAll(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // กรองฝั่ง client: title/desc/game (lowercase)
  const results = useMemo(() => {
    const s = term.trim().toLowerCase();
    if (!s) return all;
    return all.filter(it => {
      const title = String(it.title || '').toLowerCase();
      const desc  = String(it.desc  || '').toLowerCase();
      const game  = String(it.game  || '').toLowerCase();
      return title.includes(s) || desc.includes(s) || game.includes(s);
    });
  }, [all, term]);

  // Enter เพื่อไปหน้ารายการสินค้าทั้งหมด (ถ้ามี route นั้น)
  const onPressEnter = (e) => {
    if (e.key === 'Enter') {
      // ถ้าคุณมีหน้า /user/all-products ก็ navigate ได้
      // navigate('/user/all-products', { state: { q: term } });
      // ตอนนี้ให้คงอยู่ใน modal และแค่เลือกจากผลลัพธ์ได้เลย
    }
  };

  return (
    <>
      <SearchStyles />

      {/* พื้นหลัง: คลิกเพื่อปิด (ไม่ทำอย่างอื่น) */}
      <div className="search-backdrop" onClick={onClose}></div>

      {/* แถบค้นหา */}
      <div className="search-modal">
        <div className="search-container">
          <div className="search-input-wrap">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Im looking for....."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={onPressEnter}
            />
            <SearchIcon />
          </div>
          <button className="search-close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>
      </div>

      {/* ผลลัพธ์ */}
      <div className="results-panel" role="region" aria-label="Search results">
        {results.length === 0 ? (
          <div className="results-empty">ไม่พบผลลัพธ์{term ? ` สำหรับ “${term}”` : ''}</div>
        ) : (
          <div className="results-sheet">
            <div className="results-grid">
              {results.map(item => <ListingCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
