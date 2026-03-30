"use client";

export function toast(message: string) {
  // Simple toast implementation
  const el = document.createElement("div");
  el.textContent = message;
  el.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: #1f2937; color: white; padding: 12px 20px;
    border-radius: 12px; font-size: 14px; font-weight: 500;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(() => document.body.removeChild(el), 300);
  }, 2500);
}
