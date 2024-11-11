// global variables
function changeDayTime() {
    const dayIcon = document.getElementById('dayIcon');
    const nightIcon = document.getElementById('nightIcon');
    if (dayTime == 'day') {
        dayTime = 'night';
        dayIcon.classList.add('hidden');
        nightIcon.classList.remove('hidden');
        document.documentElement.setAttribute('theme', 'dark');
        localStorage.setItem('dayTime', 'night');
    }
    else {
        dayTime = 'day';
        dayIcon.classList.remove('hidden');
        nightIcon.classList.add('hidden');
        document.documentElement.setAttribute('theme', 'light');
        localStorage.setItem('dayTime', 'day');
    }
}

window.onload = async function () {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (dayTime == 'day') dayIcon.classList.remove('hidden');
    else nightIcon.classList.remove('hidden');

    document.getElementById("loading").close();
    document.querySelector('.preload').classList.remove('preload');
}

// secondary functions

function startsWithNumber(str) {
    return /^\d/.test(str);
}

function customCompare(a, b) {
    const aText = a[orderSelectValue];
    const bText = b[orderSelectValue];
    const aStartsWithNumber = /^\d/.test(aText);
    const bStartsWithNumber = /^\d/.test(bText);

    if (aStartsWithNumber && !bStartsWithNumber && orderSelectDirection == 'asc') {
        return 1; // aText starts with a number, should come after bText
    }
    if (aStartsWithNumber && !bStartsWithNumber && orderSelectDirection == 'desc') {
        return -1; // aText starts with a number, should come after bText
    }
    if (!aStartsWithNumber && bStartsWithNumber && orderSelectDirection == 'asc') {
        return -1; // bText starts with a number, should come after aText
    }
    if (!aStartsWithNumber && bStartsWithNumber && orderSelectDirection == 'desc') {
        return 1; // bText starts with a number, should come after aText
    }
    else {
        // If both or neither start with a number, compare normally
        if (aText == null) console.log('aText is null');
        if (bText == null) console.log('bText is null');
        return orderSelectDirection === 'asc'
            ? aText.localeCompare(bText, undefined, { numeric: true })
            : bText.localeCompare(aText, undefined, { numeric: true });
    }
}

function closeDialogWhenClickedOutside(dialog) {
    dialog.addEventListener('mousedown', (event) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom;

        if (!isInDialog) {
            dialog.close();
        }
    });
}

function openDialog(id) {
    let dialog = document.getElementById(id);
    dialog.showModal();
}

function closeDialog(id) {
    let dialog = document.getElementById(id);
    dialog.close();
}

function createProductElement(id, title, category, price, img, quantity) {
    return html = `
        <div class="rounded-lg product-card" data-product-id="${id}">
            <div class="relative w-full h-48 overflow-hidden" style="padding-top: 100%;">
                <img src="${img}" alt="Graphics Card" class="absolute inset-0 w-full h-full object-cover">
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
        if(!productsIds.includes(parseInt(card.dataset.productId))) card.querySelector('.productNotInCard').classList.remove('hidden');
        else {
            card.querySelector('.productInCart').classList.remove('hidden');
            card.querySelector('.quanity').innerText = productsIds.filter(id => id == parseInt(card.dataset.productId)).length;
        }
    });
    if(productsQuantity > 0) {
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

productsLists = [
    {
        id: 1,
        title: 'RTX 3080',
        category: 'Graphics Card',
        price: 699,
        img: '../img/007.jpg'
    },
    {
        id: 2,
        title: 'RTX 3090',
        category: 'Graphics Card',
        price: 1499,
        img: '../img/006.avif'
    }
]

function loadProducts() {
    let productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    productsLists.forEach(product => {
        productGrid.innerHTML += createProductElement(product.id, product.title, product.category, product.price, product.img, product.quantity);
    });
    refreshProductInCart();
}

loadProducts();