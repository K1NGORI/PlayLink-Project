document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const itemDetailContainer = document.getElementById('item-detail');
    
    // Get the post ID from the URL query parameter
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');
    const user = JSON.parse(localStorage.getItem('playlinkUser'));

    if (!itemId) {
        itemDetailContainer.innerHTML = '<h2>Error: Item ID not found in URL.</h2>';
        return;
    }

    const fetchItem = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/marketplace/${itemId}`);
            if (!response.ok) throw new Error('Item not found.');
            const item = await response.json();

            document.title = `${item.itemName} - Playlink`;

            let purchaseSectionHTML = '';
            // Determine which button to show
            if (item.status === 'available') {
                if (user && user.id === item.seller._id) {
                    // Show a disabled button if the user is the seller
                    purchaseSectionHTML = `<a href="#" class="btn btn-secondary disabled">You own this item</a>`;
                } else {
                    // Show the purchase button for other users
                    purchaseSectionHTML = `<button id="purchase-btn" class="btn btn-primary">Purchase Item</button>`;
                }
            } else if (item.status === 'in_escrow') {
                purchaseSectionHTML = `<button class="btn btn-secondary disabled">Sale Pending</button>`;
            } else {
                purchaseSectionHTML = `<button class="btn btn-secondary disabled">Sold</button>`;
            }

            itemDetailContainer.innerHTML = `
                <div class="post-full-content">
                    <h1>${item.itemName}</h1>
                    <div class="post-meta">
                        Listed by <a href="profile.html?user=${item.seller.username}" class="user-link">${item.seller.username}</a> on ${new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div class="item-detail-image-container">
                        <img src="${item.imageUrl}" alt="${item.itemName}" />
                    </div>
                    <div class="post-body">
                        ${item.description.replace(/\n/g, '<br>')}
                    </div>
                    <div class="item-purchase-section">
                        <p class="item-price-large">${item.price} GC</p>
                        ${purchaseSectionHTML}
                    </div>
                    <div id="purchase-message" class="form-message"></div>
                </div>
            `;

            // Add the event listener ONLY if the purchase button exists
            if (item.status === 'available' && (!user || user.id !== item.seller._id)) {
                const purchaseBtn = document.getElementById('purchase-btn');
                purchaseBtn.addEventListener('click', handlePurchase);
            }

        } catch (error) {
            itemDetailContainer.innerHTML = '<h2>Error loading item. Please try again.</h2>';
            console.error('Error fetching item:', error);
        }
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        const purchaseMessage = document.getElementById('purchase-message');

        if (!user) {
            purchaseMessage.style.color = 'var(--secondary-neon)';
            purchaseMessage.textContent = 'You must be logged in to purchase items.';
            return;
        }

        if (confirm('Are you sure you want to purchase this item? The funds will be held in escrow.')) {
            try {
                const response = await fetch(`${apiBaseUrl}/transactions/initiate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId, buyerId: user.id })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.Error || 'Transaction failed');

                // Reload the page to show the updated item status and user balance
                window.location.reload();

            } catch (error) {
                purchaseMessage.style.color = 'var(--secondary-neon)';
                purchaseMessage.textContent = 'Error: ' + error.message;
            }
        }
    };

    fetchItem();
});