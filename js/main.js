function openLightbox(src) {
  const box = document.getElementById("lightbox");
  document.getElementById("lightboxImg").src = src;
  box.style.display = "flex";

  setTimeout(() => {
    box.classList.add("show");
  }, 10);
}

function closeLightbox() {
  const box = document.getElementById("lightbox");
  box.classList.remove("show");

  setTimeout(() => {
    box.style.display = "none";
  }, 300);
}

function productCard(product) {
  const firstVariant = product.variants[0];

  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${firstVariant.image}" alt="${product.name}">
      </a>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">RM${product.price.toFixed(2)}</p>
        <p>${product.desc}</p>
      </div>
    </div>
  `;
}

function renderHome() {
  const el = document.getElementById("homeProducts");

  if (!el) return;

  const newArrivals = products.filter(
    (product) =>
      product.category === "new-arrival" ||
      product.category === "polka-dots" ||
      product.category === "beaded" ||
      product.newArrival === true,
  );

  el.innerHTML = newArrivals.map(productCard).join("");
}

function renderCollections() {
  const el = document.getElementById("allProducts");

  if (!el) return;

  const search = document.getElementById("searchInput");
  const category = document.getElementById("categoryFilter");
  const sort = document.getElementById("sortFilter");

  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");

  if (categoryParam) {
    category.value = categoryParam;
  }

  function apply() {
    let list = [...products];

    const keyword = search.value.toLowerCase();

    if (keyword) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(keyword) ||
          product.desc.toLowerCase().includes(keyword) ||
          product.variants.some((variant) =>
            variant.color.toLowerCase().includes(keyword),
          ),
      );
    }

    if (category.value === "new-arrival") {
      list = list.filter(
        (product) =>
          product.category === "new-arrival" ||
          product.category === "polka-dots" ||
          product.category === "beaded" ||
          product.newArrival === true,
      );
    } else if (category.value !== "all") {
      list = list.filter((product) => product.category === category.value);
    }

    if (sort.value === "low") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort.value === "high") {
      list.sort((a, b) => b.price - a.price);
    }

    el.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<p>No products found.</p>`;
  }

  search.addEventListener("input", apply);
  category.addEventListener("input", apply);
  sort.addEventListener("input", apply);

  apply();
}

function getColourCode(color) {
  const colours = {
    "Soft Pink": "#f6b7d5",
    "Soft Purple": "#d9c7ff",
    "Soft Yellow": "#fff0b8",
    "Soft Green": "#dff0cf",

    "Soft Pink Polka": "#f6b7d5",
    "Soft Purple Polka": "#d9c7ff",
    "Soft Yellow Polka": "#fff0b8",
    "Soft Green Polka": "#dff0cf",
  };

  return colours[color] || "#ffffff";
}

function renderProductDetail() {
  const el = document.getElementById("productDetail");

  if (!el) return;

  const id = Number(new URLSearchParams(location.search).get("id")) || 1;

  const product = products.find((product) => product.id === id) || products[0];

  let selectedVariant = product.variants[0];
  let qty = 1;

  const showColourSwatches =
    product.category === "plain-shawl" ||
    product.category === "plain-square" ||
    product.category === "polka-dots";

  const showDesignButtons =
    product.category === "printed-shawl" ||
    product.category === "printed-square";

  el.innerHTML = `
    <div class="detail-img">
      <img
        id="mainProductImage"
        src="${selectedVariant.image}"
        alt="${product.name}">
    </div>

    <div class="detail-info">
      <p class="pill">RINELLA LUXE COLLECTION</p>

      <h1>${product.name}</h1>

      <p class="price">RM${product.price.toFixed(2)}</p><br>

      <p><b>${product.desc}</b></p>

      <ul>
        <li>Premium comfortable fabric</li>
        <li>Lightweight and breathable</li>
        <li>Easy to style for everyday looks</li>
        <li>Perfect match for your outfit</li>
      </ul><br>

      ${
        product.category !== "beaded"
          ? `
          <h4>
            ${showDesignButtons ? "Design" : "Colour"}:
            <span id="selectedColour">${selectedVariant.color}</span>
          </h4>

          <div class="${showColourSwatches ? "colour-options" : "design-options"}">
            ${
              showColourSwatches
                ? product.variants
                    .map(
                      (variant, index) => `
                  <button
                    class="colour-btn colour-swatch ${index === 0 ? "active" : ""}"
                    data-colour="${variant.color}"
                    data-image="${variant.image}"
                    style="background:${getColourCode(variant.color)}"
                    title="${variant.color}">
                  </button>
                `,
                    )
                    .join("")
                : product.variants
                    .map(
                      (variant, index) => `
                  <button
                    class="design-btn ${index === 0 ? "active" : ""}"
                    data-colour="${variant.color}"
                    data-image="${variant.image}">
                    ${variant.color}
                  </button>
                `,
                    )
                    .join("")
            }
          </div>
        `
          : ""
      }

      <div class="qty">
        <button id="minus">−</button>
        <span id="detailQty">1</span>
        <button id="plus">+</button>
      </div>

      <button class="btn" id="detailAdd">
        Add To Cart
      </button>
    </div>
  `;

  document.querySelectorAll(".colour-btn, .design-btn").forEach((button) => {
    button.addEventListener("click", function () {
      selectedVariant = {
        color: this.dataset.colour,
        image: this.dataset.image,
      };

      document.getElementById("mainProductImage").src = selectedVariant.image;

      const selectedText = document.getElementById("selectedColour");
      if (selectedText) {
        selectedText.textContent = selectedVariant.color;
      }

      document.querySelectorAll(".colour-btn, .design-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      this.classList.add("active");
    });
  });

  document.getElementById("plus").onclick = () => {
    qty++;
    document.getElementById("detailQty").textContent = qty;
  };

  document.getElementById("minus").onclick = () => {
    if (qty > 1) {
      qty--;
      document.getElementById("detailQty").textContent = qty;
    }
  };

  document.getElementById("detailAdd").onclick = () => {
    addToCart(product.id, selectedVariant.color, selectedVariant.image, qty);
  };

  const related = document.getElementById("relatedProducts");

  if (related) {
    related.innerHTML = products
      .filter((item) => item.id !== product.id)
      .slice(0, 4)
      .map(productCard)
      .join("");
  }
}

function initFAQ() {
  document.querySelectorAll(".accordion").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");

      const panel = button.nextElementSibling;

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
}

function initMenu() {
  const menu = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
  renderCollections();
  renderProductDetail();
  initFAQ();
  initMenu();
});
