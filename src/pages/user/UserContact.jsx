// src/pages/user/UserContact.jsx
import React, { useState } from 'react';
import { alertSuccess, alertError, alertConfirm } from '../../lib/alert.js';

export default function UserContact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📩 ส่งข้อมูล:', form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <main style={{ padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 20 }}>📞 Contact Us</h1>

      <p style={{ fontSize: '1.05rem', color: '#444', marginBottom: 20 }}>
        หากคุณมีคำถาม ข้อเสนอแนะ หรือต้องการติดต่อเกี่ยวกับคำสั่งซื้อ โปรดกรอกแบบฟอร์มด้านล่าง
        หรือใช้ข้อมูลการติดต่อด้านขวามือ
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* ===== Form ===== */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <label>
            ชื่อของคุณ:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ccc',
                marginTop: 4,
              }}
            />
          </label>

          <label>
            อีเมลติดต่อ:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ccc',
                marginTop: 4,
              }}
            />
          </label>

          <label>
            ข้อความของคุณ:
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ccc',
                marginTop: 4,
                resize: 'none',
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              background: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              letterSpacing: '.3px',
              marginTop: 6,
            }}
          >
            ส่งข้อความ
          </button>

          {submitted && (
            <div
              style={{
                background: '#d1ffd1',
                color: '#075b07',
                padding: '10px',
                borderRadius: 8,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              ✅ ข้อความของคุณถูกส่งเรียบร้อยแล้ว (จำลอง)
            </div>
          )}
        </form>

        {/* ===== Contact Info ===== */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ marginBottom: 12 }}>ข้อมูลติดต่อร้าน Mustode Shop</h3>
          <p style={{ margin: '4px 0' }}>
            🏠 ที่อยู่: 99 ถนนบางแสน อำเภอเมือง ชลบุรี 20131
          </p>
          <p style={{ margin: '4px 0' }}>
            📞 โทร: <a href="tel:0912345678">091-234-5678</a>
          </p>
          <p style={{ margin: '4px 0' }}>
            ✉️ อีเมล: <a href="mailto:contact@mustodeshop.com">contact@mustodeshop.com</a>
          </p>
          <p style={{ margin: '4px 0' }}>🕒 เวลาทำการ: ทุกวัน 9:00 - 18:00 น.</p>
          <hr style={{ margin: '16px 0' }} />
          <p style={{ color: '#666' }}>
            💬 Facebook: <a href="#">fb.com/mustodeshop</a><br />
            📸 Instagram: <a href="#">@mustodeshop</a>
          </p>
        </div>
      </div>
    </main>
  );
}
