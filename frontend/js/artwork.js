// ─────────────────────────────────────────────────────────────────────────────
// artwork.js — fetches and renders a single artwork detail page
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', loadArtwork);

async function loadArtwork() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'index.html';
    return;
  }

  const container = document.getElementById('artwork-content');

  try {
    const res = await fetch(`${API_BASE}/artworks/${id}`);
    if (!res.ok) throw new Error(res.status === 404 ? 'Artwork not found' : 'Server error');
    const art = await res.json();

    // Update page title
    document.title = `${art.title} — Vernissage`;

    // Render detail view
    container.innerHTML = `
      <div class="artwork-detail-grid">

        <div class="artwork-detail-image">
          <img
            src="${art.image_url}"
            alt="${art.title} by ${art.artist}"
            onerror="this.src='https://picsum.photos/seed/${art.id}/600/750'"
          />
        </div>

        <div class="artwork-detail-info">
          <p class="artwork-detail-eyebrow">${art.medium || 'Original work'}</p>
          <h1 class="artwork-detail-title">${art.title}</h1>
          <p class="artwork-detail-artist">${art.artist}${art.year ? `, ${art.year}` : ''}</p>

          <p class="artwork-detail-description">
            ${art.description || 'No description available for this work.'}
          </p>

          <div class="artwork-specs" aria-label="Artwork specifications">
            <div>
              <p class="spec-label">Medium</p>
              <p class="spec-value">${art.medium || '—'}</p>
            </div>
            <div>
              <p class="spec-label">Dimensions</p>
              <p class="spec-value">${art.dimensions || '—'}</p>
            </div>
            <div>
              <p class="spec-label">Year</p>
              <p class="spec-value">${art.year || '—'}</p>
            </div>
            <div>
              <p class="spec-label">Availability</p>
              <p class="spec-value" style="color:${art.available ? '#7cbf7c' : '#e05454'}">
                ${art.available ? 'Available' : 'Sold'}
              </p>
            </div>
          </div>

          <p class="artwork-detail-price">${formatPrice(art.price)}</p>

          ${art.available ? `
            <button class="btn-primary" id="detail-add-cart" aria-label="Add ${art.title} to cart">
              Add to Cart
            </button>
            <button class="btn-secondary" onclick="window.location.href='cart.html'">
              View Cart
            </button>
          ` : `
            <button class="btn-primary" disabled style="opacity:0.4;cursor:not-allowed">
              Sold — No longer available
            </button>
          `}
        </div>
      </div>`;

    // Wire up Add to Cart button
    const addBtn = document.getElementById('detail-add-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => addToCart(art));
    }

  } catch (err) {
    console.error('Artwork load error:', err);
    container.innerHTML = `
      <div class="error-state">
        <h3>${err.message === 'Artwork not found' ? 'Artwork not found' : 'Failed to load artwork'}</h3>
        <p style="margin-top:0.5rem">
          <a href="index.html" style="color:var(--accent)">← Return to gallery</a>
        </p>
      </div>`;
  }
}
