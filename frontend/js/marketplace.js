document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const itemsContainer = document.getElementById('items-container');

    const fetchItems = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/marketplace`);
            const items = await response.json();
            itemsContainer.innerHTML = ''; // Clear placeholder

            items.forEach(item => {
                const itemCard = document.createElement('a');
                itemCard.href = `item.html?id=${item._id}`;
                itemCard.className = 'card item-card';
                itemCard.innerHTML = `
                    <h3>${item.itemName}</h3>
                    <p class="item-price">${item.price} GC</p>
                    <div class="card-footer">
                        <span>By: ${item.seller ? item.seller.username : 'Unknown'}</span>
                    </div>
                `;
                itemsContainer.appendChild(itemCard);
            });
        } catch (error) {
            itemsContainer.innerHTML = '<div class="card-placeholder">Failed to load items.</div>';
        }
    };
    fetchItems();
});