function createProductItem(id, title, category, price, img, quantity) {
    return html = `
            <button class="productNotInCard hidden mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" onclick="addProduct(${id})">
                Add to Cart
            </button>
            <div class="productInCart mt-3 hidden flex flex-row justify-start items-center gap-5">
                <button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" onclick="addProduct(${id})">
                    +1
                </button>
                <span class="quanity font-bold">${quantity}</span>
                <button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" onclick="removeProduct(${id})">
                    -1
                </button>
            </div>
    `
}

function addProduct(productId) {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsIds.push(productId);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
}

function removeProduct(productId) {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsIds.splice(productsIds.indexOf(productId), 1);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
}

function refreshProductInCart() {
    let productInfo = document.querySelector('.productInfo');
    let productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsQuantity = productsIds.length;
    productInfo.querySelector('.productNotInCard').classList.add('hidden');
    productInfo.querySelector('.productInCart').classList.add('hidden');
    if (!productsIds.includes(parseInt(productDB.id))) productInfo.querySelector('.productNotInCard').classList.remove('hidden');
    else {
        productInfo.querySelector('.productInCart').classList.remove('hidden');
        productInfo.querySelector('.quanity').innerText = productsIds.filter(id => id == parseInt(productDB.id)).length;
    }
    if (productsQuantity > 0) {
        cartQuantity = document.getElementById('cartQuantity');
        cartQuantity.innerText = productsQuantity;
        cartQuantity.classList.remove('hidden');
    }
    else cartQuantity.classList.add('hidden');
}

function clearCart() {
    localStorage.removeItem('productsIds');
    loadProducts();
}

productDB = {
    id: 1,
    title: 'RTX 3080',
    category: 'Graphics Card',
    price: 699,
    img: '../img/007.jpg'
}


function loadProduct() {
    let product = document.querySelector('.product');
    let productImage = document.querySelector('.productImage');
    let productInfo = document.querySelector('.productInfo');
    productInfo.innerHTML += createProductButton(productDB.id, productDB.title, productDB.category, productDB.price, productDB.img, productDB.quantity);
    refreshProductInCart();
}

loadProduct();