// ─────────────────────────────────────────────────────────────────────────────
// gallery.js — fetches artworks from the API and renders the gallery grid
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', loadGallery);

async function loadGallery() {
  const grid = document.getElementById('gallery-grid');

  try {
    const res = await fetch(`${API_BASE}/artworks`);
    if (!res.ok) throw new Error('Server error');
    const artworks = await res.json();

    // Update stat counters
    const statCount = document.getElementById('stat-count');
    const galleryCount = document.getElementById('gallery-count');
    if (statCount) statCount.textContent = artworks.length;
    if (galleryCount) galleryCount.textContent = `${artworks.length} works`;

    // Clear skeletons
    grid.innerHTML = '';
    grid.setAttribute('aria-busy', 'false');

    if (!artworks.length) {
      grid.innerHTML = `
        <div class="error-state" style="grid-column:1/-1">
          <h3>No artworks available</h3>
          <p>Check back soon for new additions.</p>
        </div>`;
      return;
    }

    // Render each artwork card
    artworks.forEach(art => {
      const card = createArtworkCard(art);
      grid.appendChild(card);
    });

  } catch (err) {
    console.error('Gallery load error:', err);
    grid.innerHTML = `
      <div class="error-state" style="grid-column:1/-1">
        <h3>Unable to load gallery</h3>
        <p>Make sure the backend server is running on port 3001.</p>
        <p style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-faint)">${err.message}</p>
      </div>`;
  }
}

function createArtworkCard(art) {
  const card = document.createElement('article');
  card.className = 'artwork-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `${art.title} by ${art.artist}`);

  card.innerHTML = `
    <div class="artwork-card-image">
      <img
        src="${art.image_url}"
        alt="${art.title} by ${art.artist}"
        loading="lazy"
        onerror="this.src='https://picsum.photos/seed/${art.id}/600/750'"
      />
      <div class="artwork-card-overlay">
        <span class="overlay-btn" aria-hidden="true">View work</span>
      </div>
    </div>
    <div class="artwork-card-body">
      <p class="artwork-card-meta">${art.medium || 'Original work'} · ${art.year || 2024}</p>
      <h3 class="artwork-card-title">${art.title}</h3>
      <p class="artwork-card-artist">${art.artist}</p>
      <div class="artwork-card-footer">
        <span class="artwork-card-price">${formatPrice(art.price)}</span>
        <button
          class="btn-add-cart"
          aria-label="Add ${art.title} to cart"
          data-id="${art.id}"
        >Add to cart</button>
      </div>
    </div>`;

  // Navigate to detail page on card click (excluding button)
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-add-cart')) {
      window.location.href = `artwork.html?id=${art.id}`;
    }
  });

  // Add to cart button
  card.querySelector('.btn-add-cart').addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(art);
  });

  return card;
}
