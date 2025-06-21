// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000'; // Your backend server URL
    const postsContainer = document.getElementById('posts-container');
    const marketplaceContainer = document.getElementById('marketplace-container');

    // Function to fetch and display forum posts
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/posts`);
            const posts = await response.json();

            postsContainer.innerHTML = ''; // Clear placeholder

            posts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100)}...</p> 
                    <div class="card-footer">
                        <span>Posted on: ${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                `;
                postsContainer.appendChild(card);
            });

        } catch (error) {
            postsContainer.innerHTML = '<div class="card-placeholder">Failed to load posts.</div>';
            console.error('Error fetching posts:', error);
        }
    };

    // Function to fetch and display marketplace items
    const fetchMarketplaceItems = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/marketplace`);
            const items = await response.json();

            marketplaceContainer.innerHTML = ''; // Clear placeholder

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${item.itemName}</h3>
                    <p>${item.description.substring(0, 100)}...</p>
                    <div class="card-footer">
                        <span>Price: ${item.price} GC</span>
                    </div>
                `;
                marketplaceContainer.appendChild(card);
            });

        } catch (error) {
            marketplaceContainer.innerHTML = '<div class="card-placeholder">Failed to load items.</div>';
            console.error('Error fetching marketplace items:', error);
        }
    };

    // Initial data fetch
    fetchPosts();
    fetchMarketplaceItems();
});