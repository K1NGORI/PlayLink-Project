document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const itemDetailContainer = document.getElementById('item-detail');
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');
    const user = JSON.parse(localStorage.getItem('playlinkUser'));

    if (!itemId) {
        itemDetailContainer.innerHTML = '<h2>Error: Item ID not found.</h2>';
        return;
    }

    const fetchItem = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/marketplace/${itemId}`);
            const item = await response.json();
            if (!item) throw new Error('Item not found.');

            document.title = `${item.itemName} - Playlink`;

            let purchaseSectionHTML = '';
            if (item.status === 'available') {
                purchaseSectionHTML = `<a href="#" id="purchase-btn" class="btn btn-primary">Purchase Item</a>`;
            } else if (item.status === 'in_escrow') {
                purchaseSectionHTML = `<a href="#" class="btn btn-secondary disabled">Sale Pending</a>`;
            } else {
                purchaseSectionHTML = `<a href="#" class="btn btn-secondary disabled">Sold</a>`;
            }

            const authorUsername = post.author ? post.author.username : 'Unknown';
            itemDetailContainer.innerHTML = `
                <div class="post-full-content">
                    <h1>${item.itemName}</h1>
                    <div class="post-meta">
                        Listed by ${item.seller ? item.seller.username : 'Unknown'} on ${new Date(item.createdAt).toLocaleDateString()}
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

            if (item.status === 'available') {
                const purchaseBtn = document.getElementById('purchase-btn');
                purchaseBtn.addEventListener('click', handlePurchase);
            }

        } catch (error) {
            itemDetailContainer.innerHTML = '<h2>Error loading item.</h2>';
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
                if (!response.ok) throw new Error(data);

                // Reload the page to show the updated item status
                window.location.reload();

            } catch (error) {
                purchaseMessage.style.color = 'var(--secondary-neon)';
                purchaseMessage.textContent = 'Error: ' + error.message;
            }
        }
    };

    fetchItem();
});