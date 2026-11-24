
// 1. Массив товаров

const products = [
  {
    id: 1,
    name: "Oversized T-shirt",
    category: "Футболки",
    price: 2490,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
  },
  {
    id: 2,
    name: "Classic Hoodie",
    category: "Худи",
    price: 4990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
  },
  {
    id: 3,
    name: "Minimal Sweatshirt",
    category: "Свитшоты",
    price: 3990,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"
  },
  {
    id: 4,
    name: "Casual Jacket",
    category: "Куртки",
    price: 7990,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"
  }
];

// 2. Находим контейнер товаров в HTML

const productsContainer = document.querySelector("#products");

// 3. Создаём карточки товаров



function renderProducts(category = "all") {
  productsContainer.innerHTML = "";

  // Получаем поисковый запрос
  const searchInput = document.querySelector("#product-search");
  const searchValue = searchInput.value.toLowerCase().trim();

  // Фильтруем товары по категории и названию
  const filteredProducts = products.filter(function(product) {
    const matchesCategory =
      category === "all" || product.category === category;

    const matchesSearch =
      product.name.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

// Сортируем товары по цене
const sortedProducts = [...filteredProducts];

if (sortSelect.value === "cheap") {
  sortedProducts.sort(function(a, b) {
    return a.price - b.price;
  });
}

if (sortSelect.value === "expensive") {
  sortedProducts.sort(function(a, b) {
    return b.price - a.price;
  });
}

  // Создаём карточки товаров
   sortedProducts.forEach(function(product) {
    const productCard = document.createElement("article");

    productCard.classList.add("product-card");
    productCard.dataset.productId = product.id;

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-card__info">
        <p class="product-card__category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-card__price">
          ${product.price.toLocaleString("ru-RU")} ₽
        </p>
        <button class="add-to-cart" type="button">
          Добавить в корзину
        </button>
      </div>
    `;

    productsContainer.appendChild(productCard);
  });

  // Если ничего не найдено
  if (filteredProducts.length === 0) {
    productsContainer.textContent = "Товары не найдены";
  }
}

// Находим кнопки фильтрации и поле поиска
const filterButtons = document.querySelectorAll(".filter-button");
const searchInput = document.querySelector("#product-search");
const sortSelect = document.querySelector("#sort-select");
const resetButton = document.querySelector("#reset-filters");

// Обработчики кнопок фильтрации
filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const category = button.dataset.category;

    filterButtons.forEach(function(item) {
      item.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts(category);
  });
});

// Обработчик поиска
searchInput.addEventListener("input", function() {
  const activeButton = document.querySelector(".filter-button.active");
  const category = activeButton.dataset.category;

  renderProducts(category);
});

// Обработчик сортировки
sortSelect.addEventListener("change", function() {
  const activeButton = document.querySelector(".filter-button.active");
  const category = activeButton.dataset.category;

  renderProducts(category);
});

// Сброс поиска, категории и сортировки
resetButton.addEventListener("click", function() {
  searchInput.value = "";
  sortSelect.value = "default";

  filterButtons.forEach(function(button) {
    button.classList.remove("active");
  });

  const allButton = document.querySelector(
    '.filter-button[data-category="all"]'
  );

  allButton.classList.add("active");

  renderProducts("all");
});

// Первоначальное отображение товаров
renderProducts();

// Находим элементы корзины

const savedCart = localStorage.getItem("threads-cart");

const cart = savedCart ? JSON.parse(savedCart) : [];

const cartOverlay = document.querySelector("#cart-overlay");
const openCartButton = document.querySelector("#open-cart");
const closeCartButton = document.querySelector("#close-cart");
const cartItemsContainer = document.querySelector("#cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector("#cart-total");
const toast = document.querySelector("#toast");
let toastTimer;

// Открытие и закрытие корзины

openCartButton.addEventListener("click", function() {
  cartOverlay.classList.add("active");
});

closeCartButton.addEventListener("click", function() {
  cartOverlay.classList.remove("active");
});

// Закрытие корзины клавишей Escape

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    cartOverlay.classList.remove("active");
  }
});

cartOverlay.addEventListener("click", function(event) {
  if (event.target === cartOverlay) {
    cartOverlay.classList.remove("active");
  }
});

// Добавление товара в корзину
function showToast(message = "Товар добавлен в корзину!") {
  toast.textContent = message;
  toast.classList.remove("success");
  toast.classList.add("active");

if (message.startsWith("Спасибо за заказ!")) {
  toast.classList.add("success");
}

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function() {
    toast.classList.remove("active");
  }, 3500);
}

productsContainer.addEventListener("click", function(event) {
  if (!event.target.classList.contains("add-to-cart")) {
    return;
  }

  const productCard = event.target.closest(".product-card");
  const productIndex = Array.from(
    productsContainer.children
  ).indexOf(productCard);

  const product = productCard.dataset.productId;

  // Находим товар по его ID
  const selectedProduct = products.find(function(item) {
    return item.id === Number(product);
  });

  if (!selectedProduct) return;

  const existingProduct = cart.find(function(item) {
    return item.id === selectedProduct.id;
  });

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      ...selectedProduct,
      quantity: 1
    });
  }

  renderCart();
  showToast();
});

// Отображение корзины

function renderCart() {
  cartItemsContainer.innerHTML = "";

  cart.forEach(function(item) {
    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">

      <div class="cart-item__info">
        <h3>${item.name}</h3>
        <p>${item.price.toLocaleString("ru-RU")} ₽</p>

        <div class="quantity-controls">
          <button class="decrease" data-id="${item.id}" type="button">−</button>
          <span>${item.quantity}</span>
          <button class="increase" data-id="${item.id}" type="button">+</button>
        </div>

        <button class="remove-item" data-id="${item.id}" type="button">
          Удалить
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  const totalQuantity = cart.reduce(function(sum, item) {
    return sum + item.quantity;
  }, 0);

  const totalPrice = cart.reduce(function(sum, item) {
    return sum + item.price * item.quantity;
  }, 0);


  cartCount.textContent = totalQuantity;
  cartTotal.textContent = totalPrice.toLocaleString("ru-RU") + " ₽";

  if (cart.length === 0) {
    cartItemsContainer.textContent = "Корзина пока пуста";
  }

  // Сохраняем корзину в браузере
  localStorage.setItem("threads-cart", JSON.stringify(cart));
}


// Изменение количества и удаление товаров

cartItemsContainer.addEventListener("click", function(event) {
  const id = Number(event.target.dataset.id);

  if (!id) return;

  const item = cart.find(function(product) {
    return product.id === id;
  });

  if (!item) return;

  if (event.target.classList.contains("increase")) {
    item.quantity++;
  }

  if (event.target.classList.contains("decrease")) {
    item.quantity--;

    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }
  }

  if (event.target.classList.contains("remove-item")) {
    cart.splice(cart.indexOf(item), 1);
  }

  renderCart();
});

renderCart();


// Демонстрационное оформление заказа

const checkoutButton = document.querySelector(".checkout-button");

checkoutButton.addEventListener("click", function() {
  if (cart.length === 0) {
    alert("Корзина пуста! Добавьте товары перед оформлением заказа.");
    return;
  }

  const totalPrice = cart.reduce(function(sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  showToast(
    "Спасибо за заказ! Сумма: " +
    totalPrice.toLocaleString("ru-RU") +
    " ₽. Это демо — оплата не производится."
  );

    // Очищаем корзину после оформления заказа
  cart.length = 0;
  renderCart();
  cartOverlay.classList.remove("active");
});

// Переключение светлой и тёмной темы

const themeToggle = document.querySelector("#theme-toggle");

// Проверяем системную тему устройства
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

// Получаем сохранённую тему
const savedTheme = localStorage.getItem("threads-theme");

// Выбираем тему
const initialDark =
  savedTheme === "dark" ||
  (savedTheme === null && systemPrefersDark);

// Применяем тему
document.body.classList.toggle("dark-theme", initialDark);
themeToggle.textContent = initialDark ? "☀️" : "🌙";

// Обработчик переключения темы
themeToggle.addEventListener("click", function() {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");

  themeToggle.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem(
    "threads-theme",
    isDark ? "dark" : "light"
  );
});