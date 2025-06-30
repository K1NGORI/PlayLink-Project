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
                const itemCard = document.createElement('div');
                itemCard.className = 'card item-card';

                const sellerUsername = item.seller ? item.seller.username : 'Unknown';
                
                itemCard.innerHTML = `
                    <a href="item.html?id=${item._id}" class="card-image-link">
                        <div class="card-image-container">
                            <img src="${item.imageUrl}" alt="${item.itemName}" class="card-image">
                        </div>
                    </a>
                    <div class="card-content">
                        <h3><a href="item.html?id=${item._id}">${item.itemName}</a></h3>
                        <p class="item-price">${item.price} GC</p>
                        <div class="card-footer">
                            <span>By: <a href="profile.html?user=${sellerUsername}" class="user-link">${sellerUsername}</a></span>
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