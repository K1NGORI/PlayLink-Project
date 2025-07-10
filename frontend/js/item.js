document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const itemDetailContainer = document.getElementById('item-detail');
    
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');
    let user = JSON.parse(localStorage.getItem('playlinkUser'));

    if (!itemId) {
        itemDetailContainer.innerHTML = '<h2>Error: Item ID not found in URL.</h2>';
        return;
    }

    let currentItem = null;

    const renderPage = (item) => {
        currentItem = item;
        document.title = `${item.itemName} - Playlink`;

        let purchaseSectionHTML = '';
        let tradeSectionHTML = ''; // New section for the trade button

        if (item.status === 'available') {
            if (user && user.id === item.seller._id) {
                purchaseSectionHTML = `<button class="btn btn-secondary disabled">You own this item</button>`;
            } else {
                purchaseSectionHTML = `<button id="purchase-btn" class="btn btn-primary">Purchase Item</button>`;
                // Show trade button if the item is tradeable
                if (item.isTradeable) {
                    tradeSectionHTML = `<button id="trade-btn" class="btn btn-secondary">Make Trade Offer</button>`;
                }
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
                    Listed by <a href="profile.html?user=${item.seller.username}" class="user-link">${item.seller.username}</a>
                </div>
                <div class="item-detail-image-container">
                    <img src="${item.imageUrl}" alt="${item.itemName}" />
                </div>
                <div class="post-body">
                    ${item.description.replace(/\n/g, '<br>')}
                </div>
                <!-- Section for Desired Trades -->
                ${item.desiredTrade ? `
                    <div class="desired-trade-section">
                        <h4>Seller is looking for:</h4>
                        <p>${item.desiredTrade}</p>
                    </div>
                ` : ''}
                <div class="item-actions-section">
                    <div class="item-purchase-section">
                        <p class="item-price-large">${item.price} GC</p>
                        <div id="purchase-button-container">${purchaseSectionHTML}</div>
                    </div>
                    <div id="trade-button-container" class="item-trade-section">
                        ${tradeSectionHTML}
                    </div>
                </div>
                <div id="purchase-message" class="form-message"></div>
            </div>
        `;

        if (document.getElementById('purchase-btn')) {
            document.getElementById('purchase-btn').addEventListener('click', handlePurchase);
        }
        if (document.getElementById('trade-btn')) {
            document.getElementById('trade-btn').addEventListener('click', () => {
                alert('This feature is a work in progress! In a full version, this would open a new page to select an item to trade.');
            });
        }
    };

    const fetchItem = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/marketplace/${itemId}`);
            if (!response.ok) throw new Error('Item not found.');
            const item = await response.json();
            renderPage(item);
        } catch (error) {
            itemDetailContainer.innerHTML = '<h2>Error loading item. Please try again.</h2>';
        }
    };

    const handlePurchase = async (e) => {
        // ... (handlePurchase logic remains the same as previous response)
        e.preventDefault();
        const purchaseMessage = document.getElementById('purchase-message');
        purchaseMessage.textContent = '';
        if (!user) {
            purchaseMessage.style.color = 'var(--secondary-neon)';
            purchaseMessage.textContent = 'You must be logged in to purchase items.';
            return;
        }
        if (user.gc_balance < currentItem.price) {
            purchaseMessage.style.color = 'var(--secondary-neon)';
            purchaseMessage.textContent = 'Error: Insufficient GC balance.';
            return;
        }
        if (confirm(`Are you sure you want to purchase "${currentItem.itemName}" for ${currentItem.price} GC?`)) {
            try {
                const response = await fetch(`${apiBaseUrl}/transactions/initiate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId, buyerId: user.id })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.Error || 'Transaction failed');
                user.gc_balance -= currentItem.price;
                localStorage.setItem('playlinkUser', JSON.stringify(user));
                renderNavbar(); 
                purchaseMessage.style.color = 'var(--primary-neon)';
                purchaseMessage.textContent = 'Purchase successful! Funds are in escrow.';
                document.getElementById('purchase-button-container').innerHTML = `<button class="btn btn-secondary disabled">Sale Pending</button>`;
                document.getElementById('trade-button-container').innerHTML = ''; // Hide trade button
            } catch (error) {
                purchaseMessage.style.color = 'var(--secondary-neon)';
                purchaseMessage.textContent = 'Error: ' + error.message;
            }
        }
    };

    fetchItem();
});