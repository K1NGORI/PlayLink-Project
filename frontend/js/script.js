// frontend/script.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/posts')
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById('posts');
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
                postsContainer.appendChild(postElement);
            });
        });

    fetch('http://localhost:5000/marketplace')
        .then(response => response.json())
        .then(data => {
            const marketplaceContainer = document.getElementById('marketplace');
            data.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.innerHTML = `<h3>${item.itemName}</h3><p>${item.description}</p><p>Price: ${item.price}</p>`;
                marketplaceContainer.appendChild(itemElement);
            });
        });
});