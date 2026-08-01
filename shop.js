/* ==========================================================================
   BLOOMING PETALS - E-Commerce & Shop Engine (shop.js)
   ========================================================================== */

// Master Products Catalog
const PRODUCTS = [
  {
    id: 'p1',
    title: 'Velvet Romance Rose Bouquet',
    category: 'Roses',
    price: 69.99,
    oldPrice: 89.99,
    rating: 5,
    reviews: 142,
    image: 'images/cat-roses.jpg',
    badge: 'Best Seller',
    description: 'A luxurious hand-tied arrangement of 24 premium deep red and blush pink velvet roses finished with eucalyptus greenery.'
  },
  {
    id: 'p2',
    title: 'Royal White Casablanca Lilies',
    category: 'Lilies',
    price: 74.99,
    oldPrice: 94.99,
    rating: 4.9,
    reviews: 98,
    image: 'images/cat-lilies.jpg',
    badge: 'Popular',
    description: 'Fragrant pure white Casablanca lilies paired with delicate baby’s breath in a crystal clear vase.'
  },
  {
    id: 'p3',
    title: 'Pastel Dutch Tulip Symphony',
    category: 'Tulips',
    price: 54.99,
    oldPrice: 69.99,
    rating: 4.8,
    reviews: 110,
    image: 'images/cat-tulips.jpg',
    badge: 'Fresh Daily',
    description: 'Directly imported Dutch tulips featuring soft lavender, pale pink, and lemon yellow stems.'
  },
  {
    id: 'p4',
    title: 'Majestic Imperial Orchids',
    category: 'Orchids',
    price: 89.99,
    oldPrice: 119.99,
    rating: 5,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80',
    badge: 'Exotic',
    description: 'Graceful multi-stemmed Phalaenopsis orchids presented in a matte white ceramic designer pot.'
  },
  {
    id: 'p5',
    title: 'Golden Horizon Sunflowers',
    category: 'Sunflowers',
    price: 49.99,
    oldPrice: 59.99,
    rating: 4.9,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
    badge: 'Sunny Choice',
    description: 'Bright golden sunflowers bundled with rustic burlap wrapping and wild daisies.'
  },
  {
    id: 'p6',
    title: 'Grand Opulence Mixed Bouquet',
    category: 'Mixed',
    price: 99.99,
    oldPrice: 129.99,
    rating: 5,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    badge: 'Signature',
    description: 'Our master florist’s masterpiece combining garden roses, hydrangeas, lisianthus, and gold-dusted foliage.'
  },
  {
    id: 'p7',
    title: 'Blush & Cashmere Rose Box',
    category: 'Roses',
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.9,
    reviews: 73,
    image: 'images/hero-bg.jpg',
    badge: 'Luxury Box',
    description: 'Hand-picked soft pink roses preserved in a rounded velvet gift box.'
  },
  {
    id: 'p8',
    title: 'Spring Garden Tulip Dream',
    category: 'Tulips',
    price: 59.99,
    oldPrice: 75.00,
    rating: 4.7,
    reviews: 51,
    image: 'images/cat-tulips.jpg',
    badge: 'Limited',
    description: 'Vibrant spring tulips hand-wrapped in eco-friendly parchment paper.'
  }
];

// State Management
let cart = JSON.parse(localStorage.getItem('bp_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('bp_wishlist')) || [];
let activeQuickViewProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  initFilterTabs();
  initCategoryCardsClick();
  initSearchSystem();
  initCartDrawer();
  initWishlistDrawer();
  initQuickViewModal();
  updateCartUI();
  updateWishlistUI();
});

/* Render Product Grid Cards */
function renderProducts(filterCategory = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = filterCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

  grid.innerHTML = filtered.map(product => {
    const isWishlisted = wishlist.some(id => id === product.id);

    return `
      <div class="product-card glass-card reveal active" data-id="${product.id}">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.title}">
          <span class="product-badge">${product.badge}</span>
          <div class="product-actions">
            <button class="action-icon wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" aria-label="Add to Wishlist">
              <i class="${isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
            </button>
            <button class="action-icon quickview-btn" onclick="openQuickView('${product.id}')" aria-label="Quick View">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>

        <div class="product-content">
          <div class="product-rating">
            ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating))}
            <span>(${product.reviews})</span>
          </div>
          <h3 class="product-title">${product.title}</h3>
          <div class="product-price-wrap">
            <span class="product-price">$${product.price.toFixed(2)} <del>$${product.oldPrice.toFixed(2)}</del></span>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-cart-plus"></i> Add To Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* Filter Tabs Handler */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.getAttribute('data-filter');
      renderProducts(filter);
    });
  });
}

/* Category Card Click -> Scroll & Filter */
function initCategoryCardsClick() {
  const cards = document.querySelectorAll('.category-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      const targetTab = document.querySelector(`.tab-btn[data-filter="${cat}"]`);
      if (targetTab) targetTab.click();
      const shopSection = document.getElementById('best-sellers');
      if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* Live Search Modal & Filtering */
function initSearchSystem() {
  const trigger = document.getElementById('searchTrigger');
  const modal = document.getElementById('searchModal');
  const closeBtn = document.getElementById('searchClose');
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('searchResults');

  if (!modal || !input) return;

  trigger.addEventListener('click', () => {
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (query.length === 0) {
      resultsContainer.innerHTML = `<p class="text-center" style="color: var(--text-muted);">Start typing to find fresh flowers...</p>`;
      return;
    }

    const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p class="text-center" style="color: var(--text-muted);">No flowers found matching "${query}"</p>`;
    } else {
      resultsContainer.innerHTML = matches.map(m => `
        <div class="search-item" onclick="openQuickView('${m.id}'); document.getElementById('searchModal').classList.remove('active');">
          <img src="${m.image}" alt="${m.title}">
          <div>
            <strong style="display:block;">${m.title}</strong>
            <span style="color: var(--primary); font-weight:700;">$${m.price.toFixed(2)}</span>
          </div>
        </div>
      `).join('');
    }
  });
}

/* Cart Engine */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();

  if (window.showToast) {
    window.showToast(`${product.title} added to cart!`, 'fa-bag-shopping');
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('bp_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const drawerCount = document.getElementById('cartDrawerCount');
  const cartList = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (badge) badge.innerText = totalCount;
  if (drawerCount) drawerCount.innerText = totalCount;
  if (subtotalEl) subtotalEl.innerText = `$${totalSubtotal.toFixed(2)}`;

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-center" style="color: var(--text-muted); margin-top: 30px;">Your cart is currently empty.</p>`;
  } else {
    cartList.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
            <span style="font-size: 0.9rem; font-weight: 600;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart('${item.id}')" style="color: var(--text-light); font-size: 1.1rem;"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `).join('');
  }
}

function initCartDrawer() {
  const trigger = document.getElementById('cartTrigger');
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('cartClose');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!drawer || !overlay) return;

  trigger.addEventListener('click', openCartDrawer);
  closeBtn.addEventListener('click', closeCartDrawer);
  overlay.addEventListener('click', () => {
    closeCartDrawer();
    closeWishlistDrawer();
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        if (window.showToast) window.showToast('Your cart is empty!', 'fa-circle-exclamation');
        return;
      }
      if (window.showToast) window.showToast('Redirecting to SSL Secure Checkout...', 'fa-lock');
      setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        closeCartDrawer();
        if (window.showToast) window.showToast('Thank you for your purchase order!', 'fa-circle-check');
      }, 1500);
    });
  }
}

function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('drawerOverlay')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('drawerOverlay')?.classList.remove('active');
}

/* Wishlist Engine */
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    if (window.showToast && product) window.showToast(`Removed ${product.title} from Wishlist`, 'fa-heart-crack');
  } else {
    wishlist.push(productId);
    if (window.showToast && product) window.showToast(`Added ${product.title} to Wishlist!`, 'fa-heart');
  }

  saveWishlist();
  updateWishlistUI();
  renderProducts(document.querySelector('.tab-btn.active')?.getAttribute('data-filter') || 'all');
}

function saveWishlist() {
  localStorage.setItem('bp_wishlist', JSON.stringify(wishlist));
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  const drawerCount = document.getElementById('wishlistDrawerCount');
  const list = document.getElementById('wishlistItemsList');

  if (badge) badge.innerText = wishlist.length;
  if (drawerCount) drawerCount.innerText = wishlist.length;

  if (!list) return;

  const items = PRODUCTS.filter(p => wishlist.includes(p.id));

  if (items.length === 0) {
    list.innerHTML = `<p class="text-center" style="color: var(--text-muted); margin-top: 30px;">No favorite flowers saved yet.</p>`;
  } else {
    list.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <button class="btn btn-primary" onclick="addToCart('${item.id}'); toggleWishlist('${item.id}');" style="padding: 6px 12px; font-size: 0.8rem;">Move to Cart</button>
      </div>
    `).join('');
  }
}

function initWishlistDrawer() {
  const trigger = document.getElementById('wishlistTrigger');
  const drawer = document.getElementById('wishlistDrawer');
  const closeBtn = document.getElementById('wishlistClose');
  const continueBtn = document.getElementById('wishlistCloseBtn');

  if (!drawer) return;

  trigger.addEventListener('click', () => {
    drawer.classList.add('active');
    document.getElementById('drawerOverlay')?.classList.add('active');
  });

  const closeWishlist = () => {
    drawer.classList.remove('active');
    document.getElementById('drawerOverlay')?.classList.remove('active');
  };

  closeBtn?.addEventListener('click', closeWishlist);
  continueBtn?.addEventListener('click', closeWishlist);
}

function closeWishlistDrawer() {
  document.getElementById('wishlistDrawer')?.classList.remove('active');
}

/* Quick View Modal */
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  activeQuickViewProduct = product;

  document.getElementById('qvImg').src = product.image;
  document.getElementById('qvBadge').innerText = product.badge;
  document.getElementById('qvTitle').innerText = product.title;
  document.getElementById('qvPrice').innerText = `$${product.price.toFixed(2)}`;
  document.getElementById('qvDesc').innerText = product.description;
  document.getElementById('qvRating').innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating)) + ` <span>(${product.reviews} Reviews)</span>`;

  document.getElementById('quickviewModal')?.classList.add('active');
}

function initQuickViewModal() {
  const modal = document.getElementById('quickviewModal');
  const closeBtn = document.getElementById('qvClose');
  const addBtn = document.getElementById('qvAddToCartBtn');

  if (!modal) return;

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });

  addBtn?.addEventListener('click', () => {
    if (activeQuickViewProduct) {
      addToCart(activeQuickViewProduct.id);
      modal.classList.remove('active');
    }
  });
}
