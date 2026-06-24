function getCart() {
  return JSON.parse(localStorage.getItem("rinellaCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("rinellaCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();

  const count = cart.reduce((sum, item) => {
    return sum + item.qty;
  }, 0);

  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = count;
  });
}

function addToCart(id, color, image, qty = 1) {
  const product = products.find((product) => product.id === id);

  if (!product) {
    alert("Product not found");
    return;
  }

  const cart = getCart();

  const existingItem = cart.find(
    (item) => item.id === id && item.color === color,
  );

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      color: color,
      image: image,
      qty: qty,
    });
  }

  saveCart(cart);
  alert(product.name + " - " + color + " added to cart!");
}

function removeFromCart(id, color) {
  const cart = getCart().filter(
    (item) => !(item.id === id && item.color === color),
  );

  saveCart(cart);
  renderCartPage();
}

function changeQty(id, color, change) {
  const cart = getCart();

  const item = cart.find((item) => item.id === id && item.color === color);

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    const updatedCart = cart.filter(
      (item) => !(item.id === id && item.color === color),
    );

    saveCart(updatedCart);
  } else {
    saveCart(cart);
  }

  renderCartPage();
}

function renderCartPage() {
  const container = document.getElementById("cartItems");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Start matching your favourite hijabs now.</p>
        <br>
        <a class="btn" href="collections.html">Shop Collections</a>
      </div>
    `;

    document.getElementById("subtotal").textContent = "RM0.00";
    document.getElementById("shipping").textContent = "RM0.00";
    document.getElementById("total").textContent = "RM0.00";

    return;
  }

  let subtotal = 0;

  container.innerHTML = cart
    .map((item) => {
      subtotal += item.price * item.qty;

      return `
      <div class="cart-item">

        <div class="cart-thumb">
          <img src="${item.image}" alt="${item.name}">
        </div>

        <div>
          <h3>${item.name}</h3>
          <p>Colour: ${item.color}</p>
          <p>RM${item.price.toFixed(2)}</p>
        </div>

        <div>
          <div class="qty-control">
            <button onclick="changeQty(${item.id}, '${item.color}', -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, '${item.color}', 1)">+</button>
          </div>

          <br>

          <button
            class="remove-btn"
            onclick="removeFromCart(${item.id}, '${item.color}')">
            Remove
          </button>
        </div>

      </div>
    `;
    })
    .join("");

  const shipping = subtotal >= 150 ? 0 : 8;

  document.getElementById("subtotal").textContent = "RM" + subtotal.toFixed(2);

  document.getElementById("shipping").textContent =
    shipping === 0 ? "FREE" : "RM" + shipping.toFixed(2);

  document.getElementById("total").textContent =
    "RM" + (subtotal + shipping).toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();

  const checkout = document.getElementById("checkoutBtn");

  if (checkout) {
    checkout.addEventListener("click", () => {
      if (getCart().length === 0) {
        alert("Your cart is empty.");
        return;
      }

      window.location.href = "checkout.html";
    });
  }
});
