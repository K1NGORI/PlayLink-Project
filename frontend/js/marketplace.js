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
                // The entire card is now a single <a> tag, making it fully clickable.
                const itemCardLink = document.createElement('a');
                itemCardLink.href = `item.html?id=${item._id}`; // This is the destination link
                itemCardLink.className = 'card item-card';

                const sellerUsername = item.seller ? item.seller.username : 'Unknown';
                
                itemCardLink.innerHTML = `
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
                itemsContainer.appendChild(itemCardLink);
            });

        } catch (error) {
            itemsContainer.innerHTML = '<div class="card-placeholder">Failed to load marketplace items. Please try again later.</div>';
            console.error('Error fetching marketplace items:', error);
        }
    };

    fetchItems();
});