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

//Start of Secondary functions

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

//End of Secondary functions

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

function createProductButton(id, title, category, price, img, quantity) {
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