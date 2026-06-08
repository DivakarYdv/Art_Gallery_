// ─────────────────────────────────────────────────────────────────────────────
// cart.js — shared cart utilities (loaded on every page)
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:3001/api';

// ── Cart Storage ──────────────────────────────────────────────────────────────

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('vg_cart') || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('vg_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(artwork) {
  const cart = getCart();
  const exists = cart.find(item => item.id === artwork.id);
  if (exists) {
    showToast(`"${artwork.title}" is already in your cart.`);
    return;
  }
  cart.push({
    id:        artwork.id,
    title:     artwork.title,
    artist:    artwork.artist,
    price:     artwork.price,
    image_url: artwork.image_url,
    quantity:  1,
  });
  saveCart(cart);
  showToast(`<span class="toast-accent">${artwork.title}</span> added to cart.`);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem('vg_cart');
  updateCartBadge();
}

// ── Cart Badge ────────────────────────────────────────────────────────────────

function updateCartBadge() {
  const count = getCart().length;
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = count;
  badge.classList.toggle('visible', count > 0);
}

// ── Toast ─────────────────────────────────────────────────────────────────────

let toastTimer = null;

function showToast(html) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = html;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Format price ──────────────────────────────────────────────────────────────

function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

// ── Init badge on page load ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', updateCartBadge);
