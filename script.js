document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const modal = document.getElementById('orderModal');
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const categoryHeaders = document.querySelectorAll('.category-header');
    const cartButton = document.getElementById('cartButton');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Shopping cart state
    let cart = [];

    // Initialize categories
    // (Dropdown logic removed)

    // Product database
    const productDB = {
        'test-tubes': [
            {
                id: 'grizzly-chair',
                name: 'Grizzly Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-1.jpg',
                variations: [
                    { label: 'Gray Cloth', price: 799 },
                    { label: 'Green Cloth', price: 799 },
                    { label: 'Terracotta Cordury', price: 850 },
                    { label: 'Yellow Cordury', price: 850 }
                ]
            },
            {
                id: 'gatsby-chair',
                name: 'Gatsby Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-2.jpg',
                variations: [
                    { label: 'Oak Wood', price: 450 }
                ]
            },
            {
                id: 'mafia-chair',
                name: 'Mafia Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-6.jpg',
                variations: [
                    { label: 'Brown Leather', price: 2400 },
                    { label: 'Black Leather', price: 2400 }
                ]
            },
            {
                id: 'book-stand',
                name: 'Book Stand',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/book-stand.jpg',
                variations: [
                    { label: 'Oak Wood', price: 1200 }
                ]
            },
            {
                id: 'orthodox-chair',
                name: 'Orthodox Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-5.jpg',
                variations: [
                    { label: 'Teak Wood', price: 550 }
                ]
            },
            {
                id: 'artistic-chair',
                name: 'Artistic Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-10.jpg',
                variations: [
                    { label: 'Red Wood', price: 700 }
                ]
            },
            {
                id: 'godfather-chair',
                name: 'Godfather Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-9.jpg',
                variations: [
                    { label: 'Brown Leather', price: 1950 }
                ]
            },
            {
                id: 'study-desk',
                name: 'Study Desk',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/table-1.jpg',
                variations: [
                    { label: 'Oak Wood', price: 1200 }
                ]
            },
            {
                id: 'revolver-chair',
                name: 'Revolver Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-11.jpg',
                variations: [
                    { label: 'Peach Cloth', price: 999 }
                ]
            },
            {
                id: 'classic-chair',
                name: 'Classic Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-3.jpg',
                variations: [
                    { label: 'Teak Wood', price: 600 }
                ]
            },
            {
                id: 'regular-chair',
                name: 'Regular Chair',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-8.jpg',
                variations: [
                    { label: 'Cream Cloth', price: 1100 }
                ]
            },
            {
                id: 'velvet-relaxer',
                name: 'Velvet Relaxer',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-4.jpg',
                variations: [
                    { label: 'Red Velvet', price: 800 }
                ]
            },
            {
                id: 'thinned-relaxer',
                name: 'Thinned Relaxer',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ac lacus vitae risus tristique malesuada. Fusce auctor libero vel lorem fermentum, at ultrices sapien finibus. Integer non turpis ac felis tincidunt porta. Nam in erat ut metus sagittis lacinia. Pellentesque habitant morbi.',
                image: 'assets/images/chair-7.jpg',
                variations: [
                    { label: 'Orange Base', price: 670 },
                    { label: 'Orange Base', price: 670 }
                ]
            }
        ]
    };

    // Render products dynamically
    function renderProducts() {
        Object.entries(productDB).forEach(([category, products]) => {
            const list = document.getElementById(`product-list-${category}`);
            if (!list) return;
            list.innerHTML = products.map(product => `
                <div class="product-item" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>GHS ${product.variations[0].price.toFixed(2)}<p>
                    </div>
                    <button class="view-details-btn">View Details</button>
                </div>
            `).join('');
        });
    }

    // Render products on load
    renderProducts();

    // Product details modal functionality
    document.querySelectorAll('.product-categories').forEach(container => {
        container.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-details-btn')) {
                const productItem = e.target.closest('.product-item');
                const productId = productItem.dataset.productId;
                let product;
                let category;
                for (const [cat, products] of Object.entries(productDB)) {
                    product = products.find(p => p.id === productId);
                    if (product) { category = cat; break; }
                }
                if (!product) return;
                // Fill modal
                document.getElementById('modalProductName').textContent = product.name;
                document.getElementById('modalProductDescription').textContent = product.description;
                const img = document.getElementById('modalProductImage');
                img.src = product.image;
                img.alt = product.name;
                img.style.display = 'block';
                // Variations
                const variationsDiv = document.getElementById('modalProductVariations');
                variationsDiv.innerHTML = product.variations.map((v, i) => `
                    <label style="margin-right:1rem;">
                        <input type="radio" name="modalVariation" value="${i}" ${i===0?'checked':''}>
                        ${v.label}
                    </label>
                `).join('');
                // Set price for first variation
                document.getElementById('modalProductPrice').textContent = `₵${product.variations[0].price.toFixed(2)}`;
                // Store product data for add to cart
                const addToCartBtn = document.getElementById('addToCartBtn');
                addToCartBtn.dataset.productId = product.id;
                addToCartBtn.dataset.category = category;
                addToCartBtn.dataset.variationIndex = 0;
                addToCartBtn.dataset.productName = product.name;
                addToCartBtn.dataset.productPrice = product.variations[0].price;
                // Listen for variation change
                variationsDiv.querySelectorAll('input[name="modalVariation"]').forEach(input => {
                    input.addEventListener('change', function() {
                        const idx = parseInt(this.value);
                        document.getElementById('modalProductPrice').textContent = `₵${product.variations[idx].price.toFixed(2)}`;
                        addToCartBtn.dataset.variationIndex = idx;
                        addToCartBtn.dataset.productPrice = product.variations[idx].price;
                    });
                });
                document.getElementById('modalQuantity').value = 1;
                document.getElementById('productModal').style.display = 'block';
                setTimeout(() => document.getElementById('productModal').classList.add('show'), 10);
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Quantity controls
    document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
        const input = document.getElementById('modalQuantity');
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
        }
    });

    document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
        const input = document.getElementById('modalQuantity');
        input.value = parseInt(input.value) + 1;
    });

    // Add to cart functionality
    document.getElementById('addToCartBtn').addEventListener('click', function() {
        const productId = this.dataset.productId;
        const category = this.dataset.category;
        const variationIndex = parseInt(this.dataset.variationIndex);
        const product = productDB[category].find(p => p.id === productId);
        const variation = product.variations[variationIndex];
        const productName = `${product.name} (${variation.label})`;
        const price = variation.price;
        const quantity = parseInt(document.getElementById('modalQuantity').value);
        // Check if product already in cart (same id and variation)
        const cartKey = `${productId}-${variation.label}`;
        const existingItem = cart.find(item => item.cartKey === cartKey);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                cartKey,
                name: productName,
                price: price,
                quantity: quantity,
                image: product.image
            });
        }
        updateCart();
        document.getElementById('productModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Update cart display
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-img">
                <div class="cart-item-info">
                    <p>${item.name}</p>
                    <!--<p class="price">₵${item.price.toFixed(2)} each</p>-->
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-increase" data-cart-key="${item.cartKey}">+</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-decrease" data-cart-key="${item.cartKey}">−</button>
                </div>
                <div class="cart-item-total">
                    <h3>₵${(item.price * item.quantity)}</h3>
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `₵${total.toFixed(2)}`;
        
        // Remove quantity change event listeners
        // Quantity increase
        cartItems.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', function () {
                const cartKey = this.dataset.cartKey;
                const item = cart.find(i => i.cartKey === cartKey);
                if (item) {
                    item.quantity += 1;
                    updateCart();
                }
            });
        });

        // Quantity decrease
        cartItems.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', function () {
                const cartKey = this.dataset.cartKey;
                const item = cart.find(i => i.cartKey === cartKey);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.cartKey !== cartKey);
                    }
                    updateCart();
                }
            });
        });

        // Only allow removing items
        cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.cart-item');
                const productId = item.dataset.productId;
                cart = cart.filter(i => i.id !== productId);
                updateCart();
            });
        });

        // Save to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Cart modal functionality
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
        // Add show class after a small delay to trigger animation
        setTimeout(() => cartModal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    });

    

    // Load cart on page load
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = savedCart;
        updateCart();
    }


    // Close modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('show');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                event.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });

    // Close modals when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
                // Wait for animation to complete before hiding
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            document.body.style.overflow = 'auto';
        }
    });

    // Checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add some products before checking out.');
            return;
        }
        
        cartModal.classList.remove('show');
        // Wait for animation to complete before hiding cart modal
        setTimeout(() => {
            cartModal.style.display = 'none';
            modal.style.display = 'block';
            // Add show class after a small delay to trigger animation
            setTimeout(() => modal.classList.add('show'), 10);
        }, 300);
    });

    // Form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            products: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        // Generate PDF and send emails
        generatePDF(formData).then(pdfBlob => {
            sendEmails(formData, pdfBlob);
            // Close modal after successful submission
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Reset form
            orderForm.reset();
            // Clear cart
            cart = [];
            localStorage.removeItem('productCart');
            updateCart();
        });
    });
});

async function generatePDF(formData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add company header
    doc.setFontSize(20);
    doc.text('Axion Laboratory', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Order Request', 105, 30, { align: 'center' });

    // Add customer information
    doc.setFontSize(12);
    doc.text('Customer Information:', 20, 50);
    doc.setFontSize(10);
    doc.text(`Name: ${formData.name}`, 20, 60);
    doc.text(`Email: ${formData.email}`, 20, 70);
    doc.text(`Phone: ${formData.phone}`, 20, 80);
    doc.text(`Address: ${formData.address}`, 20, 90);

    // Add order details
    doc.setFontSize(12);
    doc.text('Order Details:', 20, 110);
    doc.setFontSize(10);

    let yPosition = 120;
    formData.products.forEach(product => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(`${product.name}: ${product.quantity} units @ ₵${product.price.toFixed(2)} = ₵${product.total.toFixed(2)}`, 20, yPosition);
        yPosition += 10;
    });

    // Add total amount
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: ₵${formData.totalAmount.toFixed(2)}`, 20, yPosition);

    // Add timestamp
    const now = new Date();
    doc.setFontSize(8);
    doc.text(`Order generated on: ${now.toLocaleString()}`, 20, 280);

    // Convert PDF to blob
    const pdfBlob = doc.output('blob');
    
    // Save the PDF for the user
    doc.save('axion_laboratory_order.pdf');

    return pdfBlob;
}

async function sendEmails(formData, pdfBlob) {
    try {
        // Format order details for email body
        const orderDetails = `
            Order Details:
            -----------------------------------------------
            Customer Information:
            Name: ${formData.name}
            Email: ${formData.email}
            Phone: ${formData.phone}
            Address: ${formData.address}

            Order Items:
            -----------------------------------------------
            ${formData.products.map(product => `
            ${product.name}
            Quantity: ${product.quantity}
            Price: ₵${product.price.toFixed(2)} per unit
            Subtotal: ₵${product.total.toFixed(2)}
            `).join('\n')}

            Total Amount: ₵${formData.totalAmount.toFixed(2)}

            Order Date: ${new Date().toLocaleString()}
            `;

        // Send email to customer
        const customerParams = {
            to_email: formData.email,
            to_name: formData.name,
            from_name: 'Furniture World',
            from_email: 'agbe3501@gmail.com',
            message: `Thank you for your order with Furniture World. Your order is being processed \n. Here are your order details:\n\n${orderDetails}\n\nA PDF copy of your order has been saved to your device.`
        };

        console.log('Sending customer email...');
        try {
            await emailjs.send('service_mckhap5', 'template_l0edroq', customerParams);
            console.log('Customer email sent successfully');
        } catch (customerError) {
            console.error('Customer email failed:', customerError);
            throw new Error(`Customer email failed: ${customerError.message || 'Unknown error'}`);
        }

        // Send email to Furniture World
        const axionParams = {
            to_email: 'agbe3501@gmail.com',
            to_name: 'Furniture World',
            from_name: formData.name,
            from_email: 'agbe3501@gmail.com',
            message: `New order received from ${formData.name}:\n\n${orderDetails}`
        };

        console.log('Sending Axion email...');
        try {
            await emailjs.send('service_mckhap5', 'template_l0edroq', axionParams);
            console.log('Axion email sent successfully');
        } catch (axionError) {
            console.error('Axion email failed:', axionError);
            throw new Error(`Axion email failed: ${axionError.message || 'Unknown error'}`);
        }

        // Save PDF for the user
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Split the order details into lines and add them to the PDF
        const lines = orderDetails.split('\n');
        let yPosition = 20;
        
        lines.forEach(line => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 10;
        });
        
        doc.save('axion_laboratory_order.pdf');

        alert('Your order has been submitted successfully! A confirmation email has been sent to your email address.');
    } catch (error) {
        console.error('Detailed error:', error);
        if (error.text) {
            console.error('EmailJS error details:', error.text);
        }
        if (error.message) {
            console.error('Error message:', error.message);
        }
        if (error.status) {
            console.error('Error status:', error.status);
        }
        alert(`Error sending email: ${error.message || 'Unknown error occurred'}. Please check the console for more details.`);
    }
} 
