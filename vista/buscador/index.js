//HTML functions

function createProductElement(id, title, category, price, img, quantity) {
    return html = `
        <div class="rounded-lg product-card" data-product-id="${id}">
            <div class="relative w-full h-48 overflow-hidden" style="padding-top: 100%;">
                <a href="../../vista/producto/index.html?id=${id}" class="absolute inset-0">
                    <img src="${img}" alt="Graphics Card" class="absolute inset-0 w-full h-full object-cover">
                </a>
            </div>
            <h2 class="text-xl font-semibold pt-2">${title}</h2>
            <p class="text-gray-400">${category}</p>
            <p class="text-lg mt-2">$${price}</p>
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
    //remove first occurence of productId
    productsIds.splice(productsIds.indexOf(productId), 1);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
}

function refreshProductInCart() {
    productsCards = document.querySelectorAll('.product-card');
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsQuantity = productsIds.length;
    productsCards.forEach(card => {
        card.querySelector('.productNotInCard').classList.add('hidden');
        card.querySelector('.productInCart').classList.add('hidden');
        if (!productsIds.includes(parseInt(card.dataset.productId))) card.querySelector('.productNotInCard').classList.remove('hidden');
        else {
            card.querySelector('.productInCart').classList.remove('hidden');
            card.querySelector('.quanity').innerText = productsIds.filter(id => id == parseInt(card.dataset.productId)).length;
        }
    });
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

let selectCategory = document.getElementById('selectCategory');
function onCategoryChange(event) {
    console.log(event.target.value);
    //change url
    window.location.href = '?category=' + event.target.value;
}
selectCategory.addEventListener('change', onCategoryChange);

//END: HTML functions


//Load functions

async function loadProducts() {
    let productGrid = document.getElementById('product-grid');

    //fetch products
    productsLists = [];
    let response = await fetch(backendUrl + '/GetProducts')
    if(response.status != 200) {
        console.log('Error fetching products');
        return;
    }
    let json = await response.json();
    productsLists = json.products;

    console.log(productsLists);
    productsLists.forEach(product => {
        productGrid.innerHTML += createProductElement(product.id, product.name, product.category, product.price, product.imageUrl, product.quantity);
    });
    refreshProductInCart();
}

loadProducts();

category = decodeURIComponent(window.location.search.split('=')[1])

function createCategoryElement(category) {
    return html = `
        <option>${category}</option>
    `
}

categories = []
async function loadCategories() {
    //fetch categories
    let response = await fetch(backendUrl + '/GetCategories')
    if(response.status != 200) {
        console.log('Error fetching categories');
        return;
    }
    let json = await response.json();
    categories = json.categories.map(item => item.name);
    categories.forEach(category => {
        selectCategory.innerHTML += createCategoryElement(category);
    });
    if(categories.includes(category)) selectCategory.value = category;
    else {
        selectCategory.value = 'TODO';
    }
}

loadCategories();