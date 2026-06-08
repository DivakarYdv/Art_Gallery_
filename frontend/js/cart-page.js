// ─────────────────────────────────────────────────────────────────────────────
// cart-page.js — renders the cart page and handles order submission
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', initCartPage);

function initCartPage() {
  renderCartPage();

  // Submit order
  const submitBtn = document.getElementById('submit-order');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmitOrder);
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderCartPage() {
  const cart = getCart();
  const emptyEl  = document.getElementById('cart-empty');
  const layoutEl = document.getElementById('cart-layout');

  if (!cart.length) {
    if (emptyEl)  emptyEl.style.display  = 'block';
    if (layoutEl) layoutEl.style.display = 'none';
    return;
  }

  if (emptyEl)  emptyEl.style.display  = 'none';
  if (layoutEl) layoutEl.style.display = 'grid';

  renderCartItems(cart);
  renderSummary(cart);
}

function renderCartItems(cart) {
  const container = document.getElementById('cart-items');
  if (!container) return;

  container.innerHTML = cart.map(item => `
    <div class="cart-item" role="listitem" aria-label="${item.title} by ${item.artist}">
      <div class="cart-item-image">
        <img
          src="${item.image_url}"
          alt="${item.title}"
          onerror="this.src='https://picsum.photos/seed/${item.id}/200/250'"
        />
      </div>
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-artist">${item.artist}</p>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
      </div>
      <button
        class="cart-item-remove"
        aria-label="Remove ${item.title} from cart"
        onclick="handleRemoveItem(${item.id})"
      >Remove</button>
    </div>
  `).join('');
}

function renderSummary(cart) {
  const rowsEl  = document.getElementById('summary-rows');
  const totalEl = document.getElementById('summary-total');
  if (!rowsEl || !totalEl) return;

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  rowsEl.innerHTML = cart.map(item => `
    <div class="summary-row">
      <span>${item.title}</span>
      <span>${formatPrice(item.price)}</span>
    </div>
  `).join('');

  totalEl.textContent = formatPrice(total);
}

// ── Remove item ───────────────────────────────────────────────────────────────

function handleRemoveItem(id) {
  removeFromCart(id);
  renderCartPage();
}

// ── Submit Order ──────────────────────────────────────────────────────────────

async function handleSubmitOrder() {
  const nameInput  = document.getElementById('buyer-name');
  const emailInput = document.getElementById('buyer-email');
  const submitBtn  = document.getElementById('submit-order');

  const name  = nameInput.value.trim();
  const email = emailInput.value.trim();

  // Validate
  let valid = true;

  if (!name) {
    nameInput.classList.add('error');
    document.getElementById('name-error').classList.add('visible');
    valid = false;
  } else {
    nameInput.classList.remove('error');
    document.getElementById('name-error').classList.remove('visible');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    emailInput.classList.add('error');
    document.getElementById('email-error').classList.add('visible');
    valid = false;
  } else {
    emailInput.classList.remove('error');
    document.getElementById('email-error').classList.remove('visible');
  }

  if (!valid) return;

  const cart = getCart();
  if (!cart.length) {
    showToast('Your cart is empty.');
    return;
  }

  // Disable button while submitting
  submitBtn.textContent = 'Placing order…';
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer_name:  name,
        buyer_email: email,
        items: cart.map(item => ({
          artwork_id: item.id,
          quantity:   item.quantity,
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Order failed');

    // Success
    clearCart();
    renderCartPage();

    // Show success message
    const container = document.getElementById('cart-empty');
    if (container) {
      container.style.display = 'block';
      container.innerHTML = `
        <h3 style="color:var(--accent)">Order placed — thank you, ${name}!</h3>
        <p style="margin-top:0.5rem">
          A confirmation has been sent to <strong>${email}</strong>.
          Total: <strong>${formatPrice(data.total)}</strong>.
        </p>
        <a href="index.html">← Browse more works</a>`;
    }

    showToast('Order placed successfully!');

  } catch (err) {
    console.error('Order error:', err);
    showToast(`Order failed: ${err.message}`);
    submitBtn.textContent = 'Place Order';
    submitBtn.disabled = false;
  }
}
