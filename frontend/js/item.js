document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const itemDetailContainer = document.getElementById('item-detail');
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');

    if (!itemId) {
        itemDetailContainer.innerHTML = '<h2>Error: Item ID not found.</h2>';
        return;
    }

    const fetchItem = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/marketplace/${itemId}`);
            const item = await response.json();
            document.title = `${item.itemName} - Playlink`;

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
                        <a href="#" class="btn btn-primary">Purchase Item</a>
                    </div>
                </div>
            `;
        } catch (error) {
            itemDetailContainer.innerHTML = '<h2>Error loading item.</h2>';
        }
    };
    fetchItem();
});