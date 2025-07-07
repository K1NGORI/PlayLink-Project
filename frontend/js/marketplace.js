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

            itemsContainer.innerHTML = ''; 

            if (items.length === 0) {
                itemsContainer.innerHTML = '<p class="card-placeholder">The marketplace is empty. Be the first to list an item!</p>';
                return;
            }

            items.forEach(item => {
                // CHANGED: The entire card is now an <a> tag, making it fully clickable.
                const itemCard = document.createElement('a');
                itemCard.href = `item.html?id=${item._id}`; // The link for the entire card
                itemCard.className = 'card item-card';

                const sellerUsername = item.seller ? item.seller.username : 'Unknown';
                
                // The inner links are removed as the whole card is now the link.
                itemCard.innerHTML = `
                    <div class="card-image-container">
                        <img src="${item.imageUrl}" alt="${item.itemName}" class="card-image">
                    </div>
                    <div class="card-content">
                        <h3>${item.itemName}</h3>
                        <p class="item-price">${item.price} GC</p>
                        <div class="card-footer">
                            <span>By: <span class="user-link">${sellerUsername}</span></span>
                            <span><span class="status-${item.status.replace('_', '-')}">${item.status.replace('_', ' ')}</span></span>
                        </div>
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