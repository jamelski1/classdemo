// ===== Menu Data =====
const menuItems = [
  // Scoops
  { id: 1,  name: "Classic Vanilla",      category: "scoops",   price: 3.50, emoji: "\uD83C\uDF68", desc: "Smooth, creamy Madagascar vanilla" },
  { id: 2,  name: "Chocolate Fudge",      category: "scoops",   price: 3.50, emoji: "\uD83C\uDF6B", desc: "Rich double-chocolate goodness" },
  { id: 3,  name: "Strawberry Swirl",     category: "scoops",   price: 3.75, emoji: "\uD83C\uDF53", desc: "Real strawberry pieces in every bite" },
  { id: 4,  name: "Mint Chip",            category: "scoops",   price: 3.75, emoji: "\uD83C\uDF3F", desc: "Cool mint loaded with chocolate chips" },
  { id: 5,  name: "Cookie Dough",         category: "scoops",   price: 4.00, emoji: "\uD83C\uDF6A", desc: "Chunks of raw cookie dough in vanilla" },
  { id: 6,  name: "Mango Sorbet",         category: "scoops",   price: 3.75, emoji: "\uD83E\uDD6D", desc: "Dairy-free tropical mango refresher" },

  // Sundaes
  { id: 7,  name: "Hot Fudge Sundae",     category: "sundaes",  price: 6.50, emoji: "\uD83C\uDF6E", desc: "Vanilla scoops, hot fudge, whipped cream & cherry" },
  { id: 8,  name: "Banana Split",         category: "sundaes",  price: 7.00, emoji: "\uD83C\uDF4C", desc: "Three scoops, banana, all the toppings" },
  { id: 9,  name: "Caramel Crunch Sundae",category: "sundaes",  price: 6.75, emoji: "\uD83E\uDD64", desc: "Caramel drizzle with crunchy praline bits" },

  // Shakes
  { id: 10, name: "Vanilla Milkshake",    category: "shakes",   price: 5.50, emoji: "\uD83E\uDD5B", desc: "Thick & creamy classic vanilla shake" },
  { id: 11, name: "Chocolate Milkshake",  category: "shakes",   price: 5.50, emoji: "\uD83E\uDDCB", desc: "Blended chocolate ice cream perfection" },
  { id: 12, name: "Strawberry Milkshake", category: "shakes",   price: 5.75, emoji: "\uD83C\uDF77", desc: "Fresh strawberry & ice cream bliss" },
  { id: 13, name: "Oreo Milkshake",       category: "shakes",   price: 6.00, emoji: "\uD83E\uDD5B", desc: "Cookies & cream blended thick" },

  // Toppings
  { id: 14, name: "Sprinkles",            category: "toppings", price: 0.75, emoji: "\uD83C\uDF80", desc: "Rainbow sprinkles for extra fun" },
  { id: 15, name: "Whipped Cream",        category: "toppings", price: 0.50, emoji: "\u2601\uFE0F",  desc: "A fluffy cloud of whipped cream" },
  { id: 16, name: "Chocolate Sauce",      category: "toppings", price: 0.75, emoji: "\uD83C\uDF6B", desc: "Drizzle of rich chocolate sauce" },
  { id: 17, name: "Gummy Bears",          category: "toppings", price: 1.00, emoji: "\uD83D\uDC3B", desc: "A handful of chewy gummy bears" },
];

// ===== State =====
let cart = [];

// ===== DOM References =====
const menuGrid          = document.getElementById("menuGrid");
const cartBtn           = document.getElementById("cartBtn");
const cartCount         = document.getElementById("cartCount");
const cartSidebar       = document.getElementById("cartSidebar");
const cartOverlay       = document.getElementById("cartOverlay");
const cartClose         = document.getElementById("cartClose");
const cartItemsEl       = document.getElementById("cartItems");
const cartTotalEl       = document.getElementById("cartTotal");
const checkoutBtn       = document.getElementById("checkoutBtn");
const orderForm         = document.getElementById("orderForm");
const orderSummaryItems = document.getElementById("orderSummaryItems");
const orderTotalEl      = document.getElementById("orderTotal");
const confirmationModal = document.getElementById("confirmationModal");
const confirmationMsg   = document.getElementById("confirmationMsg");
const modalCloseBtn     = document.getElementById("modalClose");
const filterBtns        = document.querySelectorAll(".filter-btn");

// ===== Render Menu =====
function renderMenu(filter = "all") {
  const items = filter === "all"
    ? menuItems
    : menuItems.filter(i => i.category === filter);

  menuGrid.innerHTML = items.map(item => `
    <div class="menu-card" data-category="${item.category}">
      <div class="card-image ${item.category}">${item.emoji}</div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <span class="card-price">$${item.price.toFixed(2)}</span>
          <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to cart">+</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ===== Cart Logic =====
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
}

function removeFromCart(id) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].qty -= 1;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCart() {
  const total = getCartTotal();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  // Badge
  cartCount.textContent = count;

  // Sidebar items
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Add some ice cream!</p>';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji}</span>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="remove" data-id="${item.id}">&minus;</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="add" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join("");
  }

  // Sidebar total
  cartTotalEl.textContent = "$" + total.toFixed(2);

  // Order summary (in form)
  updateOrderSummary();
}

function updateOrderSummary() {
  if (cart.length === 0) {
    orderSummaryItems.innerHTML = '<p style="color:#9ca3af;font-size:0.9rem;">No items yet.</p>';
    orderTotalEl.textContent = "$0.00";
    return;
  }
  orderSummaryItems.innerHTML = cart.map(item => `
    <div class="order-summary-item">
      <span>${item.emoji} ${item.name} x${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join("");
  orderTotalEl.textContent = "$" + getCartTotal().toFixed(2);
}

// ===== Cart Sidebar Toggle =====
function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
}

// ===== Event Listeners =====

// Add to cart from menu
menuGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const id = parseInt(btn.dataset.id, 10);
  addToCart(id);

  // Quick animation
  btn.style.transform = "scale(1.3)";
  setTimeout(() => btn.style.transform = "", 200);
});

// Cart sidebar quantity buttons
cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".qty-btn");
  if (!btn) return;
  const id = parseInt(btn.dataset.id, 10);
  if (btn.dataset.action === "add") addToCart(id);
  else removeFromCart(id);
});

// Open / close cart
cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout button closes sidebar & scrolls to form
checkoutBtn.addEventListener("click", (e) => {
  closeCart();
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(btn.dataset.filter);
  });
});

// Order form submission
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty! Add some ice cream before ordering.");
    return;
  }

  const name  = document.getElementById("name").value.trim();
  const room  = document.getElementById("room").value.trim();
  const building = document.getElementById("building").value;
  const time  = document.getElementById("deliveryTime").value;

  confirmationMsg.textContent =
    `Thanks, ${name}! Your ice cream order ($${getCartTotal().toFixed(2)}) is on its way to ${room}, ${building} at ${time}.`;

  confirmationModal.classList.add("open");

  // Reset
  cart = [];
  updateCart();
  orderForm.reset();
});

// Close confirmation modal
modalCloseBtn.addEventListener("click", () => {
  confirmationModal.classList.remove("open");
});

confirmationModal.addEventListener("click", (e) => {
  if (e.target === confirmationModal) {
    confirmationModal.classList.remove("open");
  }
});

// ===== Init =====
renderMenu();
updateCart();
