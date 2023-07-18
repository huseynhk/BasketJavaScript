let currentProducts = products;
let categories = new Set();
let basket = [];
let addToBasketButtons;
const productsSection = document.querySelector(".products");
const basketTotalQuantitySpan = document.querySelector(".basket-total");
const basketProductsDiv = document.querySelector(".basket-products");

const calculateTotalQuantity = (basketArray) => {
  return basketArray.reduce((sum, item) => sum + item.quantity, 0);
};

const saveBasketToLocalStorage = () => {
  localStorage.setItem("basket", JSON.stringify(basket));
};

const loadBasketFromLocalStorage = () => {
  const savedBasket = localStorage.getItem("basket");
  if (savedBasket) {
    basket = JSON.parse(savedBasket);
  }
  const totalQuantity = calculateTotalQuantity(basket);
  basketTotalQuantitySpan.innerHTML = totalQuantity;
};

const addToBasket = (event) => {
  const selectedId = parseInt(event.target.dataset.id);
  const key = currentProducts.findIndex((product) => product.id === selectedId);
  const productToAdd = currentProducts[key];
  // console.log(productToAdd)

  const existingBasketItem = basket.find(
    (item) => item.product.id === selectedId
  );
  console.log(existingBasketItem);

  if (existingBasketItem) {
    existingBasketItem.quantity += 1;
  } else {
    basket.push({ product: productToAdd, quantity: 1 });
  }

  saveBasketToLocalStorage();
  const totalQuantity = calculateTotalQuantity(basket);
  basketTotalQuantitySpan.innerHTML = totalQuantity;
  renderBasketItems();
};

const renderProducts = (items) => {
  productsSection.innerHTML = "";
  items.forEach((item) => {
    const newProduct = document.createElement("div");
    newProduct.className = `product-item ${item.sale ? "on-sale" : ""}`;
    newProduct.innerHTML = `
    <img src="${item.image}" alt="product-image" />
    <p class="product-name">${item.name}</p>
    <p class="product-description">
   ${item.description}
    </p>
    <div class="product-price">
    <span class="price">${item.price.toFixed(2)} $</span>
    <span class="price-sale">${(item.price - item.saleAmount).toFixed(
      2
    )} $</span>
    </div>
    <button data-id="${
      item.id
    }" class="product-add-to-basket-btn">Add to Cart</button>
    <p class="product-item-sale-info">Special Offer</p>`;

    productsSection.appendChild(newProduct);
  });

  addToBasketButtons = document.querySelectorAll(".product-add-to-basket-btn");
  addToBasketButtons.forEach((btn) =>
    btn.addEventListener("click", addToBasket)
  );
};

//Basket
const renderBasketItems = () => {
  basketProductsDiv.innerHTML = "";
  let totalPrice = 0; 
  basket.forEach((item) => {
    const basketItemDiv = document.createElement("div");
    basketItemDiv.className = "product-item";
    basketItemDiv.innerHTML = `
      <img src="${item.product.image}" alt="product-image" />
      <p class="basket-product-name">${item.product.name}</p>
      <p class="basket-product-quantity">
        <button class="quantity-btn minus-btn" data-id="${
          item.product.id
        }">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn plus-btn" data-id="${
          item.product.id
        }">+</button>
      </p>
      <p class="basket-product-price">${(
        item.product.price
      ).toFixed(2)} $</p>
      <p class="basket-product-price">${(
        item.product.price * item.quantity
      ).toFixed(2)} $</p>
      <button class="remove-btn" data-id="${item.product.id}">Remove</button>
    `;
    basketProductsDiv.appendChild(basketItemDiv);
    totalPrice += item.product.price * item.quantity;
  });

  const basketTotalPriceDiv = document.querySelector(".basket-total-price");
  basketTotalPriceDiv.innerHTML = `<span class="total">Total Price:</span> $${totalPrice.toFixed(2)}`;

  const plusButtons = document.querySelectorAll(".plus-btn");
  const minusButtons = document.querySelectorAll(".minus-btn");
  const removeButtons = document.querySelectorAll(".remove-btn");

  plusButtons.forEach((button) => {
    button.addEventListener("click", increaseQuantity);
  });

  minusButtons.forEach((button) => {
    button.addEventListener("click", decreaseQuantity);
  });
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromBasket);
  });
};

const increaseQuantity = (event) => {
  const selectedId = parseInt(event.target.dataset.id);
  const selectedBasketItem = basket.find(
    (item) => item.product.id === selectedId
  );

  if (selectedBasketItem) {
    selectedBasketItem.quantity += 1;
    saveBasketToLocalStorage();
    renderBasketItems();
    loadBasketFromLocalStorage();
  }
};

const decreaseQuantity = (event) => {
  const selectedId = parseInt(event.target.dataset.id);
  const selectedBasketItem = basket.find(
    (item) => item.product.id === selectedId
  );

  if (selectedBasketItem) {
    if (selectedBasketItem.quantity === 1) { // 1 den artiq element vars minus ele
      return; 
    }
    selectedBasketItem.quantity -= 1;

    // Remove the item from the basket if the quantity becomes 0
    if (selectedBasketItem.quantity === 0) {
      const itemIndex = basket.indexOf(selectedBasketItem);
      if (itemIndex === 0) { //itemIndex !== -1
        basket.splice(itemIndex, 1);
      }
    }

    saveBasketToLocalStorage();
    renderBasketItems();
    loadBasketFromLocalStorage();
  }
};

const removeFromBasket = (event) => {
  const selectedId = parseInt(event.target.dataset.id);
  const selectedBasketItem = basket.find(
    (item) => item.product.id === selectedId
  );

  if (selectedBasketItem) {
    const itemIndex = basket.indexOf(selectedBasketItem);
    if (itemIndex !== -1) {
      basket.splice(itemIndex, 1);
      saveBasketToLocalStorage();
      renderBasketItems();
      const totalQuantity = calculateTotalQuantity(basket);
      basketTotalQuantitySpan.innerHTML = totalQuantity;
    }
  }
};

const renderCategories = (items) => {
  for (let i = 0; i < items.length; i++) {
    categories.add(items[i].category);
  }
  // console.log(categories);

  const categoriesItems = document.querySelector(".categories-items");

  categories = ["All", ...categories];
  // console.log(categories);

  categories.forEach((category, index) => {
    const newCategoryBtn = document.createElement("button");
    newCategoryBtn.innerHTML = category;
    newCategoryBtn.dataset.category = category;
    //  console.log(newCategoryBtn.dataset.category);

    index === 0 ? newCategoryBtn.classList.add("active") : "";
    categoriesItems.appendChild(newCategoryBtn);
  });
};

document.onload = renderProducts(currentProducts);
document.onload = renderCategories(currentProducts);
document.onload = loadBasketFromLocalStorage();
document.onload = renderBasketItems();

const categoriesButtons = document.querySelectorAll(".categories-items button");
categoriesButtons.forEach((btn) =>
  btn.addEventListener("click", (event) => {
    const category = event.target.dataset.category; // click olan categorynin datasetin gotur
    // console.log(event.target.dataset.category);

    categoriesButtons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    currentProducts = products;
    if (category === "All") {
      currentProducts = products;
    } else {
      currentProducts = currentProducts.filter(
        (product) => product.category === category
      );
    }

    renderProducts(currentProducts);
  })
);

const searchBarInput = document.querySelector(".search-bar-input");

searchBarInput.addEventListener("input", (event) => {
  const search = event.target.value;

  const foundProducts = currentProducts.filter((product) => {
    if (product.name.toLowerCase().includes(search.toLowerCase())) {
      return product;
    }
  });
  console.log(foundProducts);

  const emptyState = document.querySelector(".empty-state");

  foundProducts.length === 0
    ? emptyState.classList.add("active")
    : emptyState.classList.remove("active");

  renderProducts(foundProducts);
});
