const categoryButtons = document.querySelectorAll('.filter-button');
const sizeFilter = document.getElementById('filter-size');
const materialFilter = document.getElementById('filter-material');
const colorFilter = document.getElementById('filter-color');
const productCards = document.querySelectorAll('.product-card');
const cartItemsElement = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const shippingCostElement = document.getElementById('shipping-cost');
const shippingMethod = document.getElementById('shipping-method');

const shippingRates = {
  postnord: 49,
  earlybird: 79,
  dhl: 59,
};

let cart = [];

function matchesFilter(card) {
  const category = card.dataset.category;
  const size = card.dataset.size;
  const material = card.dataset.material;
  const color = card.dataset.color;

  const selectedCategory = document.querySelector('.filter-button.active').dataset.filter;
  const selectedSize = sizeFilter.value;
  const selectedMaterial = materialFilter.value;
  const selectedColor = colorFilter.value;

  const matchCategory = selectedCategory === 'all' || category === selectedCategory;
  const matchSize = selectedSize === 'all' || size === selectedSize;
  const matchMaterial = selectedMaterial === 'all' || material === selectedMaterial;
  const matchColor = selectedColor === 'all' || color === selectedColor;

  return matchCategory && matchSize && matchMaterial && matchColor;
}

function updateFilters() {
  productCards.forEach((card) => {
    card.style.display = matchesFilter(card) ? '' : 'none';
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    updateFilters();
  });
});

[sizeFilter, materialFilter, colorFilter].forEach((select) => {
  select.addEventListener('change', updateFilters);
});

function updateCart() {
  cartItemsElement.innerHTML = '';
  if (cart.length === 0) {
    cartItemsElement.innerHTML = '<p class="cart-empty">Din varukorg är tom.</p>';
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.details}</p>
      <p><strong>${item.price} kr</strong></p>
      <button class="remove-button" data-index="${index}">Ta bort</button>
    `;

    cartItemsElement.appendChild(cartItem);
  });

  if (cart.length > 0) {
    const removeButtons = cartItemsElement.querySelectorAll('.remove-button');
    removeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        cart.splice(Number(button.dataset.index), 1);
        updateCart();
      });
    });
  }

  cartSubtotal.textContent = `${subtotal} kr`;
  const shippingPrice = subtotal >= 599 ? 0 : shippingRates[shippingMethod.value];
  shippingCostElement.textContent = `${shippingPrice} kr`;
  cartTotal.textContent = `${subtotal + shippingPrice} kr`;
}

function addToCart(card) {
  const item = {
    name: card.querySelector('h3').textContent,
    details: card.querySelector('.product-meta').textContent,
    price: Number(card.dataset.price),
  };

  cart.push(item);
  updateCart();
}

productCards.forEach((card) => {
  const button = card.querySelector('.add-button');
  if (button) {
    button.addEventListener('click', () => addToCart(card));
  }
});

shippingMethod.addEventListener('change', updateCart);
updateFilters();
updateCart();
