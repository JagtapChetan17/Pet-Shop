// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update cart count
    updateCartCount();
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            addToCart(id, name, price, image);
        });
    });
});

function addToCart(id, name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show added to cart notification
    alert(`${name} has been added to your cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCartItems();
    
    // Clear cart button
    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        localStorage.setItem('cart', JSON.stringify([]));
        renderCartItems();
        updateCartCount();
    });
    
    // Checkout button (just an alert for now)
    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert('Checkout functionality would be implemented here!');
    });
});

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" class="empty-cart">Your cart is empty</td></tr>';
        cartTotalElement.textContent = '₹0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}" width="50">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
            </td>
            <td>₹${itemTotal.toFixed(2)}</td>
            <td>
                <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        cartItemsContainer.appendChild(row);
    });
    
    cartTotalElement.textContent = `₹${total.toFixed(2)}`;
    
    // Add event listeners to quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const id = this.getAttribute('data-id');
            const newQuantity = parseInt(this.value);
            
            if (newQuantity > 0) {
                updateCartItemQuantity(id, newQuantity);
            }
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeCartItem(id);
        });
    });
}

function updateCartItemQuantity(id, quantity) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function removeCartItem(id) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}