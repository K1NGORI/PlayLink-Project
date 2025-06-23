document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const itemsContainer = document.getElementById('items-container');

    const fetchItems = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/marketplace`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const items = await response.json();

            itemsContainer.innerHTML = ''; // Clear the "Loading..." placeholder

            if (items.length === 0) {
                itemsContainer.innerHTML = '<p class="card-placeholder">The marketplace is empty. Be the first to list an item!</p>';
                return;
            }

            items.forEach(item => {
                const itemCard = document.createElement('a');
                itemCard.href = `item.html?id=${item._id}`;
                itemCard.className = 'card item-card';

                const sellerUsername = item.seller ? item.seller.username : 'Unknown';
                
                itemCard.innerHTML = `
                    <h3>${item.itemName}</h3>
                    <p class="item-price">${item.price} GC</p>
                    <div class="card-footer">
                        <span>By: <a href="profile.html?user=${sellerUsername}" class="user-link" onclick="event.stopPropagation()">${sellerUsername}</a></span>
                        <span>Status: <span class="status-${item.status}">${item.status}</span></span>
                    </div>
                `;
                itemsContainer.appendChild(itemCard);
            });

        } catch (error) {
            itemsContainer.innerHTML = '<div class="card-placeholder">Failed to load marketplace items. Please try again later.</div>';
            console.error('Error fetching marketplace items:', error);
        }
    };

    fetchItems();
});