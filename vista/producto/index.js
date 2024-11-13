let productId = window.location.search.split('=')[1];
console.log(productId);

async function loadProduct() {
    let productImage = document.getElementById('productImage')
    let productTitle = document.getElementById('productTitle')
    let productPrice = document.getElementById('productPrice')
    let productStock = document.getElementById('productStock')
    let productDescription = document.getElementById('productDescription')

    //fetch products
    product = null
    let response = await fetch(backendUrl + '/GetProducts?id=' + productId)
    if(response.status != 200) {
        throw new Error('Failed to load products: ' + response.statusText);
    }
    let json = await response.json();
    product = json.products[0];

    productImage.src = product.imageUrl;
    productTitle.innerText = product.name;
    productPrice.innerText = '$' + product.price;
    productStock.innerText = product.stock;

    html = marked.parse(product.description);
    const markdownElement = document.createElement('div');
    markdownElement.className = 'flex flex-col gap-2';
    console.log(html);
    markdownElement.innerHTML = html;
    productDescription.appendChild(markdownElement);
    // productDescription.innerText = product.description;
}

loadProduct();