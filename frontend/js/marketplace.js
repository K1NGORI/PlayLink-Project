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
                const authorUsername = post.author ? post.author.username : 'Unknown';
itemCard.innerHTML = `
    <div class="card-image-container">
        <img src="${item.imageUrl}" alt="${item.itemName}" class="card-image">
    </div>
    <div class="card-content">
        <h3>${item.itemName}</h3>
        <p class="item-price">${item.price} GC</p>
        <div class="card-footer">
            <span>By: <a href="profile.html?user=${sellerUsername}" class="user-link" onclick="event.stopPropagation()">${sellerUsername}</a></span>
            <span><span class="status-${item.status}">${item.status}</span></span>
        </div>
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