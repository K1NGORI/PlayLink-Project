document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const offerContainer = document.getElementById('offer-container');
    const params = new URLSearchParams(window.location.search);
    const requestedItemId = params.get('requesting');
    const user = JSON.parse(localStorage.getItem('playlinkUser'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    if (!requestedItemId) {
        offerContainer.innerHTML = '<h2>Error: No item specified to trade for.</h2>';
        return;
    }

    const loadOfferPage = async () => {
        try {
            // Fetch the item being requested
            const requestedItemRes = await fetch(`${apiBaseUrl}/marketplace/${requestedItemId}`);
            const requestedItem = await requestedItemRes.json();

            // Fetch the logged-in user's available items to offer
            const userItemsRes = await fetch(`${apiBaseUrl}/marketplace/user/${user.id}`);
            const userItems = await userItemsRes.json();
            const tradeableItems = userItems.filter(item => item.status === 'available');

            let yourItemsHTML = '<h4>You have no available items to trade.</h4>';
            if (tradeableItems.length > 0) {
                yourItemsHTML = '<h4>Select one of your items to offer:</h4><ul class="trade-item-selection-list">';
                tradeableItems.forEach(item => {
                    yourItemsHTML += `
                        <li>
                            <input type="radio" name="offeredItem" value="${item._id}" id="item-${item._id}">
                            <label for="item-${item._id}">
                                <img src="${item.imageUrl}" alt="${item.itemName}">
                                <span>${item.itemName}</span>
                            </label>
                        </li>
                    `;
                });
                yourItemsHTML += '</ul><button id="submit-offer-btn" class="btn btn-primary">Submit Trade Offer</button>';
            }

            offerContainer.innerHTML = `
                <div class="trade-offer-grid">
                    <div class="trade-panel">
                        <h3>Your Offer</h3>
                        <div id="your-items-list">
                            ${yourItemsHTML}
                        </div>
                    </div>
                    <div class="trade-arrow"><i class="fa-solid fa-right-left"></i></div>
                    <div class="trade-panel">
                        <h3>Their Item</h3>
                        <div class="trade-item-display">
                            <img src="${requestedItem.imageUrl}" alt="${requestedItem.itemName}">
                            <span>${requestedItem.itemName}</span>
                            <p>Owned by: ${requestedItem.seller.username}</p>
                        </div>
                    </div>
                </div>
                <div id="offer-message" class="form-message"></div>
            `;

            if (document.getElementById('submit-offer-btn')) {
                document.getElementById('submit-offer-btn').addEventListener('click', async () => {
                    const selectedItemInput = document.querySelector('input[name="offeredItem"]:checked');
                    if (!selectedItemInput) {
                        alert('Please select an item to offer.');
                        return;
                    }
                    const offeredItemId = selectedItemInput.value;
                    const offerMessage = document.getElementById('offer-message');

                    try {
                        const response = await fetch(`${apiBaseUrl}/trades/create`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                offeredBy: user.id,
                                offeredItemId: offeredItemId,
                                requestedFrom: requestedItem.seller._id,
                                requestedItemId: requestedItem._id
                            })
                        });
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.Error || 'Failed to send offer.');

                        offerMessage.style.color = 'var(--primary-neon)';
                        offerMessage.textContent = 'Trade offer sent successfully!';
                        document.getElementById('your-items-list').innerHTML = '<h4>Offer Sent!</h4>';

                    } catch (error) {
                        offerMessage.style.color = 'var(--secondary-neon)';
                        offerMessage.textContent = `Error: ${error.message}`;
                    }
                });
            }

        } catch (error) {
            offerContainer.innerHTML = `<h2>Error loading page: ${error.message}</h2>`;
        }
    };

    loadOfferPage();
});