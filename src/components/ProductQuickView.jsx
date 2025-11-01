// src/components/ProductQuickView.jsx
import React, { useEffect } from "react";

const css = `
.pqv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(2px);
  z-index: 200;
}
.pqv-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.3);
  z-index: 210;
  overflow: hidden;
}
.pqv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #eee;
}
.pqv-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}
.pqv-close {
  background: none;
  border: none;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  color: #666;
}
.pqv-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  padding: 18px;
}
@media (max-width: 720px) {
  .pqv-body {
    grid-template-columns: 1fr;
  }
}
.pqv-img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  background: #f6f6f6;
}
.pqv-price {
  font-size: 22px;
  font-weight: 800;
  margin: 8px 0;
}
.pqv-desc {
  white-space: pre-wrap;
  color: #444;
}
.pqv-cta {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}
.pqv-btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}
.pqv-primary {
  background: #2d8cf0;
  color: #fff;
}
.pqv-secondary {
  background: #eee;
}
`;

export default function ProductQuickView({ item, onClose, onAddToCart }) {
  if (!item) return null;

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const img =
    (Array.isArray(item.images) && item.images[0]) ||
    item.image ||
    "https://via.placeholder.com/640x480?text=No+Image";

  return (
    <>
      <style>{css}</style>
      <div className="pqv-backdrop" onClick={onClose}></div>
      <div className="pqv-modal">
        <div className="pqv-header">
          <h3 className="pqv-title">{item.title || "Untitled"}</h3>
          <button className="pqv-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="pqv-body">
          <img className="pqv-img" src={img} alt={item.title} />
          <div>
            <div style={{ opacity: 0.7, marginBottom: 6 }}>{item.game || "-"}</div>
            <div className="pqv-price">
              ฿{Number(item.price || 0).toLocaleString()}
            </div>
            <div className="pqv-desc">{item.desc || "No description"}</div>

            <div className="pqv-cta">
              {item.status === "sold" ? (
                <button className="pqv-btn pqv-secondary" disabled>
                  SOLD
                </button>
              ) : (
                <button className="pqv-btn pqv-primary" onClick={() => onAddToCart?.(item)}>
                  ADD TO CART
                </button>
              )}
              <button className="pqv-btn pqv-secondary" onClick={onClose}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
