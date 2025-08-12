// ---------- This script pulls product data from the products.json files and renders them accordingly. ----------
// ---------- Ensure that products.json, script.js, index.html and styles.css are in the same directory. ----------

document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.getElementById('orderForm');
    const modal = document.getElementById('orderModal');
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cartButton = document.getElementById('cartButton');
    const cartCount = document.querySelector('.cart-count');           // <-- class selector (matches your HTML)
    const cartItems = document.querySelector('.cart-items');           // <-- class selector (matches your HTML)
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const contactBtn = document.getElementById('activate-contact-modal');
    const contactModal = document.getElementById('contactModal');

    let cart = []; // <-- initialize the cart
    
    let productDB = []; // <-- initialize the productDB

    // ---------- Fetch products.json ----------
    fetch('products.json')
        .then(resp => {
        if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
        return resp.json();
        })
        .then(data => {
        productDB = data;
        renderProductsByCategory();
        attachProductClickEvents();
        // restore cart from localStorage
        const saved = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(saved) && saved.length) {
            cart = saved;
            updateCart();
        }
        })
        .catch(err => {
        console.error('Error loading products.json:', err);
        if (productList) productList.innerHTML = '<p class="error-message">ERROR! Failed to load products.</p>';
        });

    // ---------- Render product cards ----------
    function renderProductsByCategory() {
    const container = document.querySelector('.product-categories');
    if (!container || !productDB) return;

    // Get unique categories
    const categories = [...new Set(productDB.map(p => p.category))];

    // Build HTML for each category
    container.innerHTML = categories.map(category => {
        const productsHTML = productDB
            .filter(p => p.category === category)
            .map(product => {
                const v = product.variations[0];
                return `
                    <div class="product-item" data-product-id="${product.id}">
                        <img src="${v.image.low}" alt="${escapeHtml(product.name)}">
                        <div class="product-info">
                            <h3>${escapeHtml(product.name)}</h3>
                            <p>₵${v.price.toFixed(2)}</p>
                        </div>
                        <button class="view-details-btn">View Details</button>
                    </div>
                `;
            }).join('');

        return `
            <div class="product-category">
                <h2>${escapeHtml(category)}</h2>
                <div class="product-list">
                    ${productsHTML}
                </div>
            </div>
        `;
    }).join('');
}

function attachProductClickEvents() {
    document.querySelectorAll('.product-list').forEach(list => {
        list.addEventListener('click', e => {
            const productItem = e.target.closest('.product-item');
            if (!productItem) return;

            const productId = parseInt(productItem.dataset.productId, 10);
            const product = productDB.find(p => Number(p.id) === productId);
            if (!product) return;

            openProductModal(product);
        });
    });
}

// Escape HTML helper
function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

    // ---------- Product click (whole card) ----------
    document.querySelectorAll('.product-list').forEach(list => {
        list.addEventListener('click', function (e) {
            const productItem = e.target.closest('.product-item');
            if (!productItem) return;

            const productId = parseInt(productItem.dataset.productId, 10);
            const product = productDB.find(p => Number(p.id) === productId);
            if (!product) return;

            openProductModal(product);
        });
    });

    // ---------- Fill and show product modal (re-uses existing modal DOM) ----------
    function openProductModal(product) {
        // find existing elements in the modal (they exist in your HTML)
        const nameEl = document.getElementById('modalProductName');
        const descEl = document.getElementById('modalProductDescription');
        const priceEl = document.getElementById('modalProductPrice');
        const imgEl = document.getElementById('modalProductImage');
        const variationsDiv = document.getElementById('modalProductVariations');
        const qtyInput = document.getElementById('modalQuantity');
        const addBtn = document.getElementById('addToCartBtn');

        if (!nameEl || !descEl || !priceEl || !imgEl || !variationsDiv || !qtyInput || !addBtn) {
        console.error('Product modal DOM elements are missing.');
        return;
        }

        // set content
        nameEl.textContent = product.name;
        descEl.textContent = product.description || '';
        imgEl.src = product.variations[0].image.high || product.variations[0].image.low;
        imgEl.alt = product.name;
        imgEl.style.display = 'block';

        // variations (radio list)
        variationsDiv.innerHTML = product.variations.map((v, i) => `
        <label style="margin-right:1rem;">
            <input type="radio" name="modalVariation" value="${i}" ${i === 0 ? 'checked' : ''}>
            ${escapeHtml(v.label)}
        </label>
        `).join('');

        // set price for default variation
        priceEl.textContent = `₵${product.variations[0].price.toFixed(2)}`;

        // store product data on the add button (simple state)
        addBtn.dataset.productId = product.id;
        addBtn.dataset.variationIndex = 0;
        addBtn.dataset.productName = product.name;
        addBtn.dataset.productPrice = product.variations[0].price;

        // variation change listeners
        variationsDiv.querySelectorAll('input[name="modalVariation"]').forEach(input => {
        input.addEventListener('change', function () {
            const idx = parseInt(this.value, 10);
            const v = product.variations[idx];
            priceEl.textContent = `₵${v.price.toFixed(2)}`;
            addBtn.dataset.variationIndex = idx;
            addBtn.dataset.productPrice = v.price;
        });
        });

        // reset quantity
        qtyInput.value = 1;

        // show modal
        productModal.style.display = 'block';
        setTimeout(() => productModal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    }

    // ---------- Quantity +/- controls inside product modal ----------
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    if (minusBtn && plusBtn) {
        minusBtn.addEventListener('click', () => {
        const input = document.getElementById('modalQuantity');
        if (!input) return;
        if (Number(input.value) > 1) input.value = Number(input.value) - 1;
        });
        plusBtn.addEventListener('click', () => {
        const input = document.getElementById('modalQuantity');
        if (!input) return;
        input.value = Number(input.value) + 1;
        });
    }

    // ---------- Add to cart (button inside product modal) ----------
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        // use onclick to replace previous handlers (prevents stacking)
        addToCartBtn.onclick = function () {
        const productId = parseInt(this.dataset.productId, 10);
        const variationIndex = parseInt(this.dataset.variationIndex || 0, 10);
        const qty = parseInt(document.getElementById('modalQuantity').value || 1, 10);

        const product = productDB.find(p => Number(p.id) === productId);
        if (!product) return;

        const variation = product.variations[variationIndex];
        const cartKey = `${productId}-${variation.label}`;

        const existing = cart.find(i => i.cartKey === cartKey);
        if (existing) {
            existing.quantity += qty;
        } else {
            cart.push({
            id: productId,
            cartKey,
            name: `${product.name} (${variation.label})`,
            price: variation.price,
            quantity: qty,
            image: variation.image.low
            });
        }

        updateCart();
        // hide modal
        productModal.classList.remove('show');
        setTimeout(() => productModal.style.display = 'none', 300);
        document.body.style.overflow = 'auto';
        };
    }

    // ---------- Update cart UI ----------
    function updateCart() {
        // total count
        const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;

        // render items
        if (!cartItems) return;
        cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}" data-cart-key="${item.cartKey}">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-img">
            <div class="cart-item-info">
            <p>${escapeHtml(item.name)}</p>
            </div>
            <div class="cart-item-quantity">
            <button class="quantity-increase" data-cart-key="${item.cartKey}">+</button>
            <span class="cart-qty">${item.quantity}</span>
            <button class="quantity-decrease" data-cart-key="${item.cartKey}">−</button>
            </div>
            <div class="cart-item-total">
            <h3>₵${(item.price * item.quantity).toFixed(2)}</h3>
            </div>
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        </div>
        `).join('');

        // update total amount
        const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
        if (cartTotal) cartTotal.textContent = `₵${total.toFixed(2)}`;

        // attach listeners for quantity +/- and remove
        cartItems.querySelectorAll('.quantity-increase').forEach(btn => {
        btn.addEventListener('click', function () {
            const key = this.dataset.cartKey;
            const item = cart.find(i => i.cartKey === key);
            if (item) {
            item.quantity += 1;
            updateCart();
            }
        });
        });
        cartItems.querySelectorAll('.quantity-decrease').forEach(btn => {
        btn.addEventListener('click', function () {
            const key = this.dataset.cartKey;
            const item = cart.find(i => i.cartKey === key);
            if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) cart = cart.filter(i => i.cartKey !== key);
            updateCart();
            }
        });
        });
        cartItems.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function () {
            const el = this.closest('.cart-item');
            const id = el ? Number(el.dataset.productId) : null;
            if (id !== null) {
            cart = cart.filter(i => i.id !== id);
            updateCart();
            }
        });
        });

        // save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // ---------- Restore cart on load ---------- (already done after fetch)

    // ---------- Cart modal open ----------
    if (cartButton) {
        cartButton.addEventListener('click', function (e) {
        e.preventDefault();
        cartModal.style.display = 'block';
        setTimeout(() => cartModal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
        });
    }

    // ---------- Contact modal open ----------
    if (contactBtn) {
        contactBtn.addEventListener('click', function (e) {
        e.preventDefault();
        contactModal.style.display = 'block';
        setTimeout(() => contactModal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
        });
    }

    // ---------- Close modal buttons (static ones present in HTML) ----------
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function () {
        const m = this.closest('.modal');
        if (!m) return;
        m.classList.remove('show');
        setTimeout(() => {
            m.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
        });
    });

    // close when clicking the backdrop
    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        setTimeout(() => {
            event.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
        }
    });

    // Escape key closes modals
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(m => {
            m.classList.remove('show');
            setTimeout(() => {
            m.style.display = 'none';
            document.body.style.overflow = 'auto';
            }, 300);
        });
        }
    });

    // ---------- Checkout button (open order modal) ----------
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Oops! looks like your cart is empty. Browse through our catalog and find something you like before you proceed.');
            return;
        }
        cartModal.classList.remove('show');
        setTimeout(() => {
            cartModal.style.display = 'none';
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        }, 300);
        });
    }

    // ---------- Order form submit ----------
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // build a minimal order object (you can expand)
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            products: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, total: item.price * item.quantity })),
            totalAmount: cart.reduce((s, it) => s + it.price * it.quantity, 0)
        };

        async function generatePDF(formData) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            //Shop's details
            const shopName = document.getElementById("shop-name").innerHTML;
            const shopEmail = document.getElementById("shop-email").innerHTML;

            //Generating order id
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const orderId = `ORD-${year}${month}${day}-${hours}${minutes}${seconds}`;

            // Add company header
            doc.setFontSize(20);
            doc.setFont("courier", "bold");
            doc.text(`${shopName}`, 20, 20);
            doc.setFontSize(12);
            doc.setFont("courier", "normal");
            doc.text('Order Request', 20, 25);
            doc.setFontSize(12);
            doc.text('--------------------------------------------------------------------------------------------------------------------------------------------', 105, 35, { align: 'center' });

            // Add customer information
            doc.setFontSize(12);
            doc.setFont("courier", "bold");
            doc.text('Your Details:', 20, 45);
            doc.setFontSize(10);
            doc.setFont("courier", "normal");
            doc.text(`Name: ${formData.name}`, 20, 50);
            doc.text(`Email: ${formData.email}`, 20, 55);
            doc.text(`Phone: ${formData.phone}`, 20, 60);
            doc.text(`Address: ${formData.address}`, 20, 65);
            doc.text(`Order ID: ${orderId}`, 20, 70);
            
            // Add order details
            doc.setFontSize(12);
            doc.setFont("courier", "bold");
            doc.text('Order Details:', 20, 80);
            doc.setFontSize(10);
            doc.setFont("courier", "normal");

            let yPosition = 85;
            formData.products.forEach(product => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(`${product.name}`, 20, yPosition);
                doc.text(`Qty: ${product.quantity}`, 20, yPosition += 5);
                doc.text(`Price: GHS ${product.price.toFixed(2)}`, 20, yPosition += 5);
                doc.text(`Sub Total GHS ${product.total.toFixed(2)}`, 20, yPosition += 5);
                yPosition += 7.5;
            });

            // Add total amount
            yPosition += 10;
            doc.setFontSize(20);
            doc.setFont("courier", "bold");
            doc.text(`Total Amount: GHS ${formData.totalAmount.toFixed(2)}`, 20, yPosition);

            // Add timestamp
            doc.setFontSize(8);
            doc.text(`Order generated on: ${now.toLocaleString()}`, 20, 280);

            // Convert PDF to blob
            const pdfBlob = doc.output('blob');

            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl); // opens in new tab
        }

        async function sendEmails(formData) {
        try {
            // Generate Order ID
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const orderId = `ORD-${year}${month}${day}-${hours}${minutes}${seconds}`;

            // Build the "orders" array for the email template
            const ordersArray = formData.products.map(product => ({
                name: product.name,
                units: product.quantity,
                price: product.price.toFixed(2),
                image_url: product?.variations?.[0]?.image?.low || product?.image || "", // if your product has an image URL
            }));

             //Shop's details
            const shopName = document.getElementById("shop-name").innerHTML;
            const shopEmail = document.getElementById("shop-email").innerHTML;

            // Prepare customer email parameters
            const customerParams = {
                to_email: formData.email,
                to_name: formData.name,
                from_name: `${shopName}`,
                from_email: `${shopEmail}`,
                header_message: "Thank you for your order",
                order_message: `Just to let you know, we have received your order: ${orderId}, and it is being processed.`,
                order_id: orderId,
                orders: ordersArray, // matches {{#orders}} in template
                cost: {
                    total: formData.totalAmount.toFixed(2) // matches {{cost.total}}
                },
                time_stamp: now.toLocaleString(),
                email: formData.email // matches {{email}}
            };

            console.log('Sending customer email...');
            await emailjs.send('service_mckhap5', 'template_1y2lk7p', customerParams);
            console.log('Customer email sent successfully');

            // Send notification to shop
            const orderDetails = `
                New Order Received:
                Customer: ${formData.name}
                Email: ${formData.email}
                Phone: ${formData.phone}
                Address: ${formData.address}

                Items:
                ${formData.products.map(p => `${p.name}\nQty: ${p.quantity}\n Unit price: GHS${p.price.toFixed(2)} each`).join('\n\n')}

                Total: GHS${formData.totalAmount.toFixed(2)}
                Order ID: ${orderId}
            `;

            const shopParams = {
                to_email: `${shopEmail}`,
                to_name: `${shopName}`,
                from_name: formData.name,
                from_email: formData.email,
                message: orderDetails
            };

            console.log(`Sending ${shopName} email...`);
            await emailjs.send('service_mckhap5', 'template_l0edroq', shopParams);
            console.log(`${shopName} email sent successfully`);

            alert('Your order has been submitted successfully! A confirmation email has been sent to your email address.');
        } catch (error) {
            console.error('Error sending email:', error);
            alert(`Error sending email: ${error.message || 'Unknown error occurred'}. Please check the console for more details.`);
        }
    }
    

        // If you have generatePDF/sendEmails functions in the page (from your old script), call them:
        if (typeof generatePDF === 'function' && typeof sendEmails === 'function') {
            generatePDF(formData).then(blob => {
            sendEmails(formData, blob);
            // close & reset
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }, 300);
            orderForm.reset();
            cart = [];
            localStorage.removeItem('cart');
            updateCart();
            }).catch(err => {
            console.error('PDF/email error', err);
            alert('There was an error sending the order. Check console.');
            });
        } else {
            // Fallback: just show confirmation (or implement your logic)
            alert('Order submitted (demo). Replace with your PDF/email flow.');
            modal.classList.remove('show');
            setTimeout(() => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }, 300);
            orderForm.reset();
            cart = [];
            localStorage.removeItem('cart');
            updateCart();
        }
        });
    }
    });
