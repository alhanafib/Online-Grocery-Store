// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const emptyCartMessage = document.getElementById('empty-cart-message');
const featuredProductsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-4.gap-8');

// Sample product data
const products = [
    {
        id: 1,
        name: "Organic Apples",
        category: "Fruits",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.5,
        unit: "per lb"
    },
    {
        id: 2,
        name: "Fresh Milk",
        category: "Dairy",
        price: 4.49,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.8,
        unit: "1 gallon"
    },
    {
        id: 3,
        name: "Whole Wheat Bread",
        category: "Bakery",
        price: 2.99,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
        rating: 4.3,
        unit: "loaf"
    },
    {
        id: 4,
        name: "Avocados",
        category: "Fruits",
        price: 2.49,
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        rating: 4.7,
        unit: "each"
    },
    {
        id: 5,
        name: "Free Range Eggs",
        category: "Dairy",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        rating: 4.9,
        unit: "dozen"
    },
    {
        id: 6,
        name: "Orange Juice",
        category: "Beverages",
        price: 3.79,
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1212&q=80",
        rating: 4.4,
        unit: "64 oz"
    },
    {
        id: 7,
        name: "Bananas",
        category: "Fruits",
        price: 0.69,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
        rating: 4.6,
        unit: "per lb"
    },
    {
        id: 8,
        name: "Greek Yogurt",
        category: "Dairy",
        price: 1.29,
        image: "https://www.thecandidcooks.com/wp-content/uploads/2025/06/greek-yogurt-dessert-parfait-v4.jpg",
        rating: 4.5,
        unit: "5.3 oz"
    }
];

// Cart state
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderFeaturedProducts();
    loadCartFromStorage();
    updateCartUI();
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Cart functionality
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    
    // Close cart when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('animate-slide-in');
    
    // Change icon
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.className = 'fas fa-bars text-xl';
    } else {
        icon.className = 'fas fa-times text-xl';
    }
}

function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
}

// Cart Functions
function openCart() {
    cartModal.classList.remove('hidden');
    cartModal.classList.add('flex');
    renderCartItems();
}

function closeCart() {
    cartModal.classList.add('hidden');
    cartModal.classList.remove('flex');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Update UI
    updateCartUI();
    saveCartToStorage();
    showToast(`${product.name} added to cart!`);
    
    // Animate cart badge
    cartCountElement.classList.add('added');
    setTimeout(() => {
        cartCountElement.classList.remove('added');
    }, 300);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    renderCartItems();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
        saveCartToStorage();
        renderCartItems();
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    
    // Show/hide empty cart message
    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
    } else {
        emptyCartMessage.classList.add('hidden');
    }
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p id="empty-cart-message" class="text-center text-gray-500 py-8">Your cart is empty</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center justify-between border-b pb-4';
        cartItem.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="ml-4">
                    <h4 class="font-semibold text-gray-800">${item.name}</h4>
                    <p class="text-gray-600 text-sm">${item.unit}</p>
                    <p class="text-green-700 font-bold">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex items-center">
                <div class="flex items-center border rounded-lg">
                    <button class="px-3 py-1 text-gray-600 hover:text-gray-800 decrement-btn" data-id="${item.id}">-</button>
                    <span class="px-3 py-1 border-x">${item.quantity}</span>
                    <button class="px-3 py-1 text-gray-600 hover:text-gray-800 increment-btn" data-id="${item.id}">+</button>
                </div>
                <button class="ml-4 text-red-500 hover:text-red-700 remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.decrement-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

// Featured Products
function renderFeaturedProducts() {
    if (!featuredProductsContainer) return;
    
    featuredProductsContainer.innerHTML = '';
    
    // Show first 8 products as featured
    products.slice(0, 8).forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-xl shadow-md overflow-hidden product-card';
        productCard.innerHTML = `
            <div class="h-48 overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-110 transition duration-500">
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-lg text-gray-800">${product.name}</h3>
                        <p class="text-gray-500 text-sm">${product.category}</p>
                    </div>
                    <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">${product.unit}</span>
                </div>
                
                <div class="flex items-center mt-2">
                    <div class="flex text-yellow-400">
                        ${getStarRating(product.rating)}
                    </div>
                    <span class="text-gray-500 text-sm ml-2">${product.rating}</span>
                </div>
                
                <div class="flex justify-between items-center mt-4">
                    <span class="text-2xl font-bold text-green-700">$${product.price.toFixed(2)}</span>
                    <button class="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300 add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus mr-2"></i>Add
                    </button>
                </div>
            </div>
        `;
        
        featuredProductsContainer.appendChild(productCard);
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function getStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-3 text-xl"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Local Storage functions
function saveCartToStorage() {
    localStorage.setItem('freshmart-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('freshmart-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Set current year in footer
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('#currentYear');
yearElements.forEach(el => {
    if (el) el.textContent = currentYear;
});