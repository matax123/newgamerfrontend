//HTML functions

function createProductElement(id, title, category, price, img, quantity) {
    return html = `
        <div class="rounded-lg product-card flex flex-col justify-between hidden" data-product-id="${id}">
            <div>
                <div class="relative w-full h-48 overflow-hidden" style="padding-top: 100%;">
                    <a href="../../vista/producto/index.html?id=${id}" class="absolute inset-0">
                        <img src="${img}" alt="Graphics Card" class="absolute inset-0 w-full h-full object-cover">
                    </a>
                </div>
                <h2 class="text-xl font-semibold pt-2">${title}</h2>
                <p class="text-gray-400">${category}</p>
                <p class="text-lg mt-2">$${price}</p>
            </div>
            <div class="flex justify-center">
                <button class="productNotInCard hidden mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" onclick="addProduct(${id})">
                    Agregar al carrito
                </button>
            </div>
            <div class="productInCart mt-3 hidden flex flex-row justify-center items-center gap-5 ">
                <button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" onclick="addProduct(${id})">
                    +
                </button>
                <span class="quanity font-bold">${quantity}</span>
                <button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" onclick="removeProduct(${id})">
                    -
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
    filterProducts(event.target.value);
    window.history.replaceState({}, '', '?category=' + event.target.value);
}
selectCategory.addEventListener('change', onCategoryChange);

async function filterProducts(category){
    let productGrid = document.getElementById('product-grid');
    let productsLists = Array.from(productGrid.children);
    if(category == 'TODO') {
        productsLists.forEach(product => {
            if(product.classList.contains('hidden')) product.classList.remove('hidden');
        });
    }
    else {
        productsLists.forEach(product => {
            if(product.querySelector('p').innerText != category) product.classList.add('hidden');
            else product.classList.remove('hidden');
        });
    }
}

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

    productsLists.forEach(product => {
        let filesNames = product.imageName.split(',');
        let imageUrl = backendUrl + "/GetImage?fileName=" + filesNames[0];
        let price = product.price.toLocaleString('es-CL');
        productGrid.innerHTML += createProductElement(product.id, product.name, product.category, price, imageUrl, product.quantity);
    });
    refreshProductInCart();
}

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
    categories = ['TODO', ...categories];
    categories.forEach(category => {
        selectCategory.innerHTML += createCategoryElement(category);
    });
    if(categories.includes(category)) selectCategory.value = category;
    else {
        selectCategory.value = 'TODO';
    }
}

waitToLoadFunction = async function () {
    // Run both functions in parallel and wait for both to finish
    await Promise.all([loadProducts(), loadCategories()]);
    await filterProducts(selectCategory.value);
};